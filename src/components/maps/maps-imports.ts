/**
 * @file Fichier pour importer les données geoJSON pour la map, éviter de l'utiliser en dehors de génération statique au risque d'avoir un temps de chargement très long
 */
import {
  Code,
  Pos,
  createFeature,
  createFeatureCollection,
  franceBox,
  worldBox,
  geolocateFeature,
  getZoneCode,
  getBoundingBoxFromCoordinates,
  getPositionFromRoute,
  getPosition,
  getPosFromCodes,
  getZoneName,
} from "components/maps/maps-utils"
import { slugify } from "utils/utils"
import MetroFranceContFile from "static/cont-france.geojson"
import MetroRegFile from "static/reg-metro.geojson"
import MetroDptFile from "static/dpt-metro.geojson"
import OMDptFile from "static/dpt-om.geojson"
import MetroCircFile from "static/circ-metro.geojson"
import OMCircFile from "static/circ-om.geojson"
import HorsCircFile from "static/circ-hors.geojson"
import sortBy from "lodash/sortBy"

/** Feature collection GeoJSON de toutes les régions */
const AllReg: AugoraMap.FeatureCollection = MetroRegFile

/** Feature collection GeoJSON de tous les départements */
const AllDpt: AugoraMap.FeatureCollection = createFeatureCollection([...MetroDptFile.features, ...OMDptFile.features])

/** Feature collection GeoJSON de toutes les circonscriptions */
const AllCirc: AugoraMap.FeatureCollection = createFeatureCollection([
  ...MetroCircFile.features,
  ...OMCircFile.features,
  ...HorsCircFile.features,
])

/** Feature de la france metropolitaine */
const MetroFeature: AugoraMap.Feature = MetroFranceContFile.features[0]

/** Pseudo-feature du monde */
const WorldFeature: AugoraMap.Feature = createFeature({ props: { nom: "Monde", code_cont: 1, center: [10.46, 31.43] } })

/** Feature collection du monde */
const WorldCont: AugoraMap.FeatureCollection = createFeatureCollection([
  MetroFeature,
  ...HorsCircFile.features,
  ...OMDptFile.features,
])

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

/**
 * Renvoie tous les enfants breadcrumb d'une zone dans une array
 * @param {AugoraMap.Codes} codes Les codes de la zone
 */
export const getBreadcrumbChildren = (codes: AugoraMap.Codes): AugoraMap.Breadcrumb[] => {
  switch (getPosFromCodes(codes)) {
    case Pos.World:
      return [
        { url: "france", nom: "France Metropolitaine", children: getBreadcrumbChildren({ code_cont: 0 }) },
        ...OMDptFile.features.map((item) => {
          return {
            nom: getZoneName(item),
            url: `om/${slugify(item.properties.nom)}`,
            children: getBreadcrumbChildren({ code_dpt: item.properties[Code.Dpt] }),
          }
        }),
      ]
    case Pos.France:
      return sortBy(
        MetroRegFile.features.map((item) => {
          return {
            nom: getZoneName(item),
            url: `france/${slugify(item.properties.nom)}`,
            children: getBreadcrumbChildren({ code_reg: item.properties[Code.Reg] }),
          }
        }),
        (o) => o.nom
      )
    case Pos.FrReg:
      return sortBy(
        MetroDptFile.features
          .filter((feature) => feature.properties[Code.Reg] === codes[Code.Reg])
          .map((item) => {
            return {
              nom: getZoneName(item),
              url: `france/${slugify(item.properties.nom_reg)}/${slugify(item.properties.nom)}`,
              children: getBreadcrumbChildren({ code_dpt: item.properties[Code.Dpt] }),
            }
          }),
        (o) => o.nom
      )
    case Pos.FrDpt:
      return sortBy(
        MetroCircFile.features
          .filter((feature) => feature.properties[Code.Dpt] === codes[Code.Dpt])
          .map((item) => {
            return {
              nom: getZoneName(item),
              url: `france/${slugify(item.properties.nom_reg)}/${slugify(item.properties.nom_dpt)}/${item.properties[Code.Circ]}`,
            }
          }),
        (o) => o.nom
      )
    case Pos.OMDpt:
      return sortBy(
        OMCircFile.features
          .filter((feature) => feature.properties[Code.Dpt] === codes[Code.Dpt])
          .map((item) => {
            return {
              nom: getZoneName(item),
              url: `om/${slugify(item.properties.nom_dpt)}/${item.properties[Code.Circ]}`,
            }
          }),
        (o) => o.nom
      )
    default:
      return []
  }
}

/**
 * Renvoie le breadcrumb entier
 * @param {AugoraMap.Feature} feature L'object feature dans lequel on se situe
 */
export const getBreadcrumb = (feature: AugoraMap.Feature): AugoraMap.Breadcrumb[] => {
  const monde: AugoraMap.Breadcrumb = { url: "monde", nom: "Monde", children: getBreadcrumbChildren({ code_cont: 1 }) }
  const france: AugoraMap.Breadcrumb = {
    url: "france",
    nom: "France Métropolitaine",
    children: getBreadcrumbChildren({ code_cont: 0 }),
  }
  const props = feature?.properties

  switch (getPosition(feature)) {
    case Pos.FrReg:
      return [
        monde,
        france,
        { url: `france/${slugify(props.nom)}`, nom: props.nom, children: getBreadcrumbChildren({ code_reg: props[Code.Reg] }) },
      ]
    case Pos.FrDpt:
      return [
        monde,
        france,
        {
          url: `france/${slugify(props.nom_reg)}`,
          nom: props.nom_reg,
          children: getBreadcrumbChildren({ code_reg: props[Code.Reg] }),
        },
        {
          url: `france/${slugify(props.nom_reg)}/${slugify(props.nom)}`,
          nom: `${props.nom} (${props[Code.Dpt]})`,
          children: getBreadcrumbChildren({ code_dpt: props[Code.Dpt] }),
        },
      ]
    case Pos.FrCirc:
      return [
        monde,
        france,
        {
          url: `france/${slugify(props.nom_reg)}`,
          nom: props.nom_reg,
          children: getBreadcrumbChildren({ code_reg: props[Code.Reg] }),
        },
        {
          url: `france/${slugify(props.nom_reg)}/${slugify(props.nom_dpt)}`,
          nom: `${props.nom_dpt} (${props[Code.Dpt]})`,
          children: getBreadcrumbChildren({ code_dpt: props[Code.Dpt] }),
        },
        {
          url: `france/${slugify(props.nom_reg)}/${slugify(props.nom_dpt)}/${props.code_circ}`,
          nom: getZoneName(feature),
        },
      ]
    case Pos.OMDpt:
      return [
        monde,
        { url: `om/${slugify(props.nom)}`, nom: props.nom, children: getBreadcrumbChildren({ code_dpt: props[Code.Dpt] }) },
      ]
    case Pos.OMCirc:
      return [
        monde,
        {
          url: `om/${slugify(props.nom_dpt)}`,
          nom: `${props.nom_dpt} (${props[Code.Dpt]})`,
          children: getBreadcrumbChildren({ code_dpt: props[Code.Dpt] }),
        },
        {
          url: `om/${slugify(props.nom_dpt)}/${props.code_circ}`,
          nom: getZoneName(feature),
        },
      ]
    case Pos.WCirc:
      return [monde, { url: `monde/${props.code_circ}}`, nom: getZoneName(feature) }]
    case Pos.France:
      return [monde, france]
    case Pos.World:
      return [monde]
    default:
      return []
  }
}
