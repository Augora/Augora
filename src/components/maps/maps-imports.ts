import { MapRef } from "react-map-gl"
import {
  Code,
  Pos,
  createFeature,
  createFeatureCollection,
  flyToCoords,
  franceBox,
  worldBox,
  geolocateFeature,
  getZoneCode,
  getBoundingBoxFromCoordinates,
  getPositionFromRoute,
  getPosition,
  getPosFromCodes,
} from "components/maps/maps-utils"
import { WebMercatorViewport } from "@math.gl/web-mercator"
import { slugify } from "utils/utils"
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

/** Feature de la france metropolitaine */
export const MetroFeature: AugoraMap.Feature = MetroFranceContFile.features[0]

/** Pseudo-feature du monde */
export const WorldFeature: AugoraMap.Feature = createFeature("Monde", { code_cont: 1 })

/** Feature collection du monde */
export const WorldCont: AugoraMap.FeatureCollection = createFeatureCollection([
  MetroFeature,
  ...HorsCircFile.features,
  ...OMDptFile.features,
])

/**
 * Renvoie une bounding box utilisable par mapbox depuis un ou plusieurs polygones geoJSON
 * Inutile depuis qu'on a calculé la bbox statiquement dans les geoJSON, privilégiez `feature.properties.bbox` à la place.
 * @param {AugoraMap.Feature} feature Une feature geoJSON de type polygon ou multipolygone
 */
export const getBoundingBoxFromFeature = (feature: AugoraMap.Feature): AugoraMap.Bounds => {
  if (feature?.geometry?.type) {
    if (getZoneCode(feature) !== Code.Cont)
      return feature.geometry.type === "Polygon"
        ? getBoundingBoxFromCoordinates(feature.geometry.coordinates)
        : getBoundingBoxFromCoordinates(feature.geometry.coordinates, true)
    else if (getPosition(feature) === Pos.France) return franceBox
    else return worldBox
  } else return null
}

/**
 * Renvoie la feature associée à un set de codes
 * @param codes
 */
export const getFeature = (codes: AugoraMap.Codes) => {
  switch (getPosFromCodes(codes)) {
    case Pos.FrReg:
      return MetroRegFile.features.find((feature) => feature.properties[Code.Reg] == codes[Code.Reg])
    case Pos.FrDpt:
      return MetroDptFile.features.find((feature) => feature.properties[Code.Dpt] == codes[Code.Dpt])
    case Pos.OMDpt:
      return OMDptFile.features.find((feature) => feature.properties[Code.Dpt] == codes[Code.Dpt])
    case Pos.FrCirc:
      return MetroCircFile.features.find(
        (feature) => feature.properties[Code.Circ] == codes[Code.Circ] && feature.properties[Code.Dpt] == codes[Code.Dpt]
      )
    case Pos.OMCirc:
      return OMCircFile.features.find(
        (feature) => feature.properties[Code.Circ] == codes[Code.Circ] && feature.properties[Code.Dpt] == codes[Code.Dpt]
      )
    case Pos.WCirc:
      return HorsCircFile.features.find((feature) => feature.properties[Code.Circ] == codes[Code.Circ])
    case Pos.France:
      return MetroFeature
    case Pos.World:
      return WorldFeature
    default:
      return null
  }
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

/**
 * Renvoie la Feature d'une route de la map
 * @param {string[]} route Route query de next.js
 */
export const getMapFeature = (route: string[]): AugoraMap.Feature => {
  switch (getPositionFromRoute(route)) {
    case Pos.France:
      return MetroFeature
    case Pos.FrReg:
      return MetroRegFile.features.find((feature) => slugify(feature.properties.nom) === route[1])
    case Pos.FrDpt:
      return MetroDptFile.features.find((feature) => slugify(feature.properties.nom) === route[2])
    case Pos.FrCirc:
      return MetroCircFile.features.find(
        (feature) => slugify(feature.properties.nom_dpt) === route[2] && feature.properties.code_circ === +route[3]
      )
    case Pos.OMDpt:
      return OMDptFile.features.find((feature) => slugify(feature.properties.nom) === route[1])
    case Pos.OMCirc:
      return OMCircFile.features.find(
        (feature) => slugify(feature.properties.nom_dpt) === route[1] && feature.properties.code_circ === +route[2]
      )
    case Pos.World:
      return WorldFeature
    case Pos.WCirc:
      return HorsCircFile.features.find((feature) => feature.properties.code_circ === +route[1])
    default:
      return null
  }
}

/**
 * Renvoie les geoJSON d'une route de la map
 * @param {string[]} route Route query de next.js
 */
export const getMapGeoJSON = (route: string[]): AugoraMap.FeatureCollection => {
  switch (getPositionFromRoute(route)) {
    case Pos.France:
      return MetroRegFile
    case Pos.World:
      return WorldCont
    case Pos.FrReg:
      return createFeatureCollection(MetroDptFile.features.filter((element) => slugify(element.properties.nom_reg) === route[1]))
    case Pos.FrDpt:
      return createFeatureCollection(
        MetroCircFile.features.filter(
          (element) => slugify(element.properties.nom_reg) === route[1] && slugify(element.properties.nom_dpt) === route[2]
        )
      )
    case Pos.OMDpt:
      return createFeatureCollection(OMCircFile.features.filter((element) => slugify(element.properties.nom_dpt) === route[1]))
    case Pos.WCirc:
      return createFeatureCollection([HorsCircFile.features.find((element) => element.properties.code_circ === +route[1])])
    case Pos.OMCirc:
      return createFeatureCollection([
        OMCircFile.features.find(
          (element) => slugify(element.properties.nom_dpt) === route[1] && element.properties.code_circ === +route[2]
        ),
      ])
    case Pos.FrCirc:
      return createFeatureCollection([
        MetroCircFile.features.find(
          (element) =>
            slugify(element.properties.nom_reg) === route[1] &&
            slugify(element.properties.nom_dpt) === route[2] &&
            element.properties.code_circ === +route[3]
        ),
      ])
    default:
      return createFeatureCollection()
  }
}

/**
 * Renvoie les geoJSON voisins d'une route de la map
 * @param {string[]} route Route query de next.js
 */
export const getMapGhostGeoJSON = (route: string[]): AugoraMap.FeatureCollection => {
  switch (getPositionFromRoute(route)) {
    case Pos.FrReg:
      return createFeatureCollection(MetroRegFile.features.filter((entry) => slugify(entry.properties.nom) !== route[1]))
    case Pos.FrDpt:
      const regSisters = MetroRegFile.features.filter((entry) => slugify(entry.properties.nom) !== route[1])
      const dptSisters = MetroDptFile.features.filter(
        (entry) => slugify(entry.properties.nom) !== route[2] && slugify(entry.properties.nom_reg) === route[1]
      )
      return createFeatureCollection([...regSisters, ...dptSisters])
    default:
      return createFeatureCollection()
  }
}
