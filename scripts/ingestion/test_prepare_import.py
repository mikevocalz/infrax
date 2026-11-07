import importlib.util,unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('prepare',Path(__file__).with_name('prepare-pilot-import.py'))
p=importlib.util.module_from_spec(spec);spec.loader.exec_module(p)

def dataset():
    records=[]
    for name,state in p.c.STATES.items():
        for period,status in [('2026-08','preliminary'),('2025-08','final')]:
            payload={'dataset':'eia_epm_5_6_a','state':state,'state_name':name,'period':period,'unit':'cents_per_kwh','estimate_status':status,'prices':{s:{'value':1.23,'source_token':'1.23'} for s in p.c.SECTORS},'scope':'state_sector_average','facility_quote':False}
            records.append({'external_key':state+period,'source_url':p.c.EIA_URL,'observed_at':None,'raw_payload':payload,'content_sha256':p.c.checksum(payload)})
    return {'provider':'EIA_EPM_5_6_A','response_sha256':'a'*64,'retrieved_at':'2026-11-06T23:12:28+00:00','published_at':'2026-10-23T00:00:00+00:00','periods':['2026-08','2025-08'],'records':records}

class PreparationTests(unittest.TestCase):
    def test_non_development_refused(self):
        for env in ['production','staging','',None]:
            with self.assertRaises(ValueError):p.prepare_eia(dataset(),environment=env)
    def test_tampered_payload_refused(self):
        d=dataset();d['records'][0]['raw_payload']['prices']['commercial']['value']=0
        with self.assertRaises(ValueError):p.prepare_eia(d,environment='development')
    def test_complete_import_is_insert_only_and_unpublished(self):
        statements=p.prepare_eia(dataset(),environment='development');sql='\n'.join(statements)
        self.assertIn("'internal',false",sql)
        self.assertIn('ON CONFLICT(license_id,external_key,content_sha256) DO NOTHING',sql)
        for bad in ['DELETE FROM','DROP TABLE','UPDATE infra.','GRANT ','INSERT INTO infra.market_signals','INSERT INTO infra.capacity_offers']:
            self.assertNotIn(bad,sql)
    def test_quote_escape(self):self.assertEqual(p.literal("operator's record"),"'operator''s record'")
    def test_missing_state_refused(self):
        d=dataset();d['records'].pop()
        with self.assertRaises(ValueError):p.prepare_eia(d,environment='development')
    def test_bad_values_cannot_be_accepted_with_valid_hash(self):
        d=dataset();r=d['records'][0];r['raw_payload']['prices']['commercial']={'value':1.23,'source_token':'not a price'};r['content_sha256']=p.c.checksum(r['raw_payload'])
        with self.assertRaises(ValueError):p.prepare_eia(d,environment='development')
if __name__=='__main__':unittest.main()
