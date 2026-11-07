"""Prepare additive, explicitly development-only summary import transactions.

Never opens a DB connection. Six source files must first be normalized and
reconciled. A changed evidence version is rejected by the database importer.
"""
from __future__ import annotations
import argparse,datetime,json,pathlib
from prepare_summaries import prepare, PROJECT, DEVELOPMENT


def attach_retrieval(plan, manifest):
    sources=manifest.get('sources',[])
    for pack in plan['packs']:
        base=pack['base']
        matches=[row for row in sources if row.get('source_id')==base['source_id']
                 and row.get('sha256')==base['source_package_sha256']
                 and row.get('url')==base['source_url']]
        if len(matches)!=1 or matches[0].get('status')!='downloaded_valid_archive':
            raise ValueError('Original source manifest does not match normalized evidence')
        retrieved=matches[0].get('retrieved_at')
        if not isinstance(retrieved,str):
            raise ValueError('Source retrieval timestamp is required')
        parsed=datetime.datetime.fromisoformat(retrieved.replace('Z','+00:00'))
        if parsed.tzinfo is None:
            raise ValueError('Timestamp must include timezone')
        base['source_retrieved_at']=retrieved
    return plan


def statements(pack, *, environment, branch_id):
    if environment!='development' or branch_id!=DEVELOPMENT:
        raise ValueError('Only the explicit InFraX development branch is permitted')
    body=json.dumps(pack,ensure_ascii=False,separators=(',',':'),allow_nan=False)
    return ["SET LOCAL statement_timeout='30s'", "SET LOCAL lock_timeout='5s'",
            "SELECT * FROM infra_meta.import_context_summaries('"+body.replace("'","''")+"'::jsonb)"]


if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--directory',required=True)
    parser.add_argument('--source-manifest',required=True)
    parser.add_argument('--output',required=True)
    args=parser.parse_args()
    plan=attach_retrieval(prepare(args.directory,'development'),json.loads(pathlib.Path(args.source_manifest).read_text()))
    transactions=[{'project_id':PROJECT,'branch_id':DEVELOPMENT,'database_name':'infrax','role_name':'infrax_owner',
                   'sql_statements':statements(pack,environment='development',branch_id=DEVELOPMENT)} for pack in plan['packs']]
    pathlib.Path(args.output).write_text(json.dumps(transactions,indent=2))
    print('Prepared',len(transactions),'development transactions; no connections opened')
