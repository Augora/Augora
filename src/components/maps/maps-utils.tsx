import GEOJsonDistrict from "../../static/list-district"
import GEOJsonDpt from "../../static/departements"
import GEOJsonRegWithDOMTOM from "../../static/regions"

type Bounds = [[number, number], [number, number]]

export enum ZoneCode {
  Regions = "code_reg",
  Departements = "code_dpt",
  Circonscriptions = "num_circ",
}

export const GEOJsonReg: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: GEOJsonRegWithDOMTOM.features.filter(
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
  [France.southWest.lng, France.southWest.lat],
  [France.northEast.lng, France.northEast.lat],
]

/**
 * Returns a GeoJSON bounding box from a GeoJSON feature containing a single or multiple polygons
 * @param {GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>} polygon : a GeoJSON feature of type polygon or multipolygon
 */
export const getBoundingBoxFromPolygon = (
  polygon: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>
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
