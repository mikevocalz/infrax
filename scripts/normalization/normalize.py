"""Normalize selected official electricity/queue tables, without publishing or DB access.

Usage: python scripts/normalization/normalize.py --source-dir DIR --output-dir DIR
Original files are hash-checked against the acquired manifest. Outputs retain
source worksheet/row, raw selected tokens, units and edition. These records are
market context only: never facilities, offers, deliverable MW or current quotes.
"""
from __future__ import annotations
import argparse,collections,datetime,decimal,hashlib,io,json,pathlib,re,zipfile
from ooxml import Workbook
D=decimal.Decimal
VERSION='infrax-context-v1'
MISSING={'','--','—','NA','N/A','NM','N/M','W','*','.','Not Available','Not Applicable'}
STATES=set('AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY PR VI GU AS MP'.split())

def canonical(value):
 return json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':'),allow_nan=False)
def sha(data):return hashlib.sha256(data).hexdigest()
def text(v):return re.sub(r'\s+',' ',str(v)).strip() if v is not None else ''
def number(token,unit,nonnegative=False):
 raw=token
 if text(token) in MISSING:return {'value':None,'unit':unit,'raw':raw,'quality':'missing'}
 try:
  n=D(text(token).replace(',',''))
  if not n.is_finite() or abs(n.adjusted())>30 or (nonnegative and n<0):raise ValueError()
  # String decimal avoids binary-rounding and NaN in database/API JSON.
  return {'value':format(n,'f'),'unit':unit,'raw':raw,'quality':'reported'}
 except (decimal.InvalidOperation,ValueError):
  return {'value':None,'unit':unit,'raw':raw,'quality':'invalid'}
def iso_date(token,date1904=False):
 if text(token) in MISSING:return None
 try:
  d=D(text(token))
  if not d.is_finite() or d!=int(d) or not 1<=d<=100000:return None
  if not date1904 and d==60:return None # Excel's fictitious 1900 leap day
  origin=datetime.date(1904,1,1) if date1904 else datetime.date(1899,12,31)
  days=int(d) if date1904 else int(d)-(1 if d>60 else 0)
  return (origin+datetime.timedelta(days=days)).isoformat()
 except (decimal.InvalidOperation,ValueError,OverflowError):
  try:return datetime.date.fromisoformat(text(token)[:10]).isoformat()
  except ValueError:return None

# Exact selected slices, not a claim that every schedule in every workbook is implemented.
SPECS=[
 {'source':'S03','id':'eia860-generators-2025','file':'eia860_2025.zip','member':'3_1_Generator_Y2025.xlsx','sheets':['Operable','Proposed','Retired and Canceled'],'header':2,'period':'2025','kind':'generator_inventory','state':'State','keys':['Plant Code','Generator ID'],'name':'Plant Name','required':['Plant Code','Generator ID','State','Status','Nameplate Capacity (MW)'],'fields':['Utility ID','Technology','Prime Mover','Energy Source 1','Status'],'metrics':{'nameplate_capacity':('Nameplate Capacity (MW)','MW',True)}},
 {'source':'S04','id':'eia860m-generators-2026-09','file':'eia860m_2026-09.xlsx','sheets':['Operating','Planned','Retired','Canceled or Postponed'],'header':3,'period':'2026-09','kind':'generator_inventory','state':'Plant State','keys':['Plant ID','Generator ID'],'name':'Plant Name','required':['Plant ID','Generator ID','Plant State','Nameplate Capacity (MW)'],'fields':['Entity ID','Technology','Energy Source Code','Prime Mover Code','Status'],'metrics':{'nameplate_capacity':('Nameplate Capacity (MW)','MW',True)}},
 {'source':'S05','id':'eia861-utility-counties-2025','file':'eia861_2025.zip','member':'Service_Territory_2025.xlsx','sheets':['Counties_States'],'header':1,'period':'2025','kind':'utility_county_report','state':'State','keys':['Utility Number','State','County'],'name':'Utility Name','required':['Utility Number','State','County','Data Year'],'fields':['Data Year','Utility Number','County'],'metrics':{}},
 {'source':'S06','id':'eia923-generation-fuel-2025','file':'eia923_2025.zip','member':'EIA923_Schedules_2_3_4_5_M_12_2025_Final.xlsx','sheets':['Page 1 Generation and Fuel Data'],'header':6,'period':'2025','kind':'plant_fuel_generation','state':'Plant State','keys':['Plant Id','Nuclear Unit Id','Reported Prime Mover','Reported Fuel Type Code'],'name':'Plant Name','required':['Plant Id','Plant State','Reported Prime Mover','Reported Fuel Type Code','YEAR','Net Generation (Megawatthours)'],'fields':['Operator Id','Reported Prime Mover','Reported Fuel Type Code','Nuclear Unit Id','YEAR'],'metrics':{'net_generation':('Net Generation (Megawatthours)','MWh',False),'electric_fuel_consumption':('Elec Fuel Consumption MMBtu','MMBtu',False)}},
 {'source':'S12','id':'lbnl-queue-through-2025','file':'lbnl_queue_through_2025.xlsx','sheets':['03. Complete Queue Data'],'header':2,'period':'through-2025','kind':'generator_queue_project','state':'state','keys':['entity','q_id'],'name':'project_name','required':['entity','q_id','q_status','state','mw_1','mw_2','mw_3'],'fields':['entity','q_id','q_status','q_year','type_1','type_2','type_3','type_clean','region','county'],'metrics':{'component_1_capacity':('mw_1','MW',True),'component_2_capacity':('mw_2','MW',True),'component_3_capacity':('mw_3','MW',True)},'dates':['q_date','ia_date','on_date','wd_date']},
 {'source':'S21','id':'egrid-plants-2023-rev2','file':'egrid2023_revision2.xlsx','sheets':['PLNT23'],'header':2,'period':'2023','kind':'plant_environmental_context','state':'PSTATABB','keys':['ORISPL'],'name':'PNAME','required':['ORISPL','YEAR','PSTATABB','NAMEPCAP','PLNGENAN','PLCO2RTA'],'fields':['YEAR','ORISPL','SUBRGN','PLPRMFL','PLFUELCT','OPRCODE'],'metrics':{'nameplate_capacity':('NAMEPCAP','MW',True),'net_generation':('PLNGENAN','MWh',False),'co2_output_rate':('PLCO2RTA','lb/MWh',False)}},
]

def load_package(root,spec,manifest):
 entries=[s for s in manifest['sources'] if s['source_id']==spec['source'] and s['file']==spec['file']]
 if len(entries)!=1:raise ValueError('Exactly one manifest source required: '+spec['source'])
 entry=entries[0];path=root/spec['file']
 data=path.read_bytes()
 if len(data)>45*1024*1024 or sha(data)!=entry['sha256']:raise ValueError('Package SHA256 mismatch or size limit: '+spec['file'])
 if entry.get('status')!='downloaded_valid_archive':raise ValueError('Unverified package status')
 raw=data
 if spec.get('member'):
  with zipfile.ZipFile(io.BytesIO(data)) as z:
   if sum(i.file_size for i in z.infolist())>350*1024*1024:raise ValueError('Archive too large')
   raw=z.read(spec['member'])
 return Workbook(raw),entry

def records(w,spec,entry,report):
 for sheet in spec['sheets']:
  if sheet not in w.sheets:raise ValueError('Required worksheet missing: '+sheet)
  headings=None
  for rowno,values in w.rows(sheet):
   if rowno==spec['header']:
    headings=[text(v) for v in values]
    required=set(spec['required']+[v[0] for v in spec['metrics'].values()])
    if not required<=set(headings):raise ValueError('Missing columns '+str(required-set(headings)))
    if any(headings.count(h)>1 for h in required):raise ValueError('Ambiguous required header')
    continue
   if rowno<spec['header']:continue
   if headings is None:raise ValueError('Header row not found')
   if not any(text(v) for v in values):continue
   report['rows_scanned']+=1
   r={h:values[i] if i<len(values) else None for i,h in enumerate(headings) if h}
   state=text(r.get(spec['state']))
   if state not in STATES:
    report['excluded_state_or_footer'][state or '(blank)']+=1;continue
   first=text(r.get(spec['keys'][0]))
   if not first:
    report['rejected_missing_identifier']+=1;continue
   # Year mismatch is a hard failure, not a silent relabeling.
   yearkey=next((k for k in ['YEAR','Data Year'] if k in spec['required']),None)
   if yearkey and text(r.get(yearkey))!=spec['period']:raise ValueError('Unexpected observation year')
   selected={k:r.get(k) for k in dict.fromkeys(spec['keys']+[spec['state'],spec['name']]+spec['fields']+[m[0] for m in spec['metrics'].values()]+spec.get('dates',[]))}
   rec={'schema_version':VERSION,'dataset':spec['id'],'source_id':spec['source'],'entity_kind':spec['kind'],
    'entity_key':'|'.join(text(r.get(k)) for k in spec['keys']),'name':text(r.get(spec['name'])) or None,
    'state':state,'observation_period':spec['period'],'source_url':entry['url'],'source_package_sha256':entry['sha256'],
    'source_workbook':spec.get('member',spec['file']),'source_sheet':sheet,'source_row':rowno,
    'source_status':text(r.get('q_status') if spec['source']=='S12' else r.get('Status')) or None,
    'metrics':{key:number(r.get(field),unit,nonnegative) for key,(field,unit,nonnegative) in spec['metrics'].items()},
    'source_fields':selected,'commercial_offer':False,'verification_status':'publicly_reported_context','publication_approved':False}
   if spec.get('dates'):rec['dates']={k:{'iso':iso_date(r.get(k),getattr(w,'date1904',False)),'raw':r.get(k)} for k in spec['dates']}
   rec['record_key']=sha(canonical([spec['id'],entry['sha256'],sheet,rowno]).encode())
   rec['content_sha256']=sha(canonical(rec).encode())
   yield rec
  if headings is None:raise ValueError('Required header absent')

def normalize(source_dir,output_dir):
 root=pathlib.Path(source_dir);out=pathlib.Path(output_dir);out.mkdir(parents=True,exist_ok=True)
 (out/'reconciliation.json').unlink(missing_ok=True) # no stale success after a failed rerun
 manifest=json.loads((root/'manifest.json').read_text());results=[];summaries=[]
 for spec in SPECS:
  report={'dataset':spec['id'],'source_id':spec['source'],'rows_scanned':0,'normalized_rows':0,'rejected_missing_identifier':0,'excluded_state_or_footer':collections.Counter(),'metric_quality':collections.Counter(),'sheets':spec['sheets'],'scope':'Selected worksheets only; no DB import or publication'}
  bystate={};keys=collections.Counter();w,entry=load_package(root,spec,manifest)
  final=out/(spec['id']+'.ndjson');partial=final.with_suffix('.partial')
  try:
   with partial.open('w') as target:
    for r in records(w,spec,entry,report):
     target.write(canonical(r)+'\n');report['normalized_rows']+=1;keys[r['entity_key']]+=1
     s=bystate.setdefault(r['state'],{'count':0,'entity_keys':set(),'status_counts':collections.Counter(),'metric_quality':collections.Counter()})
     s['count']+=1;s['entity_keys'].add(r['entity_key']);s['status_counts'][r['source_status'] or r['source_sheet']]+=1
     for k,m in r['metrics'].items():report['metric_quality'][k+':'+m['quality']]+=1;s['metric_quality'][k+':'+m['quality']]+=1
   partial.replace(final)
  finally:w.close();partial.unlink(missing_ok=True)
  report['duplicate_entity_keys']=sum(v-1 for v in keys.values() if v>1)
  report['output_sha256']=sha(final.read_bytes());report['source_package_sha256']=entry['sha256']
  for state,s in sorted(bystate.items()):
   summaries.append({'dataset':spec['id'],'source_id':spec['source'],'source_title':entry['title'],'state':state,'observation_period':spec['period'],
    'entity_kind':spec['kind'],'normalized_rows':s['count'],'distinct_entity_keys':len(s['entity_keys']),
    'status_counts':dict(s['status_counts']),'metric_quality':dict(s['metric_quality']),
    'source_url':entry['url'],'source_package_sha256':entry['sha256'],'normalization_version':VERSION,
    'output_sha256':report['output_sha256'],'commercial_offer':False,'publication_approved':False,
    'scope':'Selected source worksheets. Record counts are NOT facility counts, available capacity or service commitments.'})
  results.append(report);print(canonical(report),flush=True)
 (out/'reconciliation.json').write_text(json.dumps({'schema_version':VERSION,'datasets':results,'total_normalized_rows':sum(r['normalized_rows'] for r in results),'db_imported':False},indent=2))
 (out/'market-summaries.json').write_text(json.dumps(summaries,indent=2))
 return results
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--source-dir',required=True);p.add_argument('--output-dir',required=True);a=p.parse_args();normalize(a.source_dir,a.output_dir)
