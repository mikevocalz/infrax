import copy, unittest
from summary_import import attach_retrieval, statements, DEVELOPMENT
class ImportPlanTests(unittest.TestCase):
 def setUp(self):
  self.pack={'base':{'source_id':'S03','source_package_sha256':'a'*64,'source_url':'https://www.eia.gov/file'},'rows':[]}
  self.source={'source_id':'S03','sha256':'a'*64,'url':'https://www.eia.gov/file','status':'downloaded_valid_archive','retrieved_at':'2026-11-06T23:33:57+00:00'}
 def test_source_retrieval_is_original_not_import_time(self):
  result=attach_retrieval({'packs':[copy.deepcopy(self.pack)]},{'sources':[self.source]})
  self.assertEqual(result['packs'][0]['base']['source_retrieved_at'],self.source['retrieved_at'])
 def test_modified_source_or_naive_date_rejected(self):
  for patch in [{'sha256':'b'*64},{'url':'https://evil.test'},{'retrieved_at':'2026-11-06T12:00:00'},{'status':'failed'}]:
   with self.assertRaises(ValueError): attach_retrieval({'packs':[copy.deepcopy(self.pack)]},{'sources':[{**self.source,**patch}]})
 def test_duplicate_manifest_rejected(self):
  with self.assertRaises(ValueError): attach_retrieval({'packs':[self.pack]},{'sources':[self.source,self.source]})
 def test_only_explicit_development_target(self):
  for env,branch in [('production',DEVELOPMENT),('staging',DEVELOPMENT),('development','other')]:
   with self.assertRaises(ValueError): statements(self.pack,environment=env,branch_id=branch)
 def test_text_is_quoted_not_executed(self):
  pack={**self.pack,'name':"O'Neil"}
  sql=statements(pack,environment='development',branch_id=DEVELOPMENT)[2]
  self.assertIn("O''Neil",sql)
if __name__=='__main__':unittest.main()
