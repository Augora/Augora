import { MapRef } from "react-map-gl"
import {
  Code,
  Cont,
  Pos,
  createFeature,
  createFeatureCollection,
  flyToCoords,
  franceBox,
  geolocateFeature,
  getCodeFromCodes,
  getCodesFromFeature,
  getContinent,
  getZoneCode,
  getBoundingBoxFromCoordinates,
} from "components/maps/maps-utils"
import { WebMercatorViewport } from "@math.gl/web-mercator"
import { slugify } from "utils/utils"
import { ParsedUrlQuery } from "querystring"
import MetroFranceContFile from "static/cont-france.geojson"
import MetroRegFile from "static/reg-metro.geojson"
import MetroDptFile from "static/dpt-metro.geojson"
import OMDptFile from "static/dpt-om.geojson"
import MetroCircFile from "static/circ-metro.geojson"
import OMCircFile from "static/circ-om.geojson"
import HorsCircFile from "static/circ-hors.geojson"

/** Feature collection GeoJSON de toutes les régions */
export const AllReg: AugoraMap.FeatureCollection = MetroRegFile

/** Feature collection GeoJSON de tous les départements */
export const AllDpt: AugoraMap.FeatureCollection = createFeatureCollection([...MetroDptFile.features, ...OMDptFile.features])

/** Feature collection GeoJSON de toutes les circonscriptions */
export const AllCirc: AugoraMap.FeatureCollection = createFeatureCollection([
  ...MetroCircFile.features,
  ...OMCircFile.features,
  ...HorsCircFile.features,
])

/** Bounding box de l'atlantique */
export const worldBox: AugoraMap.Bounds = [
  [-111.005859, -28.381735],
  [81.914063, 59.800634],
]

/** Feature de la france metropolitaine */
export const MetroFeature: AugoraMap.Feature = MetroFranceContFile.features[0]

/** Pseudo-feature du monde */
export const WorldFeature: AugoraMap.Feature = createFeature("Monde", { code_cont: Cont.World })

/** Feature collection du monde */
export const WorldCont: AugoraMap.FeatureCollection = createFeatureCollection([
  MetroFeature,
  ...HorsCircFile.features,
  ...OMDptFile.features,
])

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
 * Transitionne de façon fluide vers une bounding box
 * @param {AugoraMap.Feature} feature La feature vers laquelle aller, dézoom sur le monde si la feature n'a pas de propriété bbox
 * @param {mapRef} mapRef Pointeur vers l'objet map
 * @param {boolean} isMobile Pour réduire le padding
 */
export const flyToBounds = <T extends GeoJSON.Feature>(feature: T, mapRef: MapRef, isMobile?: boolean): void => {
  const bounds: AugoraMap.Bounds = feature.properties.bbox ? feature.properties.bbox : worldBox

  const { longitude, latitude, zoom } = new WebMercatorViewport({
    width: mapRef.getContainer().getBoundingClientRect().width,
    height: mapRef.getContainer().getBoundingClientRect().height,
  }).fitBounds(bounds, {
    padding: isMobile ? 20 : 80,
  })

  flyToCoords(mapRef, [longitude, latitude], zoom)
}

/**
 * Renvoie la feature associée à un set de codes
 * @param codes
 */
export const getFeature = (codes: AugoraMap.Codes) => {
  const zoneCode = getCodeFromCodes(codes)
  switch (zoneCode) {
    case Code.Cont:
      if (codes[zoneCode] == Cont.France) return MetroFeature
      else return WorldFeature
    case Code.Reg:
      return MetroRegFile.features.find((entry) => entry.properties[zoneCode] == codes[zoneCode])
    case Code.Dpt:
      return codes[zoneCode] !== "999"
        ? AllDpt.features.find((entry) => entry.properties[zoneCode] == codes[zoneCode])
        : WorldFeature
    case Code.Circ:
      return AllCirc.features.find(
        (entry) => entry.properties[zoneCode] == codes[zoneCode] && entry.properties[Code.Dpt] == codes[Code.Dpt]
      )
    default:
      return null
  }
}

/**
 * Renvoie la feature FranceZone d'un mousevent, null si la feature n'a pas le bon format
 */
export const getMouseEventFeature = (e): AugoraMap.Feature => {
  if (e.features) {
    if (e.features[0]?.properties) {
      return getFeature(getCodesFromFeature(e.features[0]))
    } else return null
  } else return null
}

/**
 * Renvoie la feature parente de la feature fournie
 * @param {GeoJSON.Feature} feature
 */
export const getParentFeature = <T extends GeoJSON.Feature>(feature: T): AugoraMap.Feature => {
  switch (getZoneCode(feature)) {
    case Code.Reg:
      return MetroFeature
    case Code.Dpt:
      return getContinent(feature) === Cont.OM ? WorldFeature : getFeature({ [Code.Reg]: feature.properties[Code.Reg] })
    case Code.Circ:
      return getFeature({ [Code.Dpt]: feature.properties[Code.Dpt] })
    default:
      return WorldFeature
  }
}

/**
 * Renvoie une feature collection GEOJson contenant les zones enfant de la feature fournie, renvoie la feature seule sous forme de collection s'il n'y a pas d'enfants
 * @param {GeoJSON.Feature} feature
 */
export const getChildFeatures = (feature: AugoraMap.Feature): AugoraMap.FeatureCollection => {
  const zoneCode = getZoneCode(feature)

  switch (zoneCode) {
    case Code.Cont:
      if (feature.properties[zoneCode] === Cont.OM) return OMDptFile
      else if (feature.properties[zoneCode] === Cont.World) return WorldCont
      else return MetroRegFile
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
 * @param {GeoJSON.Feature} feature La feature à analyser
 */
export const getSisterFeatures = <T extends GeoJSON.Feature>(feature: T): AugoraMap.Feature[] => {
  const zoneCode = getZoneCode(feature)
  const props = feature?.properties
  const contId = getContinent(feature)

  switch (zoneCode) {
    case Code.Reg:
      return MetroRegFile.features.filter((entry) => entry.properties[zoneCode] !== props[zoneCode])
    case Code.Dpt:
      return contId === Cont.France
        ? MetroDptFile.features.filter(
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
 * @param {GeoJSON.Feature} feature La feature à analyser
 */
export const getGhostZones = <T extends GeoJSON.Feature>(feature: T): AugoraMap.FeatureCollection => {
  const zoneCode = getZoneCode(feature)
  const contId = getContinent(feature)

  if (zoneCode === Code.Reg || Code.Dpt) {
    const regSisters = getSisterFeatures(getFeature({ [Code.Reg]: feature.properties[Code.Reg] }))
    if (zoneCode === Code.Reg) return createFeatureCollection(regSisters)
    else {
      const dptSisters = getSisterFeatures(feature)
      return contId === Cont.France
        ? createFeatureCollection([...regSisters, ...dptSisters])
        : createFeatureCollection(dptSisters)
    }
  } else return createFeatureCollection()
}

/** Renvoie une feature correspondant à une query nextjs */
export const getFeatureFromQuery = (query: ParsedUrlQuery): AugoraMap.Feature => {
  if (query) {
    let codes: AugoraMap.Codes = {}
    if (query.circ) codes.code_circ = +query.circ
    if (query.dpt) codes.code_dpt = query.dpt as string
    if (query.reg) codes.code_reg = query.reg as string
    if (query.cont) codes.code_cont = +query.cont
    return getFeature(codes)
  } else return null
}

/** Cherche dans nos fichiers une feature aux coordonnées fournies
 * @param {Code} code Pour savoir dans quel type de zone chercher
 */
export const geolocateFromCoords = (coords: AugoraMap.Coordinates, code: Code): AugoraMap.Feature => {
  const features =
    code === Code.Circ
      ? AllCirc
      : code === Code.Dpt
      ? AllDpt
      : code === Code.Reg
      ? AllReg
      : createFeatureCollection([MetroFeature])

  return geolocateFeature(coords, features)
}

/** Renvoie la feature de nos fichiers la plus adaptée à un résultat de recherche API mapbox */
export const geolocateZone = (feature: AugoraMap.MapboxAPIFeature): AugoraMap.Feature => {
  switch (feature.place_type[0]) {
    case "country":
      switch (feature.text) {
        case "Guyane":
        case "Guadeloupe":
        case "Martinique":
        case "La Réunion":
        case "Mayotte":
        case "Nouvelle-Calédonie":
        case "Polynésie française":
        case "Saint-Pierre-et-Miquelon":
        case "Wallis-et-Futuna":
          return geolocateFeature(feature.center, OMDptFile)
        case "France":
          return MetroFeature
        default:
          return geolocateFeature(feature.center, AllCirc)
      }
    case "region":
      if (feature.context[0].short_code === "fr") {
        switch (feature.text) {
          case "Bretagne":
          case "Normandie":
          case "Hauts-de-France":
          case "Pays de la Loire":
          case "Île-de-France":
          case "Centre-Val de Loire":
          case "Bourgogne-Franche-Comté":
          case "Auvergne-Rhône-Alpes":
          case "Nouvelle-Aquitaine":
          case "Provence-Alpes-Côte d'Azur":
          case "Occitanie":
          case "Corse":
            return geolocateFeature(feature.center, MetroRegFile)
          default:
            return geolocateFeature(feature.center, MetroDptFile)
        }
      } else return geolocateFeature(feature.center, AllCirc)
    default:
      return geolocateFeature(feature.center, AllCirc)
  }
}

export const getPositionFromQuery = (query: string[]): Pos => {
  if (query) {
    switch (query[0]) {
      case "france":
        if (query.length <= 1) return Pos.France
        else if (query.length === 2) return Pos.FrReg
        else if (query.length === 3) return Pos.FrDpt
        else return Pos.FrCirc
      case "om":
        if (query.length <= 1) return null
        else if (query.length === 2) return Pos.OMDpt
        else return Pos.OMCirc
      case "monde":
        if (query.length <= 1) return Pos.World
        else return Pos.WCirc
      default:
        return null
    }
  } else return null
}

export const getMapFeature = (query: string[]): AugoraMap.Feature => {
  switch (getPositionFromQuery(query)) {
    case Pos.France:
      return MetroFeature
    case Pos.FrReg:
      return MetroRegFile.features.find((feature) => slugify(feature.properties.nom) === query[1])
    case Pos.FrDpt:
      return MetroDptFile.features.find((feature) => slugify(feature.properties.nom) === query[2])
    case Pos.FrCirc:
      return MetroCircFile.features.find(
        (feature) => slugify(feature.properties.nom_dpt) === query[2] && feature.properties.code_circ === +query[3]
      )
    case Pos.OMDpt:
      return OMDptFile.features.find((feature) => slugify(feature.properties.nom) === query[1])
    case Pos.OMCirc:
      return OMCircFile.features.find(
        (feature) => slugify(feature.properties.nom_dpt) === query[1] && feature.properties.code_circ === +query[2]
      )
    case Pos.World:
      return WorldFeature
    case Pos.WCirc:
      return HorsCircFile.features.find((feature) => feature.properties.code_circ === +query[1])
    default:
      return null
  }
}

export const getMapGeoJSON = (query: string[]): AugoraMap.FeatureCollection => {
  switch (getPositionFromQuery(query)) {
    case Pos.France:
      return MetroRegFile
    case Pos.World:
      return WorldCont
    case Pos.FrReg:
      return createFeatureCollection(MetroDptFile.features.filter((element) => slugify(element.properties.nom_reg) === query[1]))
    case Pos.FrDpt:
      return createFeatureCollection(
        MetroCircFile.features.filter(
          (element) => slugify(element.properties.nom_reg) === query[1] && slugify(element.properties.nom_dpt) === query[2]
        )
      )
    case Pos.OMDpt:
      return createFeatureCollection(OMCircFile.features.filter((element) => slugify(element.properties.nom_dpt) === query[1]))
    case Pos.WCirc:
      return createFeatureCollection([HorsCircFile.features.find((element) => element.properties.code_circ === +query[1])])
    case Pos.OMCirc:
      return createFeatureCollection([
        OMCircFile.features.find(
          (element) => slugify(element.properties.nom_dpt) === query[1] && element.properties.code_circ === +query[2]
        ),
      ])
    case Pos.FrCirc:
      return createFeatureCollection([
        MetroCircFile.features.find(
          (element) =>
            slugify(element.properties.nom_reg) === query[1] &&
            slugify(element.properties.nom_dpt) === query[2] &&
            element.properties.code_circ === +query[3]
        ),
      ])
    default:
      return createFeatureCollection()
  }

  // switch (zoneCode) {
  //   case Code.Cont:
  //     if (feature.properties[zoneCode] === Cont.OM) return OMDptFile
  //     else if (feature.properties[zoneCode] === Cont.World) return WorldCont
  //     else return MetroRegFile
  //   case Code.Reg:
  //     return createFeatureCollection(
  //       AllDpt.features.filter((element) => element.properties[zoneCode] === feature.properties[zoneCode])
  //     )
  //   case Code.Dpt:
  //     return createFeatureCollection(
  //       AllCirc.features.filter((element) => element.properties[zoneCode] === feature.properties[zoneCode])
  //     )
  //   default:
  //     return createFeatureCollection()
  // }
}
