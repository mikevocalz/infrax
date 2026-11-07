const path=require('node:path');
const {getDefaultConfig}=require('expo/metro-config');
const project=__dirname, workspace=path.resolve(project,'..'), repository=path.resolve(workspace,'..');
const config=getDefaultConfig(project);
config.watchFolders=[repository];
config.resolver.nodeModulesPaths=[path.join(workspace,'node_modules')];
// All shared source must resolve the same React and React Native singleton.
const singleton=new Set(['react','react-dom','react-native','zustand']);
config.resolver.resolveRequest=(context,name,platform)=>{
 const id=name.startsWith('@')?name.split('/').slice(0,2).join('/'):name.split('/')[0];
 if(singleton.has(id)){
  const absolute=require.resolve(name,{paths:[workspace]});
  return context.resolveRequest(context,absolute,platform);
 }
 return context.resolveRequest(context,name,platform);
};
module.exports=config;
