import { WebMercatorViewport, FlyToInterpolator } from "react-map-gl"
import GEOJsonDistrictFile from "../../static/list-district"
import GEOJsonDptFile from "../../static/departements"
import GEOJsonRegFile from "../../static/regions"

/**
 * Un array de 2 coordonnées: southwest & northeast utilisable par mapbox pour les bounding boxes
 */
export type Bounds = [[number, number], [number, number]]

/**
 * Un object de type Feature collection GeoJSON ne contenant que des polygones ou des multipolygones
 */
export interface FranceZoneFeatureCollection
  extends GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon> {}

/**
 * Un object de type Feature GeoJSON ne contenant que des polygones ou des multipolygones
 */
export interface FranceZoneFeature
  extends GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> {}

/**
 * Un enum pour simplifier visuellement les codes de zone de nos GeoJSON.
 * Valeurs possibles: "code_reg", "code_dpt", ou "num_circ"
 */
export enum ZoneCode {
  Regions = "code_reg",
  Departements = "code_dpt",
  Circonscriptions = "num_circ",
}

export const GEOJsonDistrict: FranceZoneFeatureCollection = GEOJsonDistrictFile

export const GEOJsonDpt: FranceZoneFeatureCollection = GEOJsonDptFile

/**
 * Une feature collection GeoJSON des régions sans les DOM-TOM
 */
export const GEOJsonReg: FranceZoneFeatureCollection = {
  type: "FeatureCollection",
  features: GEOJsonRegFile.features.filter(
    (feature) => feature.properties.code_reg > 10
  ),
}

/**
 * Différentes coordonnées de la france métropolitaine
 */
export const France = {
  center: { lng: 1.88, lat: 46.6 },
  northWest: { lng: -6.864165, lat: 50.839888 },
  southEast: { lng: 13.089067, lat: 41.284012 },
  southWest: { lng: -10, lat: 40.2 },
  northEast: { lng: 11, lat: 51.15 },
}

/**
 * Bounding box de la france métropolitaine
 */
export const franceBox: Bounds = [
  [-6.416016, 40.747257],
  [11.162109, 51.426614],
]

/**
 * Renvoie la GeoJSON Feature Collection associée au type de zone
 * @param zoneCode Le type de zone
 */
export const getGEOJsonFile = (
  zoneCode: ZoneCode
): FranceZoneFeatureCollection => {
  switch (zoneCode) {
    case ZoneCode.Circonscriptions:
      return GEOJsonDistrictFile
    case ZoneCode.Departements:
      return GEOJsonDptFile
    default:
      return GEOJsonReg
  }
}

/**
 * Renvoie une bounding box utilisable par mapbox depuis un ou plusieurs polygones GeoJSON
 * @param {FranceZoneFeature} polygon : Une feature GeoJSON de type polygon ou multipolygone
 */
export const getBoundingBoxFromPolygon = (
  polygon: FranceZoneFeature
): Bounds => {
  // Récupérer le NW et SE du(des) polygone(s) de la Circonscription
  var boxListOfLng = []
  var boxListOfLat = []

  if (polygon.geometry.type === "Polygon") {
    polygon.geometry.coordinates[0].forEach((coords) => {
      boxListOfLng.push(coords[0])
      boxListOfLat.push(coords[1])
    })
  } else {
    polygon.geometry.coordinates.forEach((polygon) => {
      polygon[0].forEach((coords) => {
        boxListOfLng.push(coords[0])
        boxListOfLat.push(coords[1])
      })
    })
  }
  return [
    [Math.min(...boxListOfLng), Math.min(...boxListOfLat)],
    [Math.max(...boxListOfLng), Math.max(...boxListOfLat)],
  ]
}

/**
 * Transitionne de façon fluide vers une bounding box
 * @param {Bounds} boundingBox La bounding box utilisable par mapbox
 * @param {*} viewportState Le state du viewport
 * @param {React.Dispatch<React.SetStateAction<{}>>} setViewportState Le setState du viewport
 */
export const flyToBounds = (
  boundingBox: Bounds,
  viewportState: any,
  setViewportState: React.Dispatch<React.SetStateAction<{}>>
): void => {
  const bounds = new WebMercatorViewport(viewportState).fitBounds(boundingBox, {
    padding: 100,
  })
  setViewportState({
    ...bounds,
    transitionInterpolator: new FlyToInterpolator({ speed: 1.5 }),
    transitionDuration: "auto",
  })
}

/**
 * Renvoie une feature collection GEOJson selon certains filtres
 * @param {FranceZoneFeatureCollection} GEOJsonFile La feature collection GEOJson dans laquelle fouiller
 * @param {ZoneCode} zoneCodeToSearch Le Code de zone commune à chercher dans les feature GEOJson
 * @param {number} zoneCodeId L'id de la zone commune
 */
export const filterNewGEOJSonFeatureCollection = (
  GEOJsonFile: FranceZoneFeatureCollection,
  zoneCodeToSearch: ZoneCode,
  zoneCodeId: number
): FranceZoneFeatureCollection => {
  return {
    type: "FeatureCollection",
    features: GEOJsonFile.features.filter(
      (feature) => feature.properties[zoneCodeToSearch] === zoneCodeId
    ),
  }
}

/**
 * Renvoie une feature GeoJSON polygone ou multipolygone selon certains filtres
 * @param {FranceZoneFeatureCollection} GEOJsonFile La feature collection dans laquelle fouiller, ne peut contenir que des polygons ou multipolygons
 * @param {ZoneCode} zoneCode Le type de la zone (régions, départements, ou circonscriptions)
 * @param {number} zoneId L'id de la zone
 */
export const getZonePolygon = (
  GEOJsonFile: FranceZoneFeatureCollection,
  zoneCode: ZoneCode,
  zoneId: number
): FranceZoneFeature => {
  return GEOJsonFile.features.find((zone) => {
    return zone.properties[zoneCode] === zoneId
  })
}

/**
 * Determine dans quelle vue l'objet passé devrait être
 * @param {GeoJSON.GeoJsonProperties} featureProperties L'objet feature properties GeoJSON à analyser
 */
export const getZoneCodeFromFeatureProperties = (
  featureProperties: GeoJSON.GeoJsonProperties
): ZoneCode => {
  if (featureProperties) {
    const featureAsAnArray = Object.keys(featureProperties)

    if (featureAsAnArray.includes(ZoneCode.Circonscriptions))
      return ZoneCode.Circonscriptions
    else if (featureAsAnArray.includes(ZoneCode.Departements))
      return ZoneCode.Departements
    else return ZoneCode.Regions
  }
}

/**
 * Returns the first feature properties of a mouseevent, null if there is none
 */
export const getMouseEventFeatureProps = (e): GeoJSON.GeoJsonProperties => {
  if (e.features) {
    if (e.features[0]?.properties) return e.features[0].properties
    else return null
  } else return null
}
