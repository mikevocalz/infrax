#!/usr/bin/env python3
"""Small explicit OSM snapshot via a commercial-use-permitted mirror.
Shared validation/redaction parser; no automatic failover on HTTP 429.
Operator terms: https://overpass.private.coffee/ (reviewed 2026-11-06).
"""
import argparse, hashlib, importlib.util, json
from datetime import datetime,timezone
from pathlib import Path
from urllib.parse import urlencode,urlparse
from urllib.request import Request,urlopen
spec=importlib.util.spec_from_file_location('collector',Path(__file__).with_name('collect-public-pilot.py'))
c=importlib.util.module_from_spec(spec);spec.loader.exec_module(c)
ENDPOINT='https://overpass.private.coffee/api/interpreter'

def collect():
    request=Request(ENDPOINT,data=urlencode({'data':c.QUERY}).encode(),method='POST',headers={'User-Agent':'InFraX-development-source-review/0.1 (+https://github.com/mikevocalz/infrax)','Accept':'application/json','Content-Type':'application/x-www-form-urlencoded'})
    with urlopen(request,timeout=50) as response:
        if urlparse(response.url).hostname!='overpass.private.coffee':raise ValueError('Unapproved redirect')
        raw=response.read(8_000_001)
        if len(raw)>8_000_000:raise ValueError('Bounded snapshot size exceeded')
    dataset=c.parse_osm(json.loads(raw))
    dataset.update(retrieved_at=datetime.now(timezone.utc).isoformat(),response_sha256=hashlib.sha256(raw).hexdigest(),collection_url=ENDPOINT,query=c.QUERY)
    return dataset

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--output',required=True);args=parser.parse_args()
    root=Path(args.output);root.mkdir(parents=True,exist_ok=True);path=root/'public-pilot.json'
    bundle=json.loads(path.read_text()) if path.exists() else {'schema_version':1,'purpose':'development_review_only','publication':'not_published','datasets':[],'failures':[]}
    if bundle.get('purpose')!='development_review_only' or bundle.get('publication')!='not_published':raise ValueError('Invalid bundle')
    try:
        dataset=collect()
        bundle['datasets']=[d for d in bundle['datasets'] if d['provider']!='OSM_DFW_DISCOVERY']+[dataset]
        print(json.dumps({'provider':dataset['provider'],'records':len(dataset['records']),'snapshot_as_of':dataset['snapshot_as_of']}))
    except Exception as error:
        bundle['failures'].append({'source':'osm_private_coffee','error_type':type(error).__name__,'message':str(error)[:350]})
        raise
    finally:path.write_text(json.dumps(bundle,indent=2))
if __name__=='__main__':main()
