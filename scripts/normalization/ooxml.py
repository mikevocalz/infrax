"""Bounded read-only OOXML streaming for source ingestion.

Never executes macros, formulas or links. Numeric/date lexical tokens are kept
for source-specific adapters. Not a general spreadsheet editing library.
"""
import io,posixpath,re,zipfile,xml.etree.ElementTree as ET
NS='{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'
REL='{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id'
class SafeXML:
 def __init__(self,stream):self.stream=stream;self.tail=b''
 def read(self,size=-1):
  data=self.stream.read(size);probe=(self.tail+data).upper()
  if b'<!DOCTYPE' in probe or b'<!ENTITY' in probe:raise ValueError('DTD/entities are forbidden')
  self.tail=probe[-16:];return data
class Workbook:
 def __init__(self,source):
  self.z=zipfile.ZipFile(io.BytesIO(source) if isinstance(source,bytes) else source)
  infos=self.z.infolist();names=[x.filename for x in infos]
  if sum(x.file_size for x in infos)>350*1024*1024:raise ValueError('Expanded workbook too large')
  if len(names)!=len(set(names)) or any(n.startswith('/') or '..' in n.split('/') for n in names):raise ValueError('Unsafe ZIP member')
  if any(i.flag_bits&1 for i in infos):raise ValueError('Encrypted workbook forbidden')
  def xml(name):
   with self.z.open(name) as f:return ET.parse(SafeXML(f)).getroot()
  book=xml('xl/workbook.xml');props=book.find(NS+'workbookPr')
  self.date1904=props is not None and props.attrib.get('date1904') in ('1','true')
  rels={e.attrib['Id']:e.attrib['Target'] for e in xml('xl/_rels/workbook.xml.rels') if e.attrib.get('TargetMode')!='External'}
  self.sheets={}
  for s in book.iter(NS+'sheet'):
   target=rels.get(s.attrib[REL],'')
   if not target:raise ValueError('External/missing worksheet target')
   path=posixpath.normpath('xl/'+target) if not target.startswith('/') else target.lstrip('/')
   if not path.startswith('xl/worksheets/') or path not in names:raise ValueError('Unsafe worksheet target')
   if s.attrib['name'] in self.sheets:raise ValueError('Duplicate sheet name')
   self.sheets[s.attrib['name']]=path
  self.strings=[]
  if 'xl/sharedStrings.xml' in names:
   with self.z.open('xl/sharedStrings.xml') as f:
    for _,e in ET.iterparse(SafeXML(f),events=('end',)):
     if e.tag==NS+'si':
      self.strings.append(''.join(t.text or '' for t in e.iter(NS+'t')));e.clear()
      if len(self.strings)>1000000:raise ValueError('String count limit')
 def rows(self,sheet,limit=None):
  with self.z.open(self.sheets[sheet]) as f:
   count=0;previous=0
   for _,row in ET.iterparse(SafeXML(f),events=('end',)):
    if row.tag!=NS+'row':continue
    count+=1;rowno=int(row.attrib.get('r',count))
    if rowno<=previous or rowno>1048576:raise ValueError('Invalid row ordering')
    previous=rowno;values=[];seen=set()
    for c in row.findall(NS+'c'):
     ref=c.attrib.get('r','');match=re.fullmatch(r'([A-Z]+)([1-9][0-9]*)',ref)
     if not match or int(match.group(2))!=rowno or ref in seen:raise ValueError('Invalid cell address')
     seen.add(ref);col=0
     for ch in match.group(1):col=26*col+ord(ch)-64
     if col>16384:raise ValueError('Column bound exceeded')
     while len(values)<col:values.append(None)
     v=c.find(NS+'v');value=v.text if v is not None else None;t=c.attrib.get('t')
     if t=='s':
      idx=int(value)
      if not 0<=idx<len(self.strings):raise ValueError('Invalid shared string index')
      value=self.strings[idx]
     elif t=='inlineStr':value=''.join(x.text or '' for x in c.iter(NS+'t'))
     if c.find(NS+'f') is not None and value is None:value='#UNRESOLVED_FORMULA!'
     values[col-1]=value
    yield rowno,values
    row.clear()
    if limit and count>=limit:break
 def close(self):self.z.close()
