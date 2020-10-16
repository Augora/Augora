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
  code_cont?: number
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
  Continent = "code_cont",
  Regions = "code_reg",
  Departements = "code_dpt",
  Circonscriptions = "num_circ",
}

export enum Continent {
  France = 0,
  DOMTOM = 1,
  Hors = 2,
}

/**
 * Formate une feature array sous forme feature collection GEOJson
 * @param featureArray La feature collection renvoyée sera vide sans cet argument
 */
export const createFeatureCollection = (
  featureArray?: FranceZoneFeature[]
): FranceZoneFeatureCollection => {
  return {
    type: "FeatureCollection",
    features: featureArray ? featureArray : [],
  }
}

/**
 * Renvoie une feature collection sans les DOM-TOM
 * @param {FranceZoneFeatureCollection} file Le fichier à filtrer
 */
const removeDOMTOM = (
  file: FranceZoneFeatureCollection
): FranceZoneFeatureCollection => {
  return createFeatureCollection(
    file.features.filter((feature) => feature.properties[ZoneCode.Regions] > 10)
  )
}

/**
 * Renvoie une feature collection avec que les DOM-TOM
 * @param {FranceZoneFeatureCollection} file Fichier à filtrer
 */
const isolateDOMTOM = (
  file: FranceZoneFeatureCollection
): FranceZoneFeatureCollection => {
  return createFeatureCollection(
    file.features.filter((feature) => feature.properties[ZoneCode.Regions] < 10)
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
 * Feature collection GeoJSON des circonscriptions DOM-TOM
 */
export const DOMTOMGEOJsonDistrict: FranceZoneFeatureCollection = isolateDOMTOM(
  GEOJsonDistrictFile
)

/**
 * Feature collection GeoJSON des régions DOM-TOM
 */
export const DOMTOMGEOJsonReg: FranceZoneFeatureCollection = isolateDOMTOM(
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
 * Pseudo-feature de la france metropolitaine
 */
export const metroFranceFeature: FranceZoneFeature = {
  type: "Feature",
  geometry: {
    type: "Polygon",
    coordinates: [],
  },
  properties: {
    nom: "France métropolitaine",
    code_cont: Continent.France,
  },
}

/**
 * Pseudo-feature des DOM-TOM
 */
export const DOMTOMFeature: FranceZoneFeature = {
  type: "Feature",
  geometry: {
    type: "Polygon",
    coordinates: [],
  },
  properties: {
    nom: "DOM-TOM",
    code_cont: Continent.DOMTOM,
  },
}

/**
 * Pseudo feature collection des continents
 */
export const continentFeatureCollection: FranceZoneFeatureCollection = createFeatureCollection(
  [metroFranceFeature, DOMTOMFeature]
)

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
    case ZoneCode.Regions:
      return GEOJsonReg
    case ZoneCode.Continent:
      return continentFeatureCollection
    default:
      return createFeatureCollection()
  }
}

/**
 * Renvoie la GeoJSON Feature Collection DOMTOM associée au type de zone
 * @param zoneCode Le type de zone
 */
export const getGEOJsonDOMTOM = (
  zoneCode: ZoneCode
): FranceZoneFeatureCollection => {
  switch (zoneCode) {
    case ZoneCode.Circonscriptions:
      return DOMTOMGEOJsonDistrict
    case ZoneCode.Regions:
      return DOMTOMGEOJsonReg
    case ZoneCode.Continent:
      return continentFeatureCollection
    default:
      return createFeatureCollection()
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
 * @param {FranceZoneFeature} feature Une feature GeoJSON de type polygon ou multipolygone
 */
export const getBoundingBoxFromFeature = (
  feature: FranceZoneFeature
): Bounds => {
  return feature.geometry.type === "Polygon"
    ? getBoundingBoxFromCoordinates(feature.geometry.coordinates)
    : getBoundingBoxFromCoordinates(feature.geometry.coordinates, true)
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

export const getContinentId = (feature: FranceZoneFeature): Continent => {
  const zoneCode = getFeatureZoneCode(feature)
  switch (zoneCode) {
    case ZoneCode.Continent:
      return feature.properties[zoneCode]
    case ZoneCode.Regions:
      return feature.properties[zoneCode] < 10
        ? Continent.DOMTOM
        : Continent.France
    case ZoneCode.Departements:
      return Continent.France
    case ZoneCode.Circonscriptions:
      const hasRegion = Object.keys(feature.properties).includes(
        ZoneCode.Regions
      )
      if (hasRegion) {
        return feature.properties[ZoneCode.Regions] < 10
          ? Continent.DOMTOM
          : Continent.France
      } else return Continent.Hors
    default:
      return null
  }
}

/**
 * Determine dans quelle vue la feature passée devrait être, renvoie null si la feature ne contient pas les infos nécéssaires
 * @param {FranceZoneFeature} feature L'objet feature GeoJSON à analyser
 */
export const getFeatureZoneCode = (feature: FranceZoneFeature): ZoneCode => {
  if (feature?.properties) {
    const featureKeys = Object.keys(feature.properties)

    if (featureKeys.includes(ZoneCode.Circonscriptions))
      return ZoneCode.Circonscriptions
    else if (featureKeys.includes(ZoneCode.Departements))
      return ZoneCode.Departements
    else if (featureKeys.includes(ZoneCode.Regions)) {
      return ZoneCode.Regions
    } else if (featureKeys.includes(ZoneCode.Continent))
      return ZoneCode.Continent
    else return null
  } else return null
}

/**
 * Renvoie la feature FranceZone d'un mousevent, null si la feature n'a pas le bon format
 */
export const getMouseEventFeature = (e): FranceZoneFeature => {
  if (e.features && e.target.className === "overlays") {
    if (e.features[0]?.properties) {
      const featureProps = e.features[0].properties
      const zoneCode = getFeatureZoneCode(e.features[0])
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
  switch (zoneCode) {
    case ZoneCode.Continent:
      return continentFeatureCollection.features.find(
        (entry) => entry.properties[zoneCode] == zoneId
      )
    case ZoneCode.Regions:
      return GEOJsonRegFile.features.find(
        (entry) => entry.properties[zoneCode] == zoneId
      )
    case ZoneCode.Departements:
      return GEOJsonDptFile.features.find(
        (entry) => entry.properties[zoneCode] == zoneId
      )
    case ZoneCode.Circonscriptions:
      return GEOJsonDistrictFile.features.find(
        (entry) =>
          entry.properties[zoneCode] == zoneId &&
          entry.properties[ZoneCode.Departements] == dptId
      )
    default:
      return null
  }
}

/**
 * Renvoie une feature collection GEOJson contenant les zones enfant de la feature fournie
 * @param {FranceZoneFeature} feature La feature à analyser
 */
export const getChildFeatures = (
  feature: FranceZoneFeature
): FranceZoneFeatureCollection => {
  const zoneCode = getFeatureZoneCode(feature)
  const continentId = getContinentId(feature)

  switch (zoneCode) {
    case ZoneCode.Continent:
      if (feature.properties[zoneCode] === Continent.DOMTOM)
        return DOMTOMGEOJsonReg
      else return GEOJsonReg
    case ZoneCode.Regions:
      if (continentId === Continent.DOMTOM) {
        return createFeatureCollection(
          DOMTOMGEOJsonDistrict.features.filter(
            (element) =>
              element.properties[zoneCode] === feature.properties[zoneCode]
          )
        )
      }
    case ZoneCode.Departements:
      return createFeatureCollection(
        getGEOJsonFile(
          zoneCode === ZoneCode.Regions
            ? ZoneCode.Departements
            : ZoneCode.Circonscriptions
        ).features.filter(
          (element) =>
            element.properties[zoneCode] === feature.properties[zoneCode]
        )
      )
    default:
      return createFeatureCollection()
  }
}

/**
 * Renvoie une feature array contenant toutes les zones soeurs de la zone fournie
 * @param {FranceZoneFeature} feature La feature à analyser
 */
export const getSisterFeatures = (
  feature: FranceZoneFeature
): FranceZoneFeature[] => {
  const zoneCode = getFeatureZoneCode(feature)
  const props = feature?.properties

  switch (zoneCode) {
    case ZoneCode.Continent:
    case ZoneCode.Regions:
      return getGEOJsonFile(zoneCode).features.filter(
        (entry) => entry.properties[zoneCode] !== props[zoneCode]
      )
    case ZoneCode.Departements:
      return getGEOJsonFile(zoneCode).features.filter(
        (entry) =>
          entry.properties[zoneCode] !== props[zoneCode] &&
          entry.properties[ZoneCode.Regions] === props[ZoneCode.Regions]
      )
    case ZoneCode.Circonscriptions:
      return getGEOJsonFile(zoneCode).features.filter(
        (entry) =>
          entry.properties[zoneCode] !== props[zoneCode] &&
          entry.properties[ZoneCode.Departements] ===
            props[ZoneCode.Departements]
      )
    default:
      return []
  }
}

/**
 * Renvoie une feature collection contenant les zones soeurs, et les zones soeurs parentes
 * @param {FranceZoneFeature} feature La feature à analyser
 */
export const getGhostZones = (
  feature: FranceZoneFeature
): FranceZoneFeatureCollection => {
  const zoneCode = getFeatureZoneCode(feature)

  if (zoneCode === ZoneCode.Regions || ZoneCode.Departements) {
    const regionSisters = getSisterFeatures(
      getZoneFeature(feature.properties[ZoneCode.Regions], ZoneCode.Regions)
    )
    if (zoneCode === ZoneCode.Regions)
      return createFeatureCollection(regionSisters)
    else {
      const dptSisters = getSisterFeatures(
        getZoneFeature(
          feature.properties[ZoneCode.Departements],
          ZoneCode.Departements
        )
      )
      return createFeatureCollection([...regionSisters, ...dptSisters])
    }
  } else return createFeatureCollection()
}
