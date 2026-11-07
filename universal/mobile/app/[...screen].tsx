import{useMemo}from'react';import{usePathname,useRouter,type Href}from'expo-router';import{useWindowDimensions}from'react-native';import{useSafeAreaInsets}from'react-native-safe-area-context';
import{useReservedRegions,isReservedRegionsAvailable}from'@nyc-tron/reserved-regions';import{resolveUsableRegions,foldFeaturesFromRegions}from'@nyc-tron/core/folds';
import{WorkspaceApp}from'../../shared/workspace/WorkspaceApp';import{Panel,Body}from'../../shared/ui/Primitives';import{createResearchClient}from'../../../client/research-client.mjs';
export default function Workspace(){const router=useRouter(),href=usePathname(),window=useWindowDimensions(),safe=useSafeAreaInsets(),reserved=useReservedRegions(),origin=process.env.EXPO_PUBLIC_INFRAX_API_ORIGIN;
 const load=useMemo(()=>{try{return origin?createResearchClient({baseUrl:origin}):null;}catch{return null;}},[origin]);
 const container={x:safe.left,y:safe.top,width:Math.max(0,window.width-safe.left-safe.right),height:Math.max(0,window.height-safe.top-safe.bottom)},first=resolveUsableRegions({container,features:foldFeaturesFromRegions(reserved)})[0];
 if(!first)return <Panel><Body>No usable display region is currently available.</Body></Panel>;
 const region={x:container.x+first.x,y:container.y+first.y,width:first.width,height:first.height};
 return <WorkspaceApp href={href} go={path=>router.push(path as Href)} back={()=>router.canGoBack()?router.back():router.replace('/app' as Href)} region={region} loadResearch={load} geometryNotice={isReservedRegionsAvailable()?undefined:'Native reserved-region module is not linked. Use a development build for hinge validation.'}/>;
}
