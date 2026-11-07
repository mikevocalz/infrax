import path from 'node:path';import{fileURLToPath}from'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export default {
 transpilePackages:['@nyc-tron/core','@nyc-tron/ui','react-native-web'],
 experimental:{externalDir:true},
 webpack(config){
  config.resolve.alias={...config.resolve.alias,'react-native$':path.join(root,'node_modules/react-native-web')};
  config.resolve.modules=[path.join(root,'node_modules'),...(config.resolve.modules??[])];
  return config;
 }
};
