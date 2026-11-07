import{useEffect,useRef}from'react';
import{ScrollView,View,Linking,useWindowDimensions}from'react-native';
import{createStore,type StoreApi}from'zustand/vanilla';import{useStore}from'zustand';
import{createResearchController,createResearchClient}from'../../client/research-client.mjs';
import{stateFilter}from'../../client/research-contract.mjs';
import type{ResearchResponse,ContextRow}from'../../client/research-types';
import{researchLayout,type Region}from'./layout.mjs';
import{Heading,Body,Panel,Action,Field,Stack,colors}from'./ui/Primitives';
type ResearchClient=ReturnType<typeof createResearchClient>;
type Phase='loading'|'ready'|'empty'|'signed_out'|'forbidden'|'unavailable'|'invalid_response'|'aborted';
type State={region:string;input:string;status:Phase;result:ResearchResponse|null;selected:string|null;validation:string|null;linkError:boolean};
const messages:Partial<Record<Phase,string>>={loading:'Loading reviewed source records…',empty:'No imported summaries for this region. This does not establish an absence of infrastructure.',signed_out:'Sign in through the connected InFraX host, then retry. This screen cannot grant a staff session.',forbidden:'Your account does not have access to internal source review.',unavailable:'The research service is unavailable. No demonstration records have been substituted.',invalid_response:'The response failed evidence validation. No untrusted records are displayed.'};
export interface ResearchScreenProps{load:ResearchClient|null;sessionScope:string;region:Region;geometryNotice?:string}
export function ResearchScreen({load,sessionScope,region,geometryNotice}:ResearchScreenProps){
 const ref=useRef<StoreApi<State>|null>(null);
 if(!ref.current)ref.current=createStore<State>(()=>({region:'TX',input:'TX',status:'loading',result:null,selected:null,validation:null,linkError:false}));
 const store=ref.current,state=useStore(store),window=useWindowDimensions();
 const plan=researchLayout(region,window.fontScale);
 const controller=useRef<ReturnType<typeof createResearchController>|null>(null);
 useEffect(()=>{
  store.setState({region:'TX',input:'TX',result:null,selected:null,validation:null,status:'loading'});
  if(!load)return;
  const next=createResearchController({load,onChange:s=>store.setState({...s,selected:null})});
  controller.current=next;void next.select('TX');
  return()=>{next.dispose();controller.current=null;store.setState({result:null,selected:null});};
 },[load,sessionScope,store]);
 const choose=()=>{
  try{const value=stateFilter(state.input.trim().toUpperCase());store.setState({validation:null});void controller.current?.select(value);}
  catch{store.setState({validation:'Enter a supported two-letter state or territory code.'});}
 };
 return <View testID="research-frame" style={{position:'absolute',left:region.x,top:region.y,width:region.width,height:region.height,backgroundColor:'#f3f6f8'}}>
  <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{padding:plan.padding,gap:20}}>
   <Stack><Body style={{color:'#954000',fontSize:13,fontWeight:'700'}}>INFRAX · INTERNAL RESEARCH</Body>
    <Heading style={{fontSize:30,lineHeight:38}}>Source review</Heading>
    <Body>Inspect market context and its evidence. These records are not data centers, available power, or commercial offers.</Body></Stack>
   {geometryNotice?<Panel><Body>{geometryNotice}</Body></Panel>:null}
   {!load?<Panel><Heading>Connection not configured</Heading><Body>This development host needs an approved API origin and an existing staff session. No account is created and no source data is public.</Body></Panel>:<>
    <Panel>
     <View style={{flexDirection:plan.columns===2?'row':'column',gap:12}}>
      <Field id="region" label="State or territory" value={state.input} onChangeText={input=>store.setState({input,validation:null})} autoCapitalize="characters" autoCorrect={false} maxLength={2} returnKeyType="search" onSubmitEditing={choose}/>
      <Action title="Load region" onPress={choose}/><Action secondary title="Refresh evidence" onPress={()=>void controller.current?.select(state.region)}/>
     </View>{state.validation?<Body accessibilityRole="alert">{state.validation}</Body>:null}
    </Panel>
    {state.status!=='ready'?<Panel><Body accessibilityRole={state.status==='loading'?'text':'alert'} accessibilityLiveRegion="polite">{messages[state.status]??'Request cancelled.'}</Body></Panel>:null}
    {state.status==='ready'&&state.result?<Stack><Body style={{fontWeight:'700'}}>{state.region} · {state.result.data.length} source datasets</Body>
     <View style={{flexDirection:'row',flexWrap:'wrap',gap:16}}>{state.result.data.map(row=><View key={row.dataset} style={{width:plan.columns===2?(region.width-2*plan.padding-16)/2:'100%',minWidth:0}}><Panel>
      <Heading style={{fontSize:21,lineHeight:28}}>{row.title}</Heading><Body>{row.period} · {row.state}</Body>
      <Body>{row.recordCount.toLocaleString('en-US')} selected source rows · {row.distinctKeys.toLocaleString('en-US')} distinct source identifiers</Body>
      <Body style={{fontSize:14}}>Internal review only · Not a capacity offer</Body>
      <Action secondary expanded={state.selected===row.dataset} title={(state.selected===row.dataset?'Hide evidence: ':'Inspect evidence: ')+row.title} onPress={()=>store.setState({selected:state.selected===row.dataset?null:row.dataset,linkError:false})}/>
      {state.selected===row.dataset?<Stack><Evidence row={row}/><Action title="Open original publisher file" onPress={()=>{void Linking.openURL(row.sourceUrl).catch(()=>store.setState({linkError:true}));}}/>{state.linkError?<Body accessibilityRole="alert">The source link could not be opened. Its address is shown above.</Body>:null}</Stack>:null}
     </Panel></View>)}</View>
    </Stack>:null}
   </>}
  </ScrollView>
 </View>;
}
function Evidence({row}:{row:ContextRow}){return <Stack><Heading>{row.title}</Heading><Body>Observation period: {row.period}</Body><Body>Source retrieved: {row.sourceRetrievedAt??'Not recorded'}</Body><Body>Imported: {row.importedAt??'Not recorded'}</Body><Body selectable>{row.sourceUrl}</Body><Body selectable>Package SHA-256: {row.sourceSha256}</Body><Body selectable>Normalized-output SHA-256: {row.outputSha256}</Body><Heading style={{fontSize:20}}>Evidence quality</Heading>{row.quality.map(q=><Body key={q.field+q.status}>{q.field.replaceAll('_',' ')} · {q.status}: {q.count.toLocaleString('en-US')}</Body>)}</Stack>;}
