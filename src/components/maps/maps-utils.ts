import { WebMercatorViewport, FlyToInterpolator, ViewState } from "react-map-gl"
import polylabel from "polylabel"
import GEOJsonDistrictFile from "static/list-district.json"
import GEOJsonDptFile from "static/departements.json"
import GEOJsonRegFile from "static/regions.json"

/**
 * Un array de 2 nombres: longitude en premier et latitude, utilisable par mapbox pour les coordonées
 */
export type Coordinates = [number, number]

/**
 * Un array de 2 coordonnées: southwest lng, lat & northeast lng, lat utilisable par mapbox pour les bounding boxes
 */
export type Bounds = [Coordinates, Coordinates]

/**
 * Un array de type GeoJSON coordinates pour polygon ou multipolygon
 */
export type FranceZonePosition = GeoJSON.Position[][] | GeoJSON.Position[][][]

/**
 * Un object GEOJson geometry ne contenant que polygon ou multipolygon
 */
export type FranceZoneGeometry = GeoJSON.Polygon | GeoJSON.MultiPolygon

/**
 * Un object GEOJson properties contenant les clés de nos fichiers GEOJson
 */
export interface FranceZoneProperties extends GeoJSON.GeoJsonProperties {
  nom?: string
  code_reg?: number
  code_dpt?: number
  num_circ?: number
}

/**
 * Un object de type Feature GeoJSON ne contenant que des polygones ou des multipolygones et les properties de nos fichiers
 */
export interface FranceZoneFeature
  extends GeoJSON.Feature<FranceZoneGeometry, FranceZoneProperties> {}

/**
 * Un object de type Feature collection GeoJSON ne contenant que des features FranceZone
 */
export interface FranceZoneFeatureCollection extends GeoJSON.FeatureCollection {
  features: FranceZoneFeature[]
}

/**
 * Un enum pour simplifier visuellement les codes de zone de nos GeoJSON.
 *
 * Valeurs possibles: "code_reg", "code_dpt", ou "num_circ"
 */
export enum ZoneCode {
  Regions = "code_reg",
  Departements = "code_dpt",
  Circonscriptions = "num_circ",
}

/**
 * Formate une feature array sous forme feature collection GEOJson
 * @param featureArray
 */
export const featureArrayToFeatureCollection = (
  featureArray: FranceZoneFeature[]
): FranceZoneFeatureCollection => {
  return { type: "FeatureCollection", features: featureArray }
}

/**
 * Renvoie une feature collection sans les DOM-TOM
 * @param {FranceZoneFeatureCollection} file Le fichier à filtrer
 */
const removeDOMTOM = (
  file: FranceZoneFeatureCollection
): FranceZoneFeatureCollection => {
  return featureArrayToFeatureCollection(
    file.features.filter((feature) => feature.properties[ZoneCode.Regions] > 10)
  )
}

/**
 * Feature collection GeoJSON des circonscriptions sans les DOM-TOM
 */
export const GEOJsonDistrict: FranceZoneFeatureCollection = removeDOMTOM(
  GEOJsonDistrictFile
)

/**
 * Feature collection GeoJSON des départements sans les DOM-TOM
 */
export const GEOJsonDpt: FranceZoneFeatureCollection = removeDOMTOM(
  GEOJsonDptFile
)

/**
 * Feature collection GeoJSON des régions sans les DOM-TOM
 */
export const GEOJsonReg: FranceZoneFeatureCollection = removeDOMTOM(
  GEOJsonRegFile
)

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
 * FeatureProps de la france metropolitaine
 */
export const metroFranceProperties: FranceZoneProperties = {
  nom: "France métropolitaine",
}

/**
 * Pseudo-feature de la france metropolitaine
 */
export const metroFranceFeature: FranceZoneFeature = {
  type: "Feature",
  geometry: {
    type: "Polygon",
    coordinates: [],
  },
  properties: metroFranceProperties,
}

/**
 * Renvoie la GeoJSON Feature Collection associée au type de zone
 * @param zoneCode Le type de zone
 */
export const getGEOJsonFile = (
  zoneCode: ZoneCode
): FranceZoneFeatureCollection => {
  switch (zoneCode) {
    case ZoneCode.Circonscriptions:
      return GEOJsonDistrict
    case ZoneCode.Departements:
      return GEOJsonDpt
    default:
      return GEOJsonReg
  }
}

/**
 * Renvoie une bounding box utilisable par mapbox depuis un array GEOJson coordinates de type polygon ou multipolygon
 * @param {FranceZonePosition} coordinates L'array de coordonnées GEOJson
 * @param {boolean} [multiPolygon] Mettre true si les coordonnées envoyées sont de type multipolygon
 */
const getBoundingBoxFromCoordinates = (
  coordinates: FranceZonePosition,
  multiPolygon?: boolean
): Bounds => {
  var boxListOfLng = []
  var boxListOfLat = []

  if (!multiPolygon) {
    coordinates[0].forEach((coords) => {
      boxListOfLng.push(coords[0])
      boxListOfLat.push(coords[1])
    })
  } else {
    coordinates.forEach((polygon) => {
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
 * Renvoie une bounding box utilisable par mapbox depuis un ou plusieurs polygones GeoJSON
 * @param {FranceZoneFeature} polygon Une feature GeoJSON de type polygon ou multipolygone
 */
export const getBoundingBoxFromPolygon = (
  polygon: FranceZoneFeature
): Bounds => {
  return polygon.geometry.type === "Polygon"
    ? getBoundingBoxFromCoordinates(polygon.geometry.coordinates)
    : getBoundingBoxFromCoordinates(polygon.geometry.coordinates, true)
}

/**
 * Renvoie les coordonnées du centre d'une bounding box
 * @param {Bounds} bbox Bounding box de type [[number, number], [number, number]]
 */
export const getBoundingBoxCenter = (bbox: Bounds): Coordinates => {
  return [
    bbox[1][0] - (bbox[1][0] - bbox[0][0]) / 2,
    bbox[1][1] - (bbox[1][1] - bbox[0][1]) / 2,
  ]
}

/**
 * Renvoie l'aire d'une bounding box
 * @param {Bounds} bbox La bounding box utilisable par mapbox
 */
export const getBoundingBoxSize = (bbox: Bounds): number => {
  return (bbox[1][0] - bbox[0][0]) * (bbox[1][1] - bbox[0][1])
}

/**
 * Renvoie les coordonnées du centre visuel d'une feature GEOJson de type polygon ou multipolygon en utilisant la lib polylabel
 * @param {FranceZoneFeature} polygon La feature contenant le ou les polygones
 */
export const getPolygonCenter = (polygon: FranceZoneFeature): Coordinates => {
  if (polygon.geometry.type === "Polygon") {
    return polylabel(polygon.geometry.coordinates) as Coordinates
  } else if (polygon.geometry.type === "MultiPolygon") {
    return polylabel(
      polygon.geometry.coordinates.reduce((acc, element) => {
        const elementSize = getBoundingBoxSize(
          getBoundingBoxFromCoordinates(element)
        )
        const accSize = getBoundingBoxSize(getBoundingBoxFromCoordinates(acc))

        return elementSize > accSize ? element : acc
      })
    ) as Coordinates
  } else return [null, null]
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
  return featureArrayToFeatureCollection(
    GEOJsonFile.features.filter(
      (feature) => feature.properties[zoneCodeToSearch] === zoneCodeId
    )
  )
}

/**
 * Determine dans quelle vue la feature passée devrait être
 * @param {FranceZoneFeature} feature L'objet feature GeoJSON à analyser
 */
export const getZoneCodeFromFeature = (
  feature: FranceZoneFeature
): ZoneCode => {
  if (feature.properties) {
    const featureAsAnArray = Object.keys(feature.properties)

    if (featureAsAnArray.includes(ZoneCode.Circonscriptions))
      return ZoneCode.Circonscriptions
    else if (featureAsAnArray.includes(ZoneCode.Departements))
      return ZoneCode.Departements
    else if (featureAsAnArray.includes(ZoneCode.Regions))
      return ZoneCode.Regions
    else return null
  } else return null
}

/**
 * Renvoie la feature FranceZone d'un mousevent, null si la feature n'a pas le bon format
 */
export const getMouseEventFeature = (e): FranceZoneFeature => {
  if (e.features) {
    if (e.features[0]?.properties) {
      const featureProps = e.features[0].properties
      const zoneCode = getZoneCodeFromFeature(e.features[0])
      return getZoneFeature(
        featureProps[zoneCode],
        zoneCode,
        zoneCode === ZoneCode.Circonscriptions
          ? featureProps[ZoneCode.Departements]
          : null
      )
    } else return null
  } else return null
}

/**
 * Renvoie la feature d'une zone
 * @param {number} zoneId L'id de la zone
 * @param {ZoneCode} zoneCode Le code de la zone
 * @param {number} [dptID] L'id du département, obligatoire si c'est une circonscription
 */
export const getZoneFeature = (
  zoneId: number,
  zoneCode: ZoneCode,
  dptId?: number
): FranceZoneFeature => {
  return zoneCode !== ZoneCode.Circonscriptions
    ? getGEOJsonFile(zoneCode).features.find(
        (entry) => entry.properties[zoneCode] == zoneId
      )
    : getGEOJsonFile(zoneCode).features.find(
        (entry) =>
          entry.properties[zoneCode] == zoneId &&
          entry.properties[ZoneCode.Departements] == dptId
      )
}

/**
 * Renvoie une Feature Collection contenant toutes les zones soeurs de la zone fournie, zone fournie non inclue.
 * @param feature La feature à analyser
 */
export const getOtherFeaturesInZone = (
  feature: FranceZoneFeature
): FranceZoneFeatureCollection => {
  const zoneCode = getZoneCodeFromFeature(feature)

  switch (zoneCode) {
    case ZoneCode.Regions:
      return featureArrayToFeatureCollection(
        getGEOJsonFile(zoneCode).features.filter(
          (entry) => entry.properties[zoneCode] !== feature.properties[zoneCode]
        )
      )
    case ZoneCode.Departements:
      return featureArrayToFeatureCollection(
        getGEOJsonFile(zoneCode).features.filter(
          (entry) =>
            entry.properties[zoneCode] !== feature.properties[zoneCode] &&
            entry.properties[ZoneCode.Regions] ===
              feature.properties[ZoneCode.Regions]
        )
      )
    case ZoneCode.Circonscriptions:
      return featureArrayToFeatureCollection(
        getGEOJsonFile(zoneCode).features.filter(
          (entry) =>
            entry.properties[zoneCode] !== feature.properties[zoneCode] &&
            entry.properties[ZoneCode.Departements] ===
              feature.properties[ZoneCode.Departements]
        )
      )
    default:
      return featureArrayToFeatureCollection([metroFranceFeature])
  }
}
