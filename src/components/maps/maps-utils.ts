import { WebMercatorViewport, FlyToInterpolator } from "react-map-gl"
import polylabel from "polylabel"
import MetroFranceContFile from "static/cont-france.json"
import MetroRegFile from "static/reg-metro.json"
import MetroDptFile from "static/dpt-metro.json"
import OMDptFile from "static/dpt-om.json"
import MetroCircFile from "static/circ-metro.json"
import OMCircFile from "static/circ-om.json"
import HorsCircFile from "static/circ-hors.json"

// Convert to any types
const MetroFranceContFileAsAny = MetroFranceContFile as any
const MetroRegFileAsAny = MetroRegFile as any
const MetroDptFileAsAny = MetroDptFile as any
const OMDptFileAsAny = OMDptFile as any
const MetroCircFileAsAny = MetroCircFile as any
const OMCircFileAsAny = OMCircFile as any
const HorsCircFileAsAny = HorsCircFile as any

/**
 * Un enum pour simplifier visuellement les clés de numéro de zone de nos GeoJSON.
 *
 * Valeurs possibles: Cont (code_cont), Reg (code_reg), Dpt (code_dpt), ou Circ (num_circ)
 */
export enum Code {
  Cont = "code_cont",
  Reg = "code_reg",
  Dpt = "code_dpt",
  Circ = "code_circ",
}

/**
 * Un enum pour simplifier visuellement un code de Continent
 *
 * Valeurs possibles: France, OM (Outre-Mer), Hors (Etablis hors de france)
 */
export enum Cont {
  France,
  World,
  OM,
}

/**
 * Renvoie une feature augoramap
 * @param {string} [nom] La property nom optionnelle
 * @param {AugoraMap.Properties} [otherProps] N'importe quelles autres properties, optionel
 * @param {"Polygon" | "MultiPolygon"} [type] Le type de geometry optionnel, par defaut: Polygon
 * @param {any[]} [coords] L'array de coordonnées optionnelle, par défaut une array vide
 */
export const createFeature = (
  nom?: string,
  otherProps?: AugoraMap.Properties,
  type?: "Polygon" | "MultiPolygon",
  coords?: any[]
): AugoraMap.Feature => {
  return {
    type: "Feature",
    geometry: {
      type: type ? type : "Polygon",
      coordinates: coords ? coords : [],
    },
    properties: {
      nom: nom ? nom : "",
      ...otherProps,
    },
  }
}

/**
 * Formate une feature array sous forme feature collection GEOJson
 * @param {AugoraMap.Feature[]} featureArray La feature collection renvoyée sera vide sans cet argument
 */
export const createFeatureCollection = (featureArray?: AugoraMap.Feature[]): AugoraMap.FeatureCollection => {
  return {
    type: "FeatureCollection",
    features: featureArray ? featureArray : [],
  }
}

/**
 * Feature collection GeoJSON de toutes les régions
 */
export const AllReg: AugoraMap.FeatureCollection = MetroRegFileAsAny

/**
 * Feature collection GeoJSON de tous les départements
 */
export const AllDpt: AugoraMap.FeatureCollection = createFeatureCollection([
  ...MetroDptFileAsAny.features,
  ...OMDptFileAsAny.features,
])

/**
 * Feature collection GeoJSON de toutes les circonscriptions
 */
export const AllCirc: AugoraMap.FeatureCollection = createFeatureCollection([
  ...MetroCircFileAsAny.features,
  ...OMCircFileAsAny.features,
  ...HorsCircFileAsAny.features,
])

/**
 * Bounding box de l'atlantique
 */
export const worldBox: AugoraMap.Bounds = [
  [-111.005859, -28.381735],
  [81.914063, 59.800634],
]

/**
 * Feature de la france metropolitaine
 */
export const MetroFeature: AugoraMap.Feature = MetroFranceContFileAsAny

/**
 * Pseudo-feature du monde
 */
export const WorldFeature: AugoraMap.Feature = createFeature("Monde", { code_cont: Cont.World })

/**
 * Feature collection du monde
 */
export const WorldCont: AugoraMap.FeatureCollection = createFeatureCollection([
  MetroFeature,
  ...HorsCircFileAsAny.features,
  ...OMDptFileAsAny.features,
])

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
 * Renvoie une bounding box utilisable par mapbox depuis un array GEOJson coordinates de type polygon ou multipolygon
 * @param {AugoraMap.Position} coordinates L'array de coordonnées GEOJson
 * @param {boolean} [multiPolygon] Mettre true si les coordonnées envoyées sont de type multipolygon
 */
const getBoundingBoxFromCoordinates = (
  coordinates: GeoJSON.Position[][] | GeoJSON.Position[][][],
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
export const getBoundingBoxFromFeature = (feature: AugoraMap.Feature): AugoraMap.Bounds => {
  if (feature?.geometry?.type) {
    if (getZoneCode(feature) !== Code.Cont)
      return feature.geometry.type === "Polygon"
        ? getBoundingBoxFromCoordinates(feature.geometry.coordinates)
        : getBoundingBoxFromCoordinates(feature.geometry.coordinates, true)
    else if (getContinent(feature) === Cont.France) return franceBox
    else return worldBox
  } else return null
}

/**
 * Renvoie les coordonnées du centre d'une bounding box
 * @param {AugoraMap.Bounds} bbox Bounding box de type [[number, number], [number, number]]
 */
export const getBoundingBoxCenter = (bbox: AugoraMap.Bounds): AugoraMap.Coordinates => {
  return [bbox[1][0] - (bbox[1][0] - bbox[0][0]) / 2, bbox[1][1] - (bbox[1][1] - bbox[0][1]) / 2]
}

/**
 * Renvoie l'aire d'une bounding box
 * @param {AugoraMap.Bounds} bbox La bounding box utilisable par mapbox
 */
const getBoundingBoxSize = (bbox: AugoraMap.Bounds): number => {
  return (bbox[1][0] - bbox[0][0]) * (bbox[1][1] - bbox[0][1])
}

/**
 * Renvoie les coordonnées du centre visuel d'une feature GEOJson de type polygon ou multipolygon en utilisant la lib polylabel
 * @param {AugoraMap.Feature} polygon La feature contenant le ou les polygones
 */
export const getPolygonCenter = (polygon: AugoraMap.Feature): AugoraMap.Coordinates => {
  if (polygon.geometry.type === "Polygon") {
    return polylabel(polygon.geometry.coordinates) as AugoraMap.Coordinates
  } else if (polygon.geometry.type === "MultiPolygon") {
    return polylabel(
      polygon.geometry.coordinates.reduce((acc, element) => {
        const elementSize = getBoundingBoxSize(getBoundingBoxFromCoordinates(element))
        const accSize = getBoundingBoxSize(getBoundingBoxFromCoordinates(acc))

        return elementSize > accSize ? element : acc
      })
    ) as AugoraMap.Coordinates
  } else return [null, null]
}

/**
 * Transitionne de façon fluide vers une zone
 * @param {AugoraMap.Feature} feature La feature vers laquelle aller
 * @param {*} viewState Le state du viewport
 * @param {React.Dispatch<React.SetStateAction<{}>>} setViewState Le setState du viewport
 */
export const flyToBounds = (
  feature: AugoraMap.Feature,
  viewState: any,
  setViewState: React.Dispatch<React.SetStateAction<{}>>
): void => {
  const bounds = new WebMercatorViewport(viewState).fitBounds(getBoundingBoxFromFeature(feature), { padding: 100 })
  setViewState({
    ...bounds,
    transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
    transitionDuration: "auto",
  })
}

/**
 * Renvoie l'id du continent d'une feature
 * @param {AugoraMap.Feature} feature La feature à analyser
 */
export const getContinent = (feature: AugoraMap.Feature): Cont => {
  const zoneCode = getZoneCode(feature)

  switch (zoneCode) {
    case Code.Cont:
      return feature.properties[zoneCode]
    case Code.Reg:
      return Cont.France
    case Code.Dpt:
      return feature.properties[Code.Dpt] > 900 ? Cont.OM : Cont.France
    case Code.Circ:
      if (feature.properties[Code.Dpt] === "999") return Cont.World
      else if (feature.properties[Code.Dpt] > 900) return Cont.OM
      else return Cont.France
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

    if (featureKeys.includes(Code.Circ)) return Code.Circ
    else if (featureKeys.includes(Code.Dpt)) return Code.Dpt
    else if (featureKeys.includes(Code.Reg)) return Code.Reg
    else if (featureKeys.includes(Code.Cont)) return Code.Cont
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
      return getFeature(featureProps[zoneCode], zoneCode, zoneCode === Code.Circ ? featureProps[Code.Dpt] : null)
    } else return null
  } else return null
}

/**
 * Renvoie la feature d'une zone
 * @param {number | string} zoneId L'id de la zone
 * @param {Code} zoneCode Le code de la zone
 * @param {number | string} [dptID] L'id du département, obligatoire si c'est une circonscription
 */
export const getFeature = (zoneId: number | string, zoneCode: Code, dptId?: number | string): AugoraMap.Feature => {
  switch (zoneCode) {
    case Code.Cont:
      if (zoneId === Cont.France) return MetroFeature
      else return WorldFeature
    case Code.Reg:
      return MetroRegFileAsAny.features.find((entry) => entry.properties[zoneCode] == zoneId)
    case Code.Dpt:
      return zoneId !== "999" ? AllDpt.features.find((entry) => entry.properties[zoneCode] == zoneId) : WorldFeature
    case Code.Circ:
      return AllCirc.features.find((entry) => entry.properties[zoneCode] == zoneId && entry.properties[Code.Dpt] == dptId)
    default:
      return null
  }
}

/**
 * Renvoie la feature parente de la feature fournie
 * @param {AugoraMap.Feature} feature
 */
export const getParentFeature = (feature: AugoraMap.Feature) => {
  switch (getZoneCode(feature)) {
    case Code.Reg:
      return MetroFeature
    case Code.Dpt:
      return getContinent(feature) === Cont.OM ? WorldFeature : getFeature(feature.properties[Code.Reg], Code.Reg)
    case Code.Circ:
      return getFeature(feature.properties[Code.Circ], Code.Circ, feature.properties[Code.Dpt])
    default:
      return WorldFeature
  }
}

/**
 * Renvoie une feature collection GEOJson contenant les zones enfant de la feature fournie
 * @param {AugoraMap.Feature} feature
 */
export const getChildFeatures = (feature: AugoraMap.Feature): AugoraMap.FeatureCollection => {
  const zoneCode = getZoneCode(feature)

  switch (zoneCode) {
    case Code.Cont:
      if (feature.properties[zoneCode] === Cont.OM) return OMDptFileAsAny
      else if (feature.properties[zoneCode] === Cont.World) return WorldCont
      else return MetroRegFileAsAny
    case Code.Reg:
      return createFeatureCollection(
        AllDpt.features.filter((element) => element.properties[zoneCode] === feature.properties[zoneCode])
      )
    case Code.Dpt:
      return createFeatureCollection(
        AllCirc.features.filter((element) => element.properties[zoneCode] === feature.properties[zoneCode])
      )
    default:
      return createFeatureCollection()
  }
}

/**
 * Renvoie une feature array contenant toutes les zones soeurs de la zone fournie
 * @param {AugoraMap.Feature} feature La feature à analyser
 */
export const getSisterFeatures = (feature: AugoraMap.Feature): AugoraMap.Feature[] => {
  const zoneCode = getZoneCode(feature)
  const props = feature?.properties
  const contId = getContinent(feature)

  switch (zoneCode) {
    case Code.Cont:
      if (contId === Cont.France) return OMDptFileAsAny.features
      break
    case Code.Reg:
      return MetroRegFileAsAny.features.filter((entry) => entry.properties[zoneCode] !== props[zoneCode])
    case Code.Dpt:
      return contId === Cont.France
        ? MetroDptFileAsAny.features.filter(
            (entry) => entry.properties[zoneCode] !== props[zoneCode] && entry.properties[Code.Reg] === props[Code.Reg]
          )
        : [...OMDptFile.features.filter((entry) => entry.properties[zoneCode] !== props[zoneCode]), MetroFeature]
    case Code.Circ:
      return AllCirc.features.filter(
        (entry) => entry.properties[zoneCode] !== props[zoneCode] && entry.properties[Code.Dpt] === props[Code.Dpt]
      )
    default:
      return []
  }
}

/**
 * Renvoie une feature collection contenant les zones soeurs, et les zones soeurs parentes
 * @param {AugoraMap.Feature} feature La feature à analyser
 */
export const getGhostZones = (feature: AugoraMap.Feature): AugoraMap.FeatureCollection => {
  const zoneCode = getZoneCode(feature)
  const contId = getContinent(feature)

  if (zoneCode === Code.Reg || Code.Dpt) {
    const regSisters = getSisterFeatures(getFeature(feature.properties[Code.Reg], Code.Reg))
    if (zoneCode === Code.Reg) return createFeatureCollection(regSisters)
    else {
      const dptSisters = getSisterFeatures(feature)
      return contId === Cont.France
        ? createFeatureCollection([...regSisters, ...dptSisters])
        : createFeatureCollection(dptSisters)
    }
  } else return createFeatureCollection()
}

/**
 * Renvoie un array de députés dans une zone, une array avec un seul élément si la zone est une circonscription, ou une array vide si aucun député trouvé
 * @param {AugoraMap.Feature} feature La zone feature à analyser
 * @param {AugoraMap.DeputiesList} deputies La liste de députés à filtrer
 */
export const getDeputies = (feature: AugoraMap.Feature, deputies: AugoraMap.DeputiesList): AugoraMap.DeputiesList => {
  const zoneCode = getZoneCode(feature)
  const props = feature?.properties
  const contId = getContinent(feature)

  switch (zoneCode) {
    case Code.Cont:
      return deputies.filter((deputy) => {
        if (contId === Cont.OM) return parseInt(deputy.NumeroDepartement) > 900 && deputy.NumeroDepartement !== "999"
        else if (contId === Cont.World) return deputy.NumeroDepartement === "999"
        else return parseInt(deputy.NumeroDepartement) < 900
      })
    case Code.Reg:
      return deputies.filter((deputy) => {
        return deputy.NumeroRegion == props[Code.Reg]
      })
    case Code.Dpt:
      return deputies.filter((deputy) => {
        return deputy.NumeroDepartement == props[Code.Dpt]
      })
    case Code.Circ:
      return [
        deputies.find((deputy) => {
          return deputy.NumeroCirconscription == props[Code.Circ] && deputy.NumeroDepartement == props[Code.Dpt]
        }),
      ]
    default:
      return []
  }
}

/**
 * Renvoie le nom d'une feature
 * @param {AugoraMap.Feature} feature
 */
export const getZoneName = (feature: AugoraMap.Feature): string => {
  const code = getZoneCode(feature)

  switch (code) {
    case Code.Cont:
    case Code.Reg:
      return feature.properties.nom
    case Code.Dpt:
      return `${feature.properties.nom} (${feature.properties[Code.Dpt]})`
    case Code.Circ:
      return `${feature.properties[Code.Circ]}${feature.properties[Code.Circ] < 2 ? "ère" : "ème"} Circonscription`
  }
}
