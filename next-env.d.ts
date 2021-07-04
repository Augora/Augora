/// <reference types="next" />
/// <reference types="next/types/global" />
/// <reference types="next/image-types/global" />

declare module "react-helmet"
declare module "*.png"
declare module "*.svg" {
  import React = require("react")
  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>
  export default ReactComponent
}
declare module "*.jpg"
declare module "*.geojson" {
  const GeoJSONType: AugoraMap.FeatureCollection
  export default GeoJSONType
}

