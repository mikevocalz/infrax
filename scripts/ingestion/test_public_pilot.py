import importlib.util
import unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('collector',Path(__file__).with_name('collect-public-pilot.py'))
c=importlib.util.module_from_spec(spec);spec.loader.exec_module(c)

def table(row='Texas', values=None):
    values=values or ['15.91','15.40','8.96','8.76','7.21','6.42','--','NM','11.23','10.42']
    return '<p>Release Date: October 23, 2026</p><h2>Table 5.6.A. by State, August 2026 and 2025 (Cents per Kilowatthour)</h2><table><tr><th>State</th>'+''.join('<th>'+x+'</th>' for x in ['Residential','Commercial','Industrial','Transportation','All Sectors'])+'</tr><tr><td>'+row+'</td>'+''.join('<td>'+x+'</td>' for x in values)+'</tr></table><p>Values for 2025 are final. Values for 2026 are preliminary estimates.</p>'

def osm():
    return {'osm3s':{'timestamp_osm_base':'2026-11-06T23:00:00Z'},'elements':[{'type':'way','id':123,'center':{'lat':32.8,'lon':-97.0},'tags':{'name':'Synthetic test building','building':'data_center','phone':'do not store','contact:email':'do not store','operator':'Test operator'},'user':'do not store'}]}

class PublicPilotTests(unittest.TestCase):
    def test_eia_preserves_periods_and_units(self):
        d=c.parse_eia(table(),require_complete=False)
        self.assertEqual(d['periods'],['2026-08','2025-08'])
        self.assertEqual(d['records'][0]['raw_payload']['prices']['commercial']['value'],8.96)
        self.assertEqual(d['records'][0]['raw_payload']['unit'],'cents_per_kwh')
        self.assertFalse(d['records'][0]['raw_payload']['facility_quote'])
        self.assertIsNone(d['records'][0]['observed_at'])
    def test_missing_is_never_zero(self):
        d=c.parse_eia(table(),require_complete=False)
        self.assertIsNone(d['records'][0]['raw_payload']['prices']['transportation']['value'])
    def test_incomplete_nationwide_table_fails(self):
        with self.assertRaises(ValueError):c.parse_eia(table())
    def test_sector_reordering_fails(self):
        with self.assertRaises(ValueError):c.parse_eia(table().replace('Residential','Commercial',1),require_complete=False)
    def test_bad_units_or_status_fail(self):
        for old,new in [('Cents per Kilowatthour','Dollars per MW'),('are preliminary','are unknown')]:
            with self.assertRaises(ValueError):c.parse_eia(table().replace(old,new),require_complete=False)
    def test_invalid_numeric_does_not_coerce(self):
        with self.assertRaises(ValueError):c.numeric('nan')
        with self.assertRaises(ValueError):c.numeric('-10')
    def test_osm_contact_redaction_unknown_capacity(self):
        d=c.parse_osm(osm());p=d['records'][0]['raw_payload']
        self.assertNotIn('phone',p['tags']);self.assertNotIn('contact:email',p['tags']);self.assertNotIn('user',p)
        self.assertIsNone(p['available_it_mw']);self.assertEqual(p['scope'],'mapped_object_not_canonical_facility')
    def test_osm_bounds(self):
        d=osm();d['elements'][0]['center']['lat']=5
        with self.assertRaises(ValueError):c.parse_osm(d)
    def test_partial_or_duplicate_osm_fails(self):
        d=osm();d['remark']='timed out'
        with self.assertRaises(ValueError):c.parse_osm(d)
        d=osm();d['elements'].append(d['elements'][0])
        with self.assertRaises(ValueError):c.parse_osm(d)
    def test_hash_stable_independent_key_order(self):
        self.assertEqual(c.checksum({'b':2,'a':1}),c.checksum({'a':1,'b':2}))
if __name__=='__main__':unittest.main()
