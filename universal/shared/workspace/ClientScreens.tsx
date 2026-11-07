import {useRef} from 'react';
import {createStore,type StoreApi} from 'zustand/vanilla';
import {useStore} from 'zustand';
import {useApp,useAppState,useDraft,useRecords,type Item} from './Provider';
import {route,STEPS,type Screen} from './routes.mjs';
import {DEFAULT_SCENARIO,FIELDS,validateForm,assessOffer} from './forms.mjs';
import {EntryForm} from './Form';
import {Field} from '../ui/Primitives';
import {Action,Body,Heading,Panel,Stack,Row,Notice,Small,Tag,LabelValue,LoadNotice,RecordCard,Choice,SourceAction,recordTitle} from './ui';
export type ScreenProps={screen:Screen;go:(path:string)=>void};
export function OrganizationGate({go}:{go:(path:string)=>void}){
 return <Panel><Heading>Set up your workspace</Heading><Body>Private work belongs to an organization. Create a buyer workspace or request membership from an existing administrator.</Body><Action title="Set up organization" onPress={()=>go('/onboarding')}/><Action secondary title="Manage account" onPress={()=>go('/account')}/></Panel>;
}
export function OverviewScreen({go}:ScreenProps){
 const state=useAppState();
 const scenarios=useRecords('scenarios',{enabled:Boolean(state.orgId)});
 const projects=useRecords('projects',{enabled:Boolean(state.orgId)});
 return <Stack>
  <Panel><Small>YOUR NEXT DECISION</Small><Heading>From requirements to defensible choices.</Heading><Body>Define your workload and delivery constraints. Check the evidence before treating a facility as a viable offer.</Body><Row><Action title="New scenario" onPress={()=>go('/app/align/new')}/><Action secondary title="Explore infrastructure" onPress={()=>go('/app/explore')}/></Row></Panel>
  {!state.orgId?<OrganizationGate go={go}/>:<>
   <Heading>Continue a scenario</Heading><LoadNotice value={scenarios} empty="No scenarios are saved in this organization." onRetry={scenarios.reload}/>
   {scenarios.data.slice(0,3).map(item=><RecordCard key={item.id} item={item} onOpen={()=>go(route('scenario',{id:item.id}))}/>)}
   <Heading>Project work</Heading><LoadNotice value={projects} empty="No projects yet. A saved scenario is not an active engagement." onRetry={projects.reload}/>
   {projects.data.slice(0,3).map(item=><RecordCard key={item.id} item={item} onOpen={()=>go(route('project',{id:item.id}))}/>)}
  </>}
  <Panel><Heading>Read the evidence</Heading><Body>Regional context, reported specifications and verified offers answer different questions.</Body><Action secondary title="Verification methodology" onPress={()=>go('/methodology')}/></Panel>
 </Stack>;
}
export function ExploreScreen({go}:ScreenProps){
 const feed=useRecords('facilities',{publicFeed:true});
 const [filter,edit]=useDraft('explore-filters',{search:'',state:''});
 const rows=feed.data.filter(r=>(!filter.search||recordTitle(r).toLowerCase().includes(filter.search.toLowerCase()))&&(!filter.state||String(r.state??'').toUpperCase()===filter.state.toUpperCase()));
 return <Stack><Body>Discover approved facility records. Listing a facility does not establish current available capacity.</Body>
  <Panel><Row><Field id="explore-search" label="Search facility names" value={filter.search} onChangeText={v=>edit('search',v)}/><Field id="explore-state" label="State code (optional)" value={filter.state} maxLength={2} autoCapitalize="characters" onChangeText={v=>edit('state',v.toUpperCase())}/></Row><Small>Filters apply to loaded records. Load additional pages to search further.</Small></Panel>
  <LoadNotice value={feed} empty="No approved facility records are published. You can still request an assessment." onRetry={feed.reload}/>
  {feed.status==='ready'&&!rows.length?<Notice>No loaded records match these filters.</Notice>:null}
  {rows.map(item=><RecordCard key={item.id} item={item} onOpen={()=>go(route('facility',{id:item.id}))}><LabelValue label="Location" value={[item.locality,item.state,item.country].filter(Boolean).join(', ')}/><Tag label={item.lifecycle??'not confirmed'}/></RecordCard>)}
  {feed.nextCursor?<Action secondary title="Load more facilities" onPress={()=>{void feed.loadMore();}}/>:null}
  <Notice>Permissioned coordinates are not provided by the current public feed. The accessible list does not invent a facility map.</Notice>
  <Row><Action title="Request an assessment" onPress={()=>go('/assessment')}/><Action secondary title="Market context" onPress={()=>go('/app/explore/markets/TX')}/></Row>
 </Stack>;
}
export function FacilityScreen({screen,go}:ScreenProps){
 const data=useRecords('facilities',{publicFeed:true}),item=data.data.find(r=>r.id===screen.params.id);
 return <Stack><LoadNotice value={data} empty="No public facility evidence is available." onRetry={data.reload}/>
  {item?<Panel><Heading>{recordTitle(item)}</Heading><LabelValue label="Location" value={[item.locality,item.state].filter(Boolean).join(', ')}/><LabelValue label="Reported lifecycle" value={item.lifecycle}/><Notice>Available IT MW, service date, cooling and commercial terms require current operator evidence.</Notice><Action title="Create a scenario" onPress={()=>go('/app/align/new')}/><Action secondary title="Request verification" onPress={()=>go('/assessment')}/></Panel>:data.status==='ready'?<Notice>This record is not in the loaded page. Load more evidence before assuming it has been removed.</Notice>:null}
  {data.nextCursor?<Action secondary title="Load more evidence" onPress={()=>{void data.loadMore();}}/>:null}
 </Stack>;
}
export function MarketScreen({screen,go}:ScreenProps){
 const data=useRecords('signals',{publicFeed:true}),state=screen.params.id;
 return <Stack><Panel><Heading>{state} market context</Heading><Body>Public grid indicators are screening context, not a service commitment.</Body><Action title="Model requirements" onPress={()=>go('/app/align/new')}/></Panel><LoadNotice value={data} empty="No reviewed signals are publicly available." onRetry={data.reload}/>{data.data.filter(r=>String(r.geography??'').includes(state)).map(r=><RecordCard key={r.id} item={r} onOpen={()=>go(route('signal',{id:r.id}))}/>)}<Action secondary title="Data coverage" onPress={()=>go('/coverage')}/></Stack>;
}
export function ScenariosScreen({go}:ScreenProps){
 const state=useAppState(),data=useRecords('scenarios',{enabled:Boolean(state.orgId)});
 if(!state.orgId)return <OrganizationGate go={go}/>;
 return <Stack><Action title="New scenario" onPress={()=>go('/app/align/new')}/><LoadNotice value={data} empty="No saved scenarios. Start with your requirements rather than a vendor list." onRetry={data.reload}/>{data.data.map(item=><RecordCard key={item.id} item={item} onOpen={()=>go(route('scenario',{id:item.id}))}><LabelValue label="Critical IT power" value={item.data?.minimumItMw?item.data.minimumItMw+'–'+item.data.maximumItMw+' MW':null}/><LabelValue label="Version" value={item.version}/></RecordCard>)}{data.nextCursor?<Action secondary title="Load more scenarios" onPress={()=>{void data.loadMore();}}/>:null}</Stack>;
}
const groups=[['name','workload'],['minimumItMw','maximumItMw','densityKw'],['regions','timelineMonths'],['cooling','redundancy','network'],['priorities']];
export function ScenarioComposer({screen,go,existing}:{screen:Screen;go:(path:string)=>void;existing?:Item}){
 const {client}=useApp(),state=useAppState();
 const key='scenario-'+(existing?.id??'new');
 const defaults={...DEFAULT_SCENARIO,...existing?.data,name:existing?.name??existing?.data?.name??''};
 const [draft,edit]=useDraft(key,defaults);
 const ref=useRef<StoreApi<{step:number}>|null>(null);
 if(!ref.current)ref.current=createStore<{step:number}>(()=>({step:0}));
 const local=ref.current,step=useStore(local,s=>s.step),checked=validateForm('scenario',draft);
 return <Stack>
  <Panel><Small>STEP {step+1} OF {STEPS.length}</Small><Heading>{STEPS[step]}</Heading><Row>{STEPS.map((label,i)=><Choice key={label} label={String(i+1)+'. '+label} selected={step===i} onPress={()=>local.setState({step:i})}/>)}</Row></Panel>
  {step<5?<Panel>{FIELDS.scenario.filter(([field])=>groups[step].includes(field)).map(([field,label,type,required])=><Field key={field} id={'scenario-'+field} label={label+(required?' *':'')} value={draft[field]??''} keyboardType={type==='number'?'decimal-pad':'default'} multiline={type==='multiline'} onChangeText={value=>edit(field,value)}/>)}</Panel>:<Panel>
   <Heading>Review requirements</Heading>
   {FIELDS.scenario.map(([field,label])=><LabelValue key={field} label={label} value={draft[field]}/>)}
   {!checked.ok?<Notice error>{Object.values(checked.errors).join(' ')}</Notice>:null}
   {!state.orgId?<OrganizationGate go={go}/>:<EntryForm kind="scenario" formKey={key} defaults={defaults} fields={[]} submitLabel={existing?'Save new version':'Save scenario'} onSubmit={(data,operationKey)=>{if(!client)throw Error();return client.save('scenarios',{organizationId:state.orgId,id:existing?.id,version:existing?.version,data},operationKey);}} onSaved={result=>go(route('scenario',{id:result.id}))}/>}
   <Small>Saving confirms persistence, not an analysis result or available inventory.</Small>
  </Panel>}
  <Row>{step>0?<Action secondary title="Previous step" onPress={()=>local.setState({step:step-1})}/>:null}{step<5?<Action title="Next step" onPress={()=>local.setState({step:step+1})}/>:null}<Action secondary title="Back to scenarios" onPress={()=>go('/app/align')}/></Row>
  <Notice>Unsaved drafts survive navigation and resizing within this workspace. Sign-out and organization changes clear private drafts.</Notice>
 </Stack>;
}
export function ScenarioDetail({screen,go}:ScreenProps){
 const data=useRecords('scenarios',{id:screen.params.id}),item=data.data[0];
 return <Stack><LoadNotice value={data} empty="This scenario is not accessible in the active organization." onRetry={data.reload}/>{item?<><Panel><Heading>{recordTitle(item)}</Heading><Small>Saved version {item.version}</Small><Row><Action title="Assess current offers" onPress={()=>go(route('matches',{id:item.id}))}/><Action secondary title="Compare selections" onPress={()=>go(route('compare',{id:item.id}))}/><Action secondary title="Shortlist" onPress={()=>go(route('shortlist',{id:item.id}))}/></Row></Panel><ScenarioComposer screen={screen} go={go} existing={item}/></>:null}</Stack>;
}
export function MatchScreens({screen,go}:ScreenProps){
 const {store}=useApp(),state=useAppState();
 const scenario=useRecords('scenarios',{id:screen.params.id}),offers=useRecords('offers',{publicFeed:true});
 const selected=state.selected[screen.params.id]??[],requirements=scenario.data[0]?.data??{};
 const choose=(id:string)=>store.setState(s=>{const current=s.selected[screen.params.id]??[];return {selected:{...s.selected,[screen.params.id]:current.includes(id)?current.filter(x=>x!==id):current.length<4?[...current,id]:current}};});
 const visible=screen.component==='matches'?offers.data:offers.data.filter(r=>selected.includes(r.id));
 return <Stack>
  <Panel><Heading>{scenario.data[0]?recordTitle(scenario.data[0]):'Scenario assessment'}</Heading><Body>Hard constraints and evidence gaps are separate. No score, price or supply is fabricated.</Body><Row><Action secondary title="Requirements" onPress={()=>go(route('scenario',{id:screen.params.id}))}/><Action secondary title={'Compare ('+selected.length+'/4)'} onPress={()=>go(route('compare',{id:screen.params.id}))}/><Action secondary title="Shortlist" onPress={()=>go(route('shortlist',{id:screen.params.id}))}/></Row></Panel>
  <LoadNotice value={scenario} empty="The scenario is not available." onRetry={scenario.reload}/>
  <LoadNotice value={offers} empty="No current approved public offers are available. Power-market research cannot replace operator inventory." onRetry={offers.reload}/>
  {screen.component!=='matches'&&!visible.length&&offers.status==='ready'?<Notice>Select up to four offers from assessment results.</Notice>:null}
  {visible.map(item=>{const assessment=assessOffer(requirements,item);return <RecordCard key={item.id} item={item}><Tag label={assessment.status}/><LabelValue label="Offer IT power" value={item.critical_it_mw?item.critical_it_mw+' MW':null}/><LabelValue label="Delivery date" value={item.delivery_date}/><LabelValue label="Verification expiry" value={item.expires_at}/>{assessment.failures.map(text=><Notice key={text} error>{text}</Notice>)}{assessment.unknown.map(text=><Small key={text}>{text}</Small>)}<Action secondary disabled={!selected.includes(item.id)&&selected.length>=4} title={selected.includes(item.id)?'Remove from comparison':'Select for comparison'} onPress={()=>choose(item.id)}/></RecordCard>;})}
  {offers.nextCursor?<Action secondary title="Load more offers" onPress={()=>{void offers.loadMore();}}/>:null}
  {screen.component==='shortlist'?<Notice>These selections are session-local. They are not reserved capacity or a server-saved shortlist.</Notice>:null}
  <Action title="Request a diligence assessment" onPress={()=>go('/assessment')}/>
 </Stack>;
}
export function IntelligenceScreens({screen,go}:ScreenProps){
 const data=useRecords('signals',{publicFeed:true}),[filter,edit]=useDraft('signal-filter',{search:''});
 const rows=screen.component==='signal'?data.data.filter(r=>r.id===screen.params.id):data.data.filter(r=>recordTitle(r).toLowerCase().includes(filter.search.toLowerCase()));
 return <Stack><Row><Action secondary title="Watchlists and alerts" onPress={()=>go('/app/intelligence/watchlists')}/><Action secondary title="Coverage" onPress={()=>go('/coverage')}/></Row>{screen.component!=='signal'?<Field id="signal-search" label="Filter loaded signals" value={filter.search} onChangeText={value=>edit('search',value)}/>:null}<LoadNotice value={data} empty="No reviewed signals are publicly available." onRetry={data.reload}/>{rows.map(item=><RecordCard key={item.id} item={item} onOpen={screen.component==='signal'?undefined:()=>go(route('signal',{id:item.id}))}><LabelValue label="Geography" value={item.geography}/><LabelValue label="Category" value={item.category}/><LabelValue label="Observed" value={item.observed_at}/><LabelValue label="Published" value={item.published_at}/><LabelValue label="Retrieved" value={item.retrieved_at}/><SourceAction url={item.source_url}/><Action secondary title="Use in a scenario" onPress={()=>go('/app/align/new')}/></RecordCard>)}{data.nextCursor?<Action secondary title="Load more signals" onPress={()=>{void data.loadMore();}}/>:null}</Stack>;
}
