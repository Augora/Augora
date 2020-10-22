import { WebMercatorViewport, FlyToInterpolator } from "react-map-gl"
import polylabel from "polylabel"
import GEOJsonDistrictFile from "static/list-district.json"
import GEOJsonDptFile from "static/departements.json"
import GEOJsonRegFile from "static/regions.json"
import { cloneDeep } from "lodash"

/**
 * Un enum pour simplifier visuellement les clés de numéro de zone de nos GeoJSON.
 *
 * Valeurs possibles: "code_cont", "code_reg", "code_dpt", ou "num_circ"
 */
export enum Code {
  Continent = "code_cont",
  Regions = "code_reg",
  Departements = "code_dpt",
  Circonscriptions = "num_circ",
}

/**
 * Un enum pour simplifier visuellement un code de continent
 *
 * Valeurs possibles: 0, 1, 2, 3
 */
export enum Continent {
  France = 0,
  DROM = 1,
  COM = 2,
  Hors = 3,
}

/**
 * Formate une feature array sous forme feature collection GEOJson
 * @param {AugoraMap.Feature[]} featureArray La feature collection renvoyée sera vide sans cet argument
 */
export const createFeatureCollection = (
  featureArray?: AugoraMap.Feature[]
): AugoraMap.FeatureCollection => {
  return {
    type: "FeatureCollection",
    features: featureArray ? featureArray : [],
  }
}

/**
 * Renvoie une feature collection sans les DROM-TOM-COM
 * @param {AugoraMap.FeatureCollection} file Le fichier à filtrer
 */
const removeOutreMer = (
  file: AugoraMap.FeatureCollection
): AugoraMap.FeatureCollection => {
  return createFeatureCollection(
    file.features.filter((feature) => feature.properties[Code.Regions] > 10)
  )
}

/**
 * Renvoie une feature collection avec que les DROM-TOM-COM
 * @param {AugoraMap.FeatureCollection} file Fichier à filtrer
 */
const getOutreMer = (
  file: AugoraMap.FeatureCollection
): AugoraMap.FeatureCollection => {
  return createFeatureCollection(
    file.features.filter(
      (feature) =>
        feature.properties[Code.Regions] < 10 ||
        feature.properties[Code.Regions] === "-"
    )
  )
}

/**
 * Renvoie une feature array de pseudo-régions COM
 */
const createCOMRegs = (): AugoraMap.Feature[] => {
  const COMFeatures: AugoraMap.Feature[] = GEOJsonDistrictFile.features.filter(
    (feat) => feat.properties[Code.Regions] === "-"
  )

  let newFeatures: AugoraMap.Feature[] = []

  cloneDeep(COMFeatures).forEach((o, i, array) => {
    //il faire un cloneDeep sinon le fichier est modifié
    const previousO = array[i - 1]
    if (previousO?.properties?.code_dpt === o?.properties?.code_dpt) {
      o.geometry.coordinates = [
        ...previousO.geometry.coordinates,
        ...o.geometry.coordinates,
      ] as AugoraMap.Position
      newFeatures.pop()
    }
    newFeatures.push(o)
  })

  newFeatures.forEach((o) => {
    o.properties.code_reg = o.properties.code_dpt
    o.properties.nom = o.properties.nom_dpt
    delete o.properties.ID
    delete o.properties.code_dpt
    delete o.properties.nom_dpt
    delete o.properties.nom_reg
    delete o.properties.num_circ
  })

  return newFeatures
}

/**
 * Feature collection GeoJSON des circonscriptions sans les DROM-COM
 */
export const GEOJsonDistrict: AugoraMap.FeatureCollection = removeOutreMer(
  GEOJsonDistrictFile
)

/**
 * Feature collection GeoJSON des départements sans les DROM-COM
 */
export const GEOJsonDpt: AugoraMap.FeatureCollection = removeOutreMer(
  GEOJsonDptFile
)

/**
 * Feature collection GeoJSON des régions sans les DROM-COM
 */
export const GEOJsonReg: AugoraMap.FeatureCollection = removeOutreMer(
  GEOJsonRegFile
)

/**
 * Feature collection GeoJSON des circonscriptions DROM-COM
 */
export const DROMGEOJsonDistrict: AugoraMap.FeatureCollection = getOutreMer(
  GEOJsonDistrictFile
)

/**
 * Feature collection GeoJSON des régions DROM-COM
 */
export const DROMGEOJsonReg: AugoraMap.FeatureCollection = createFeatureCollection(
  [...getOutreMer(GEOJsonRegFile).features, ...createCOMRegs()]
)

export const AllGEOJsonReg: AugoraMap.FeatureCollection = createFeatureCollection(
  [...GEOJsonReg.features, ...DROMGEOJsonReg.features]
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
export const franceBox: AugoraMap.Bounds = [
  [-6.416016, 40.747257],
  [11.162109, 51.426614],
]

/**
 * Pseudo-feature de la france metropolitaine
 */
export const metroFranceFeature: AugoraMap.Feature = {
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
 * Pseudo-feature des DROM-COM
 */
export const OMFeature: AugoraMap.Feature = {
  type: "Feature",
  geometry: {
    type: "Polygon",
    coordinates: [],
  },
  properties: {
    nom: "Outre-Mer",
    code_cont: Continent.DROM,
  },
}

/**
 * Pseudo-feature des Français établis hors de France
 */
export const HorsFeature: AugoraMap.Feature = {
  type: "Feature",
  geometry: {
    type: "Polygon",
    coordinates: [],
  },
  properties: {
    nom: "Français établis hors de France",
    code_cont: Continent.Hors,
  },
}

/**
 * Pseudo feature collection des continents
 */
export const continentFeatureCollection: AugoraMap.FeatureCollection = createFeatureCollection(
  [metroFranceFeature, OMFeature]
)

/**
 * Renvoie la GeoJSON Feature Collection associée au type de zone
 * @param zoneCode Le type de zone
 */
export const getGEOJsonFile = (zoneCode: Code): AugoraMap.FeatureCollection => {
  switch (zoneCode) {
    case Code.Circonscriptions:
      return GEOJsonDistrict
    case Code.Departements:
      return GEOJsonDpt
    case Code.Regions:
      return GEOJsonReg
    case Code.Continent:
      return continentFeatureCollection
    default:
      return createFeatureCollection()
  }
}

/**
 * Renvoie une bounding box utilisable par mapbox depuis un array GEOJson coordinates de type polygon ou multipolygon
 * @param {AugoraMap.Position} coordinates L'array de coordonnées GEOJson
 * @param {boolean} [multiPolygon] Mettre true si les coordonnées envoyées sont de type multipolygon
 */
const getBoundingBoxFromCoordinates = (
  coordinates: AugoraMap.Position,
  multiPolygon?: boolean
): AugoraMap.Bounds => {
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
 * @param {AugoraMap.Feature} feature Une feature GeoJSON de type polygon ou multipolygone
 */
export const getBoundingBoxFromFeature = (
  feature: AugoraMap.Feature
): AugoraMap.Bounds => {
  return feature.geometry.type === "Polygon"
    ? getBoundingBoxFromCoordinates(feature.geometry.coordinates)
    : getBoundingBoxFromCoordinates(feature.geometry.coordinates, true)
}

/**
 * Renvoie les coordonnées du centre d'une bounding box
 * @param {AugoraMap.Bounds} bbox Bounding box de type [[number, number], [number, number]]
 */
export const getBoundingBoxCenter = (
  bbox: AugoraMap.Bounds
): AugoraMap.Coordinates => {
  return [
    bbox[1][0] - (bbox[1][0] - bbox[0][0]) / 2,
    bbox[1][1] - (bbox[1][1] - bbox[0][1]) / 2,
  ]
}

/**
 * Renvoie l'aire d'une bounding box
 * @param {AugoraMap.Bounds} bbox La bounding box utilisable par mapbox
 */
export const getBoundingBoxSize = (bbox: AugoraMap.Bounds): number => {
  return (bbox[1][0] - bbox[0][0]) * (bbox[1][1] - bbox[0][1])
}

/**
 * Renvoie les coordonnées du centre visuel d'une feature GEOJson de type polygon ou multipolygon en utilisant la lib polylabel
 * @param {AugoraMap.Feature} polygon La feature contenant le ou les polygones
 */
export const getPolygonCenter = (
  polygon: AugoraMap.Feature
): AugoraMap.Coordinates => {
  if (polygon.geometry.type === "Polygon") {
    return polylabel(polygon.geometry.coordinates) as AugoraMap.Coordinates
  } else if (polygon.geometry.type === "MultiPolygon") {
    return polylabel(
      polygon.geometry.coordinates.reduce((acc, element) => {
        const elementSize = getBoundingBoxSize(
          getBoundingBoxFromCoordinates(element)
        )
        const accSize = getBoundingBoxSize(getBoundingBoxFromCoordinates(acc))

        return elementSize > accSize ? element : acc
      })
    ) as AugoraMap.Coordinates
  } else return [null, null]
}

/**
 * Transitionne de façon fluide vers une bounding box
 * @param {AugoraMap.Bounds} boundingBox La bounding box utilisable par mapbox
 * @param {*} viewportState Le state du viewport
 * @param {React.Dispatch<React.SetStateAction<{}>>} setViewportState Le setState du viewport
 */
export const flyToBounds = (
  boundingBox: AugoraMap.Bounds,
  viewportState: any,
  setViewportState: React.Dispatch<React.SetStateAction<{}>>
): void => {
  const bounds = new WebMercatorViewport(viewportState).fitBounds(boundingBox, {
    padding: 100,
  })
  setViewportState({
    ...bounds,
    transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
    transitionDuration: "auto",
  })
}

/**
 * Renvoie l'id du continent d'une feature
 * @param {AugoraMap.Feature} feature La feature à analyser
 */
export const getContinent = (feature: AugoraMap.Feature): Continent => {
  const zoneCode = getZoneCode(feature)

  switch (zoneCode) {
    case Code.Continent:
      return feature.properties[zoneCode]
    case Code.Regions:
      if (feature.properties[Code.Regions] < 10) return Continent.DROM
      else if (feature.properties[Code.Regions] > 900) return Continent.COM
      else return Continent.France
    case Code.Departements:
      return Continent.France
    case Code.Circonscriptions:
      if (Object.keys(feature.properties).includes(Code.Regions)) {
        if (feature.properties[Code.Regions] < 10) return Continent.DROM
        else if (feature.properties[Code.Departements] > 900)
          return Continent.COM
        else return Continent.France
      } else return Continent.Hors
    default:
      return null
  }
}

/**
 * Determine dans quelle vue la feature passée devrait être, renvoie null si la feature ne contient pas les infos nécéssaires
 * @param {AugoraMap.Feature} feature L'objet feature GeoJSON à analyser
 */
export const getZoneCode = (feature: AugoraMap.Feature): Code => {
  if (feature?.properties) {
    const featureKeys = Object.keys(feature.properties)

    if (featureKeys.includes(Code.Circonscriptions))
      return Code.Circonscriptions
    else if (featureKeys.includes(Code.Departements)) return Code.Departements
    else if (featureKeys.includes(Code.Regions)) {
      return Code.Regions
    } else if (featureKeys.includes(Code.Continent)) return Code.Continent
    else return null
  } else return null
}

/**
 * Renvoie la feature FranceZone d'un mousevent, null si la feature n'a pas le bon format
 */
export const getMouseEventFeature = (e): AugoraMap.Feature => {
  if (e.features && e.target.className === "overlays") {
    if (e.features[0]?.properties) {
      const featureProps = e.features[0].properties
      const zoneCode = getZoneCode(e.features[0])
      return getZoneFeature(
        featureProps[zoneCode],
        zoneCode,
        zoneCode === Code.Circonscriptions
          ? featureProps[Code.Departements]
          : null
      )
    } else return null
  } else return null
}

/**
 * Renvoie la feature d'une zone
 * @param {number} zoneId L'id de la zone
 * @param {Code} Code Le code de la zone
 * @param {number} [dptID] L'id du département, obligatoire si c'est une circonscription
 */
export const getZoneFeature = (
  zoneId: number | string,
  zoneCode: Code,
  dptId?: number
): AugoraMap.Feature => {
  switch (zoneCode) {
    case Code.Continent:
      return continentFeatureCollection.features.find(
        (entry) => entry.properties[zoneCode] == zoneId
      )
    case Code.Regions:
      return AllGEOJsonReg.features.find(
        (entry) => entry.properties[zoneCode] == zoneId
      )
    case Code.Departements:
      return GEOJsonDptFile.features.find(
        (entry) => entry.properties[zoneCode] == zoneId
      )
    case Code.Circonscriptions:
      return GEOJsonDistrictFile.features.find(
        (entry) =>
          entry.properties[zoneCode] == zoneId &&
          entry.properties[Code.Departements] == dptId
      )
    default:
      return null
  }
}

/**
 * Renvoie une feature collection GEOJson contenant les zones enfant de la feature fournie
 * @param {AugoraMap.Feature} feature La feature à analyser
 */
export const getChildFeatures = (
  feature: AugoraMap.Feature
): AugoraMap.FeatureCollection => {
  const zoneCode = getZoneCode(feature)
  const continentId = getContinent(feature)

  switch (zoneCode) {
    case Code.Continent:
      if (feature.properties[zoneCode] === Continent.DROM) return DROMGEOJsonReg
      else return GEOJsonReg
    case Code.Regions:
      if (continentId === Continent.DROM) {
        return createFeatureCollection(
          DROMGEOJsonDistrict.features.filter(
            (element) =>
              element.properties[zoneCode] === feature.properties[zoneCode]
          )
        )
      } else if (continentId === Continent.COM) {
        return createFeatureCollection(
          DROMGEOJsonDistrict.features.filter(
            (element) =>
              element.properties[Code.Departements] ===
              feature.properties[zoneCode]
          )
        )
      }
    case Code.Departements:
      return createFeatureCollection(
        getGEOJsonFile(
          zoneCode === Code.Regions ? Code.Departements : Code.Circonscriptions
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
 * @param {AugoraMap.Feature} feature La feature à analyser
 */
export const getSisterFeatures = (
  feature: AugoraMap.Feature
): AugoraMap.Feature[] => {
  const zoneCode = getZoneCode(feature)
  const props = feature?.properties
  const continentId = getContinent(feature)

  switch (zoneCode) {
    case Code.Continent:
      return continentFeatureCollection.features.filter(
        (entry) => entry.properties[zoneCode] !== props[zoneCode]
      )
    case Code.Regions:
      return continentId === Continent.France
        ? GEOJsonReg.features.filter(
            (entry) => entry.properties[zoneCode] !== props[zoneCode]
          )
        : DROMGEOJsonReg.features.filter(
            (entry) => entry.properties[zoneCode] !== props[zoneCode]
          )
    case Code.Departements:
      return getGEOJsonFile(zoneCode).features.filter(
        (entry) =>
          entry.properties[zoneCode] !== props[zoneCode] &&
          entry.properties[Code.Regions] === props[Code.Regions]
      )
    case Code.Circonscriptions:
      return getGEOJsonFile(zoneCode).features.filter(
        (entry) =>
          entry.properties[zoneCode] !== props[zoneCode] &&
          entry.properties[Code.Departements] === props[Code.Departements]
      )
    default:
      return []
  }
}

/**
 * Renvoie une feature collection contenant les zones soeurs, et les zones soeurs parentes
 * @param {AugoraMap.Feature} feature La feature à analyser
 */
export const getGhostZones = (
  feature: AugoraMap.Feature
): AugoraMap.FeatureCollection => {
  const zoneCode = getZoneCode(feature)

  if (zoneCode === Code.Regions || Code.Departements) {
    const regionSisters = getSisterFeatures(
      getZoneFeature(feature.properties[Code.Regions], Code.Regions)
    )
    if (zoneCode === Code.Regions) return createFeatureCollection(regionSisters)
    else {
      const dptSisters = getSisterFeatures(
        getZoneFeature(feature.properties[Code.Departements], Code.Departements)
      )
      return createFeatureCollection([...regionSisters, ...dptSisters])
    }
  } else return createFeatureCollection()
}

/**
 * Filtre un array de députés selon une zone
 * @param {AugoraMap.Feature} feature La feature à analyser
 * @param {AugoraMap.DeputiesList} list La liste de députés à filtrer
 */
export const getDeputies = (
  feature: AugoraMap.Feature,
  list: AugoraMap.DeputiesList
): AugoraMap.DeputiesList => {
  const zoneCode = getZoneCode(feature)
  const continentId = getContinent(feature)

  switch (zoneCode) {
    case Code.Continent:
      if (feature.properties[zoneCode] === Continent.DROM)
        return list.filter((i) => {
          return parseInt(i.NumeroRegion) < 10 || i.NumeroRegion === "COM"
        })
      else
        return list.filter((i) => {
          return parseInt(i.NumeroRegion) > 10
        })
    case Code.Regions:
      return list.filter((i) => {
        return continentId !== Continent.COM
          ? i.NumeroRegion == feature.properties[Code.Regions]
          : i.NumeroDepartement == feature.properties[Code.Regions]
      })
    case Code.Departements:
      return list.filter((i) => {
        return i.NumeroDepartement == feature.properties[Code.Departements]
      })
    case Code.Circonscriptions:
      return [
        list.find((i) => {
          return continentId === Continent.DROM
            ? i.NumeroCirconscription ==
                feature.properties[Code.Circonscriptions] &&
                i.NumeroRegion == feature.properties[Code.Regions]
            : i.NumeroCirconscription ==
                feature.properties[Code.Circonscriptions] &&
                i.NumeroDepartement == feature.properties[Code.Departements]
        }),
      ]
    default:
      return []
  }
}
