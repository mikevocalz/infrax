"""Prepare development-only summary data. No DB connection and no publication.

Transforms verified state summaries into compact per-dataset batches. The raw
normalized NDJSON files remain separate; this imports their REVIEW SUMMARIES.
"""
import argparse,hashlib,json,pathlib,re
from normalize import SPECS,STATES
PROJECT='spring-glitter-25305067'
DEVELOPMENT='br-holy-mode-bcenb3y8'
CONSTANTS=['dataset','source_id','source_title','observation_period','entity_kind','source_url','source_package_sha256','normalization_version','output_sha256','commercial_offer','publication_approved','scope']
def prepare(directory,environment):
 if environment!='development':raise ValueError('Only development is supported')
 root=pathlib.Path(directory)
 report=json.loads((root/'reconciliation.json').read_text())
 entries=json.loads((root/'market-summaries.json').read_text())
 specs={s['id']:s for s in SPECS};records={r['dataset']:r for r in report['datasets']}
 if set(records)!=set(specs):raise ValueError('All six datasets must reconcile')
 for dataset,r in records.items():
  digest=hashlib.sha256((root/(dataset+'.ndjson')).read_bytes()).hexdigest()
  if digest!=r['output_sha256']:raise ValueError('Normalized output checksum changed')
 seen=set();packs=[]
 for dataset in specs:
  rows=[e for e in entries if e['dataset']==dataset]
  if not rows:raise ValueError('No summaries')
  first=rows[0];base={k:first[k] for k in CONSTANTS}
  if base['commercial_offer'] is not False or base['publication_approved'] is not False:raise ValueError('Publication/offer flag rejected')
  if base['normalization_version']!='infrax-context-v1':raise ValueError('Unreviewed normalization version')
  if base['output_sha256']!=records[dataset]['output_sha256'] or base['source_package_sha256']!=records[dataset]['source_package_sha256']:raise ValueError('Evidence hash mismatch')
  packed=[]
  for e in rows:
   if {k:e[k] for k in CONSTANTS}!=base:raise ValueError('Summary metadata mismatch')
   key=(dataset,e['state'])
   if key in seen or e['state'] not in STATES:raise ValueError('Invalid/duplicate state')
   seen.add(key)
   if type(e['normalized_rows']) is not int or type(e['distinct_entity_keys']) is not int or not 0<=e['distinct_entity_keys']<=e['normalized_rows']:raise ValueError('Invalid row counts')
   for k,v in e['metric_quality'].items():
    if not re.fullmatch('[a-z0-9_]+:(reported|missing|invalid)',k) or type(v) is not int or v<0:raise ValueError('Bad metric quality')
   packed.append([e['state'],e['normalized_rows'],e['distinct_entity_keys'],e['metric_quality']])
  if sum(e[1] for e in packed)!=records[dataset]['normalized_rows']:raise ValueError('Count reconciliation failed')
  base['projection']='State row counts and metric quality; status totals/row-level evidence remain in normalized artifact'
  packs.append({'base':base,'rows':packed})
 return {'project_id':PROJECT,'branch_id':DEVELOPMENT,'database_name':'infrax','environment':'development','scope':'Summary import only; zero public facilities/offers/signals created','packs':packs}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--directory',required=True);p.add_argument('--environment',required=True);p.add_argument('--output',required=True);a=p.parse_args()
 result=prepare(a.directory,a.environment);pathlib.Path(a.output).write_text(json.dumps(result,indent=2));print('Prepared',sum(len(p['rows']) for p in result['packs']),'summaries, not full row imports')
