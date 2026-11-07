import{useMemo}from'react';
import{useWindowDimensions}from'react-native';
import{useSafeAreaInsets}from'react-native-safe-area-context';
import{useReservedRegions,isReservedRegionsAvailable}from'@nyc-tron/reserved-regions';
import{resolveUsableRegions,foldFeaturesFromRegions}from'@nyc-tron/core/folds';
import{ResearchScreen}from'../../shared/ResearchScreen';
import{Body,Panel}from'../../shared/ui/Primitives';
import{createResearchClient}from'../../../client/research-client.mjs';
export default function SourceReview(){
 const origin=process.env.EXPO_PUBLIC_INFRAX_API_ORIGIN;
 const load=useMemo(()=>{try{return origin?createResearchClient({baseUrl:origin}):null;}catch{return null;}},[origin]);
 const window=useWindowDimensions(),safe=useSafeAreaInsets(),reserved=useReservedRegions();
 const container={x:safe.left,y:safe.top,width:Math.max(0,window.width-safe.left-safe.right),height:Math.max(0,window.height-safe.top-safe.bottom)};
 const usable=resolveUsableRegions({container,features:foldFeaturesFromRegions(reserved)}),first=usable[0];
 if(!first)return <Panel><Body>No usable display region is currently available.</Body></Panel>;
 // Core returns CONTAINER-LOCAL rects. Add its measured window origin exactly once.
 const region={x:container.x+first.x,y:container.y+first.y,width:first.width,height:first.height};
 // A nonlinked Expo Go shell cannot be certified hinge-safe; use a development build.
 const linked=isReservedRegionsAvailable();
 return <ResearchScreen load={load} sessionScope="native-cookie-session" region={region} geometryNotice={linked?undefined:'Native reserved-region module is not linked in this binary. Hinge behavior is unverified; use the development build.'}/>;
}
