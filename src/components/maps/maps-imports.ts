/**
 * @file Fichier pour importer les données geoJSON pour la map, éviter de l'utiliser en dehors de génération statique au risque d'avoir un temps de chargement très long
 */
import {
  Code,
  Pos,
  createFeature,
  createFeatureCollection,
  getPositionFromRoute,
  getPosition,
  getPosFromCodes,
  getZoneName,
  getCodesFromFeature,
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
        {
          feature: createFeature({ props: MetroFranceContFile.features[0].properties }),
          children: getBreadcrumbChildren({ code_cont: 0 }),
        },
        ...OMDptFile.features.map((item) => {
          return {
            feature: createFeature({ props: item.properties }),
            children: getBreadcrumbChildren(getCodesFromFeature(item)),
          }
        }),
      ]
    case Pos.France:
      return MetroRegFile.features.map((item) => {
        return {
          feature: createFeature({ props: item.properties }),
          children: getBreadcrumbChildren(getCodesFromFeature(item)),
        }
      })
    case Pos.FrReg:
      return MetroDptFile.features
        .filter((item) => item.properties[Code.Reg] === codes[Code.Reg])
        .map((item) => {
          return {
            feature: createFeature({ props: item.properties }),
            children: getBreadcrumbChildren(getCodesFromFeature(item)),
          }
        })
    case Pos.FrDpt:
      return MetroCircFile.features
        .filter((item) => item.properties[Code.Dpt] === codes[Code.Dpt])
        .map((item) => {
          return {
            feature: createFeature({ props: item.properties }),
          }
        })
    case Pos.OMDpt:
      return OMCircFile.features
        .filter((item) => item.properties[Code.Dpt] === codes[Code.Dpt])
        .map((item) => {
          return {
            feature: createFeature({ props: item.properties }),
          }
        })
    default:
      return []
  }
}

/**
 * Renvoie le breadcrumb entier pour génération statique
 * @param feature L'endroit où on se trouve
 */
export const getBreadcrumb = (feature: AugoraMap.Feature): AugoraMap.Breadcrumb[] => {
  const monde: AugoraMap.Breadcrumb = { feature: WorldFeature, children: getBreadcrumbChildren({ code_cont: 1 }) }
  const france: AugoraMap.Breadcrumb = {
    feature: createFeature({ props: MetroFranceContFile.features[0].properties }),
    children: getBreadcrumbChildren({ code_cont: 0 }),
  }
  const props = feature?.properties
  const codes = getCodesFromFeature(feature)

  switch (getPosition(feature)) {
    case Pos.FrReg:
      return [monde, france, { feature: createFeature({ props: props }), children: getBreadcrumbChildren(codes) }]
    case Pos.FrDpt:
      return [
        monde,
        france,
        {
          feature: createFeature({ props: getFeature({ [Code.Reg]: props[Code.Reg] }).properties }),
          children: getBreadcrumbChildren({ [Code.Reg]: props[Code.Reg] }),
        },
        {
          feature: createFeature({ props: props }),
          children: getBreadcrumbChildren(codes),
        },
      ]
    case Pos.FrCirc:
      return [
        monde,
        france,
        {
          feature: createFeature({ props: getFeature({ [Code.Reg]: props[Code.Reg] }).properties }),
          children: getBreadcrumbChildren({ [Code.Reg]: props[Code.Reg] }),
        },
        {
          feature: createFeature({ props: getFeature({ [Code.Dpt]: props[Code.Dpt] }).properties }),
          children: getBreadcrumbChildren({ [Code.Dpt]: props[Code.Dpt] }),
        },
        {
          feature: createFeature({ props: props }),
        },
      ]
    case Pos.OMDpt:
      return [
        monde,
        {
          feature: createFeature({ props: props }),
          children: getBreadcrumbChildren(codes),
        },
      ]
    case Pos.OMCirc:
      return [
        monde,
        {
          feature: createFeature({ props: getFeature({ [Code.Dpt]: props[Code.Dpt] }).properties }),
          children: getBreadcrumbChildren({ [Code.Dpt]: props[Code.Dpt] }),
        },
        {
          feature: createFeature({ props: props }),
          children: getBreadcrumbChildren(codes),
        },
      ]
    case Pos.WCirc:
      return [monde, { feature: createFeature({ props: props }) }]
    case Pos.France:
      return [monde, france]
    case Pos.World:
      return [monde]
    default:
      return []
  }
}
