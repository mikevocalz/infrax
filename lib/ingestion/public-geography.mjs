/** Public facility discovery only; GeoJSON alone never proves site identity, tier or available MW. */
export function geojsonDiscoveryFeatures(featureCollection, {sourceUrl,license}) {
 if(!sourceUrl || !license) throw new Error('Source provenance and license are mandatory');
 if(featureCollection?.type!=='FeatureCollection'||!Array.isArray(featureCollection.features)) throw new TypeError('GeoJSON FeatureCollection required');
 return featureCollection.features.filter(f=>f && f.type==='Feature').map((feature,index)=>({
  externalKey:String(feature.id ?? index),
  geometry:feature.geometry??null,
  observedProperties:feature.properties??{},
  sourceUrl, license,
  verifiedFacility:false, sellableCapacityMw:null, publicStatus:'unverified_discovery'
 }));
}