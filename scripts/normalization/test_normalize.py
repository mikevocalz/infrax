import collections,io,json,pathlib,tempfile,unittest,zipfile
from normalize import number,iso_date,canonical,sha,records,load_package,SPECS
from ooxml import Workbook,SafeXML

class Values(unittest.TestCase):
 def test_missing_is_never_zero(self):
  for x in [None,'',' ','--','NA','N/M','*','W']:
   self.assertIsNone(number(x,'MW')['value']);self.assertEqual(number(x,'MW')['raw'],x)
 def test_zero_is_reported(self):self.assertEqual(number('0','MW')['quality'],'reported')
 def test_negative_generation_is_valid(self):self.assertEqual(number('-12.25','MWh')['value'],'-12.25')
 def test_negative_capacity_is_flagged(self):self.assertEqual(number('-1','MW',True)['quality'],'invalid')
 def test_nonfinite_is_not_json_number(self):
  for x in ['NaN','Infinity','-Infinity','#DIV/0!','bad']:
   self.assertEqual(number(x,'MW')['quality'],'invalid')
 def test_decimal_precision(self):self.assertEqual(number('0.10000000000000001','MW')['value'],'0.10000000000000001')
 def test_excel_dates(self):
  self.assertEqual(iso_date('61'),'1900-03-01');self.assertIsNone(iso_date('60'))
  self.assertEqual(iso_date('1',True),'1904-01-02');self.assertEqual(iso_date('2025-12-31'),'2025-12-31')
 def test_date_invalid(self):
  for x in ['NaN','1.5','-2','bad',None]:self.assertIsNone(iso_date(x))
 def test_checksum_stable(self):self.assertEqual(sha(canonical({'a':1,'b':2}).encode()),sha(canonical({'b':2,'a':1}).encode()))
 def test_context_only_types(self):self.assertNotIn('facility',[s['kind'] for s in SPECS]);self.assertEqual(len(SPECS),6)
 def test_hash_tamper(self):
  with tempfile.TemporaryDirectory() as d:
   root=pathlib.Path(d);(root/'x.xlsx').write_bytes(b'not a workbook')
   with self.assertRaises(ValueError):load_package(root,{'file':'x.xlsx','source':'X'},{'sources':[{'file':'x.xlsx','source_id':'X','sha256':'0'*64}]})

class XML(unittest.TestCase):
 def workbook(self,cells,rows=None,rels_target='worksheets/sheet1.xml'):
  data=io.BytesIO()
  with zipfile.ZipFile(data,'w') as z:
   z.writestr('xl/workbook.xml','<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Data" sheetId="1" r:id="r1"/></sheets></workbook>')
   z.writestr('xl/_rels/workbook.xml.rels',f'<Relationships><Relationship Id="r1" Target="{rels_target}"/></Relationships>')
   body=rows or f'<row r="1">{cells}</row>'
   z.writestr('xl/worksheets/sheet1.xml',f'<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>{body}</sheetData></worksheet>')
  return data.getvalue()
 def test_sparse_cells(self):
  w=Workbook(self.workbook('<c r="C1"><v>5</v></c>'));self.assertEqual(list(w.rows('Data')),[(1,[None,None,'5'])]);w.close()
 def test_inline_rich_text(self):
  w=Workbook(self.workbook('<c r="A1" t="inlineStr"><is><r><t>Hi</t></r><r><t> there</t></r></is></c>'));self.assertEqual(list(w.rows('Data'))[0][1],['Hi there']);w.close()
 def test_formula_no_calculation(self):
  w=Workbook(self.workbook('<c r="A1"><f>WEBSERVICE("https://example.org")</f></c>'));self.assertEqual(list(w.rows('Data'))[0][1],['#UNRESOLVED_FORMULA!']);w.close()
 def test_invalid_cell(self):
  w=Workbook(self.workbook('<c r="A2"><v>1</v></c>'))
  with self.assertRaises(ValueError):list(w.rows('Data'))
  w.close()
 def test_traversal(self):
  with self.assertRaises(ValueError):Workbook(self.workbook('',rels_target='../../secret.xml'))
 def test_xml_entities(self):
  stream=SafeXML(io.BytesIO(b'<!DOCTYPE x [<!ENTITY boom "x">]>'))
  with self.assertRaises(ValueError):stream.read()
 def test_header_drift(self):
  class Fake:
   sheets={'Data':1}
   def rows(self,s):yield 1,['Wrong header']
  spec={'sheets':['Data'],'header':1,'required':['State'],'metrics':{}}
  with self.assertRaises(ValueError):list(records(Fake(),spec,{},{}))
 def test_rows_preserve_duplicates(self):
  spec=dict(SPECS[2],sheets=['Data']);head=['Utility Number','Utility Name','State','County','Data Year']
  class Fake:
   sheets={'Data':1}
   def rows(self,s):yield 1,head;yield 2,['1','Name','TX','Dallas','2025'];yield 3,['1','Name','TX','Dallas','2025']
  report={'rows_scanned':0,'excluded_state_or_footer':collections.Counter(),'rejected_missing_identifier':0}
  rows=list(records(Fake(),spec,{'url':'https://www.eia.gov','sha256':'a'*64},report))
  self.assertEqual(rows[0]['entity_key'],rows[1]['entity_key']);self.assertNotEqual(rows[0]['record_key'],rows[1]['record_key'])
  self.assertTrue(all(r['commercial_offer'] is False and r['publication_approved'] is False for r in rows))

if __name__=='__main__':unittest.main()
