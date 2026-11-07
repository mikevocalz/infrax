import type{ReactNode}from'react';
import{Text,View,Pressable,Linking,type ViewProps}from'react-native';
import{Action,Body,Heading,Panel,Stack,colors}from'../ui/Primitives';
import{safeSource}from'./forms.mjs';
import type{Item,LoadState}from'./Provider';
export{Action,Body,Heading,Panel,Stack,colors};
export function Eyebrow({children}:{children:ReactNode}){return <Text style={{fontSize:12,lineHeight:18,letterSpacing:1.3,fontWeight:'700',textTransform:'uppercase',color:colors.muted}}>{children}</Text>;}
export function Row({children,...props}:ViewProps){return <View {...props} style={[{flexDirection:'row',flexWrap:'wrap',gap:12,alignItems:'center',minWidth:0},props.style]}>{children}</View>;}
export function Small({children}:{children:ReactNode}){return <Text style={{fontSize:13,lineHeight:20,color:colors.muted,flexShrink:1}}>{children}</Text>;}
export function Tag({label}:{label:string}){return <View style={{alignSelf:'flex-start',paddingHorizontal:10,paddingVertical:5,borderRadius:3,backgroundColor:'#eaf0f5'}}><Text style={{fontSize:12,fontWeight:'700',color:colors.ink}}>{label.replaceAll('_',' ')}</Text></View>;}
export function LabelValue({label,value}:{label:string;value:unknown}){return <View style={{gap:4,minWidth:0}}><Small>{label}</Small><Body>{value===null||value===undefined||value===''?'Not confirmed':typeof value==='object'?JSON.stringify(value):String(value)}</Body></View>;}
export function Notice({title,children,error=false}:{title?:string;children:ReactNode;error?:boolean}){return <View accessibilityRole={error?'alert':undefined} accessibilityLiveRegion="polite" style={{padding:16,gap:5,borderLeftWidth:3,borderColor:error?'#a32b31':colors.orange,backgroundColor:error?'#fff1f0':'#fff8f1',borderRadius:4}}>{title?<Text style={{fontSize:16,fontWeight:'700',color:colors.navy}}>{title}</Text>:null}<Body>{children}</Body></View>;}
const errors:Record<string,string>={SIGNED_OUT:'Your session has expired. Sign in to continue.',FORBIDDEN:'Your account does not have access to this information.',NOT_FOUND:'This record is unavailable or no longer shared with you.',UNAVAILABLE:'The service is not available. No example records have been substituted.',CONFLICT:'The record changed or this retry contains different information. Refresh before editing.',INVALID_INPUT:'Review your entries and try again.',RATE_LIMITED:'Too many attempts. Try again later.'};
export function errorText(code:string){return errors[code]??'We could not confirm this action. Please retry.';}
export function LoadNotice({value,empty,onRetry}:{value:LoadState;empty:string;onRetry:()=>void}){
 if(value.status==='loading')return <Notice>Loading your records…</Notice>;
 if(value.status==='error')return <Stack><Notice error>{errorText(value.error)}</Notice><Action title="Retry loading" secondary onPress={onRetry}/></Stack>;
 if(value.status==='empty')return <Notice title="Nothing to show yet">{empty}</Notice>;return null;
}
export function recordTitle(item:Item){return String(item.name??item.headline??item.data?.name??item.data?.title??'Untitled record');}
export function RecordCard({item,onOpen,children}:{item:Item;onOpen?:()=>void;children?:ReactNode}){return <Panel><Row><Eyebrow>{item.kind??'Workspace record'}</Eyebrow><Tag label={item.status??'reported'}/></Row><Heading style={{fontSize:20,lineHeight:27}}>{recordTitle(item)}</Heading>{item.createdAt?<Small>Created {String(item.createdAt).slice(0,10)}</Small>:null}{children}{onOpen?<Action secondary title={'Open '+recordTitle(item)} onPress={onOpen}/>:null}</Panel>;}
export function SourceAction({url,label='Open source'}:{url:unknown;label?:string}){const safe=safeSource(url);return safe?<Action secondary title={label} onPress={()=>{void Linking.openURL(safe).catch(()=>{});}}/>:<Small>No approved source link is available.</Small>;}
export function Choice({label,selected,onPress}:{label:string;selected:boolean;onPress:()=>void}){return <Pressable accessibilityRole="radio" accessibilityLabel={label} accessibilityState={{selected,checked:selected}} onPress={onPress} style={{paddingHorizontal:13,paddingVertical:12,minHeight:46,borderWidth:1,borderColor:selected?colors.navy:colors.line,borderRadius:4,backgroundColor:selected?'#eaf0f5':'#fff'}}><Text style={{color:colors.navy,fontWeight:selected?'700':'500',fontSize:14}}>{label}</Text></Pressable>;}
export function Toggle({label,value,onChange}:{label:string;value:boolean;onChange:(value:boolean)=>void}){return <Pressable accessibilityRole="checkbox" accessibilityState={{checked:value}} accessibilityLabel={label} onPress={()=>onChange(!value)} style={{flexDirection:'row',gap:12,alignItems:'center',paddingVertical:12,minHeight:48}}><Text style={{fontSize:22,color:colors.navy}}>{value?'☑':'☐'}</Text><Body>{label}</Body></Pressable>;}
