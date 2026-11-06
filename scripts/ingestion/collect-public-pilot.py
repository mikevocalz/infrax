#!/usr/bin/env python3
"""Bounded public-source collection. No credentials, DB writes or publication.
Only official EIA table 5.6.A and OSM DFW data-center-tagged map objects.
"""
import argparse
import hashlib
import json
import math
import re
import time
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urlencode, urlparse
from urllib.request import Request, urlopen

EIA_URL = 'https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=table_5_06_a'
OSM_URL = 'https://overpass-api.de/api/interpreter'
QUERY = '[out:json][timeout:25];(nwr["telecom"="data_center"](32.5,-97.6,33.3,-96.3);nwr["building"="data_center"](32.5,-97.6,33.3,-96.3);nwr["man_made"="data_center"](32.5,-97.6,33.3,-96.3););out center tags;'
STATES = dict(zip('Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|District of Columbia|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming'.split('|'), 'AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY'.split()))
MONTHS = {m:i+1 for i,m in enumerate('January February March April May June July August September October November December'.split())}
SECTORS = ['residential', 'commercial', 'industrial', 'transportation', 'all_sectors']
ALLOWED_TAGS = {'name','operator','building','telecom','man_made','addr:city','addr:state','addr:country','start_date','construction','disused','abandoned'}

def canonical(value):
    return json.dumps(value, sort_keys=True, separators=(',', ':'), ensure_ascii=True)

def checksum(value):
    return hashlib.sha256(canonical(value).encode()).hexdigest()

class TableParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.rows, self.row, self.cell, self.all_text = [], None, None, []
    def handle_starttag(self, tag, attrs):
        if tag == 'tr': self.row = []
        elif tag in ('th','td') and self.row is not None: self.cell = []
    def handle_data(self, data):
        self.all_text.append(data)
        if self.cell is not None: self.cell.append(data)
    def handle_endtag(self, tag):
        if tag in ('th','td') and self.cell is not None:
            self.row.append(' '.join(' '.join(self.cell).split()))
            self.cell = None
        elif tag == 'tr' and self.row is not None:
            self.rows.append(self.row)
            self.row, self.cell = None, None

def numeric(text):
    if text in ('--','NM','NA','N/A','*',''): return None
    if not re.fullmatch(r'\d+(?:\.\d+)?', text): raise ValueError('Unexpected numeric token')
    value = float(text)
    if not math.isfinite(value) or not 0 <= value <= 1000: raise ValueError('Implausible price')
    return value

def parse_eia(raw, *, require_complete=True):
    parser = TableParser(); parser.feed(raw)
    text = ' '.join(' '.join(parser.all_text).split())
    edition = re.search(r'by State,\s+([A-Za-z]+)\s+(20\d{2})\s+and\s+(20\d{2})', text)
    release = re.search(r'Release Date:\s*([A-Za-z]+)\s+(\d{1,2}),?\s+(20\d{2})', text)
    if 'Table 5.6.A.' not in text or 'Cents per Kilowatthour' not in text or not edition or not release:
        raise ValueError('EIA table identity, units or dates changed')
    month, current, prior = edition.groups()
    if month not in MONTHS or int(prior) != int(current)-1: raise ValueError('Unknown observation period')
    pub_month, day, pub_year = release.groups()
    published = datetime(int(pub_year), MONTHS[pub_month], int(day), tzinfo=timezone.utc).isoformat()
    if not re.search(r'Values for '+current+r' are preliminary',text) or not re.search(r'Values for '+prior+r' are final',text):
        raise ValueError('Estimate/final status must be explicit in source')
    sector_header = next((r for r in parser.rows if 'Residential' in r and 'All Sectors' in r),None)
    if not sector_header or sector_header[-5:] != ['Residential','Commercial','Industrial','Transportation','All Sectors']:
        raise ValueError('EIA sector headings changed')
    rows=[]; seen=set()
    for cells in parser.rows:
        if not cells or cells[0] not in STATES: continue
        state=STATES[cells[0]]
        if state in seen or len(cells)!=11: raise ValueError('Duplicate or malformed state row')
        seen.add(state)
        for offset,year in enumerate((current, prior)):
            period=f'{year}-{MONTHS[month]:02d}'
            values={sector:{'value':numeric(cells[1+2*i+offset]),'source_token':cells[1+2*i+offset]} for i,sector in enumerate(SECTORS)}
            payload={'dataset':'eia_epm_5_6_a','state':state,'state_name':cells[0],'period':period,'unit':'cents_per_kwh','estimate_status':'preliminary' if offset==0 else 'final','prices':values,'scope':'state_sector_average','facility_quote':False}
            rows.append({'external_key':f'eia:epm:5.6.a:{state}:{period}', 'source_url':EIA_URL,'source_version':published[:10], 'published_at':published,'observed_at':None,'raw_payload':payload,'content_sha256':checksum(payload)})
    if require_complete and len(seen)!=51: raise ValueError(f'Incomplete EIA table: {len(seen)}/51 states/DC')
    return {'provider':'EIA_EPM_5_6_A','license_url':'https://www.eia.gov/about/copyrights_reuse.php','published_at':published,'periods':[f'{year}-{MONTHS[month]:02d}' for year in (current,prior)],'records':rows}

def parse_osm(data):
    if not isinstance(data,dict) or data.get('remark') or not isinstance(data.get('elements'),list): raise ValueError('Incomplete Overpass response')
    if len(data['elements'])>1000: raise ValueError('Bounded pilot exceeded maximum objects')
    base=data.get('osm3s',{}).get('timestamp_osm_base')
    if not base or not re.fullmatch(r'\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z',base): raise ValueError('OSM base timestamp missing')
    result=[]; seen=set()
    for item in data['elements']:
        if not isinstance(item,dict) or item.get('type') not in ('node','way','relation') or type(item.get('id')) is not int: raise ValueError('Invalid map object')
        tags=item.get('tags',{})
        if not any(tags.get(key)=='data_center' for key in ('telecom','building','man_made')): raise ValueError('Unexpected map object type')
        location=item if item['type']=='node' else item.get('center',{})
        lat,lon=location.get('lat'),location.get('lon')
        if not isinstance(lat,(float,int)) or not isinstance(lon,(float,int)) or not 32.5<=lat<=33.3 or not -97.6<=lon<=-96.3: raise ValueError('Missing/out-of-scope approximate position')
        key=f"osm:{item['type']}:{item['id']}"
        if key in seen: raise ValueError('Duplicate map identifier')
        seen.add(key)
        safe_tags={k:v for k,v in tags.items() if k in ALLOWED_TAGS and isinstance(v,str) and len(v)<=300}
        payload={'dataset':'osm_dfw_discovery','osm_type':item['type'],'osm_id':item['id'],'latitude':lat,'longitude':lon,'location_precision':'approximate','tags':safe_tags,'scope':'mapped_object_not_canonical_facility','verification_status':'publicly_reported','available_it_mw':None,'available_for_sale':None,'attribution':'© OpenStreetMap contributors','license':'ODbL-1.0'}
        result.append({'external_key':key,'source_url':f"https://www.openstreetmap.org/{item['type']}/{item['id']}",'source_version':base,'published_at':None,'observed_at':None,'raw_payload':payload,'content_sha256':checksum(payload)})
    return {'provider':'OSM_DFW_DISCOVERY','license_url':'https://www.openstreetmap.org/copyright','snapshot_as_of':base,'records':result}

def download(url):
    if urlparse(url).hostname not in ('www.eia.gov','overpass-api.de'): raise ValueError('Source host not allowlisted')
    req=Request(url,headers={'User-Agent':'InFraX-development-source-review/0.1','Accept':'application/json,text/html'})
    for attempt in range(2):
        try:
            with urlopen(req,timeout=40) as response:
                if urlparse(response.url).hostname!=urlparse(url).hostname: raise ValueError('Cross-host redirect refused')
                body=response.read(8_000_001)
                if len(body)>8_000_000: raise ValueError('Source exceeds bounded import size')
                return body
        except HTTPError as error:
            if error.code not in (502,503,504) or attempt: raise
            time.sleep(3)

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--output',required=True);ap.add_argument('--source',choices=('eia','osm','both'),default='both')
    args=ap.parse_args();root=Path(args.output);root.mkdir(parents=True,exist_ok=True)
    datasets=[]; failures=[]
    for name,url,parser in [('eia',EIA_URL,lambda b:parse_eia(b.decode('utf-8'))),('osm',OSM_URL+'?'+urlencode({'data':QUERY}),lambda b:parse_osm(json.loads(b)))]:
        if args.source not in ('both',name): continue
        try:
            raw=download(url); data=parser(raw)
            data['retrieved_at']=datetime.now(timezone.utc).isoformat();data['response_sha256']=hashlib.sha256(raw).hexdigest();data['collection_url']=url
            datasets.append(data)
            if name=='eia': (root/'eia-source.html').write_bytes(raw)
        except Exception as error:
            failures.append({'source':name,'error_type':type(error).__name__,'message':str(error)[:350]})
    bundle={'schema_version':1,'purpose':'development_review_only','publication':'not_published','datasets':datasets,'failures':failures}
    (root/'public-pilot.json').write_text(json.dumps(bundle,indent=2))
    print(json.dumps({'datasets':[{ 'provider':d['provider'],'records':len(d['records'])} for d in datasets],'failures':failures},indent=2))
    if failures: raise SystemExit(1)
if __name__=='__main__': main()
