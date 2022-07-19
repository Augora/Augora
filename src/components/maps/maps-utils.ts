import { MapRef } from "react-map-gl"
import { WebMercatorViewport } from "@math.gl/web-mercator"
import polylabel from "polylabel"
import pointInPolygon from "point-in-polygon"
import { slugify } from "utils/utils"

/**
 * Un enum pour simplifier visuellement les clés de numéro de zone de nos GeoJSON.
 *
 * Valeurs possibles: Cont (code_cont), Reg (code_reg), Dpt (code_dpt), ou Circ (code_circ)
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
 * Un enum pour identifier la position sur la map
 */
export enum Pos {
  France,
  World,
  /** Circonscription hors de france */
  WCirc,
  /** Circonscription outre-mer */
  OMCirc,
  /** Circonscription metropole */
  FrCirc,
  /** Département outre-mer */
  OMDpt,
  /** Département metropole */
  FrDpt,
  /** Région metropole */
  FrReg,
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
 * Formate une feature array sous forme feature collection GeoJSON
 * @param {AugoraMap.Feature[]} featureArray La feature collection renvoyée sera vide sans cet argument
 */
export const createFeatureCollection = (featureArray?: AugoraMap.Feature[]): AugoraMap.FeatureCollection => {
  return {
    type: "FeatureCollection",
    features: featureArray ? featureArray : [],
  }
}

/** Différentes coordonnées de la france métropolitaine */
export const France = {
  center: { lng: 2.23, lat: 46.44 },
  northWest: { lng: -6.864165, lat: 50.839888 },
  southEast: { lng: 13.089067, lat: 41.284012 },
  southWest: { lng: -10, lat: 40.2 },
  northEast: { lng: 11, lat: 51.15 },
}

/** Bounding box de la france métropolitaine */
export const franceBox: AugoraMap.Bounds = [
  [-6.416016, 40.747257],
  [11.162109, 51.426614],
]

/**
 * Renvoie un objet paint pour les layers
 * @param color Pour renseigner une couleur dynamiquement
 * @param ghost Si c'est la layer ghost
 */
export const getLayerPaint = (
  color?: string,
  ghost?: boolean
): {
  fill: mapboxgl.FillPaint
  line: mapboxgl.LinePaint
} => {
  return {
    fill: {
      "fill-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        color ? color : "#14ccae",
        color ? color : "#00bbcc",
      ],
      "fill-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.3, ghost ? 0.04 : 0.1],
    },
    line: {
      "line-color": color ? color : "#00bbcc",
      "line-width": 1,
    },
  }
}

/** Renvoie la distance en km entre 2 coordonnées */
const getDistance = (coords1: AugoraMap.Coordinates, coords2: AugoraMap.Coordinates): number => {
  const R = 6371 // kilometres
  const φ1 = (coords1[1] * Math.PI) / 180 // φ, λ in radians
  const φ2 = (coords2[1] * Math.PI) / 180
  const Δφ = ((coords2[1] - coords1[1]) * Math.PI) / 180
  const Δλ = ((coords2[0] - coords1[0]) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return Math.round(R * c) // in kmetres
}

/**
 * Renvoie une bounding box utilisable par mapbox depuis un array GEOJson coordinates de type polygon ou multipolygon
 * @param {AugoraMap.Position} coordinates L'array de coordonnées GEOJson
 * @param {boolean} [multiPolygon] Mettre true si les coordonnées envoyées sont de type multipolygon
 */
export const getBoundingBoxFromCoordinates = (
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
 * Transitionne de façon fluide vers une bounding box
 * @param {AugoraMap.Feature} feature La feature vers laquelle aller, dézoom sur le monde si la feature n'a pas de propriété bbox
 * @param {mapRef} mapRef Pointeur vers l'objet map
 * @param {boolean} isMobile Pour réduire le padding
 */
export const flyToBounds = <T extends GeoJSON.Feature>(feature: T, mapRef: MapRef, isMobile?: boolean): void => {
  const bounds: AugoraMap.Bounds = feature.properties.bbox

  const { longitude, latitude, zoom } = new WebMercatorViewport({
    width: mapRef.getContainer().getBoundingClientRect().width,
    height: mapRef.getContainer().getBoundingClientRect().height,
  }).fitBounds(bounds, {
    padding: isMobile ? 20 : 80,
  })

  flyToCoords(mapRef, [longitude, latitude], zoom)
}

/**
 * Transitionne de façon fluide vers des coordonnées
 * @param {mapRef} mapRef Pointeur vers l'objet map
 * @param {AugoraMap.Coordinates} coords Format [longitude, latitude]
 * @param {number} [zoom] Default 1
 * @param {number} [duration] Pour renseigner une durée fixe, par défaut entre 1 et 3 secondes selon la distance
 */
export const flyToCoords = (mapRef: MapRef, coords: AugoraMap.Coordinates, zoom?: number, duration?: number): void => {
  const distance = getDistance(mapRef.getCenter().toArray() as AugoraMap.Coordinates, coords)
  const dynDuration = distance < 750 ? 1000 : distance > 3000 ? 3000 : distance

  mapRef.flyTo({
    center: [coords[0], coords[1]],
    zoom: zoom ? zoom : 1,
    easing: (x) => -(Math.cos(Math.PI * x) - 1) / 2,
    duration: duration ? duration : dynDuration,
  })
}

/**
 * Determine dans quelle vue la feature passée devrait être, renvoie null si la feature ne contient pas les infos nécéssaires
 * @param {AugoraMap.Feature} feature L'objet feature GeoJSON à analyser
 */
export const getZoneCode = <T extends GeoJSON.Feature>(feature: T): Code => {
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
 * Renvoie l'id du continent d'une feature
 * @param {AugoraMap.Feature} feature La feature à analyser
 */
export const getContinent = <T extends GeoJSON.Feature>(feature: T): Cont => {
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

/** Renvoie le code d'une zone qui devrait être affiché selon une liste de de codes
 * @param codes Contient cont, reg, dpt, circ
 */
export const getCodeFromCodes = (codes: AugoraMap.Codes): Code => {
  if (codes) {
    if (codes[Code.Circ]) {
      return Code.Circ
    } else if (codes[Code.Dpt]) {
      return Code.Dpt
    } else if (codes[Code.Reg]) {
      return Code.Reg
    } else if (codes[Code.Cont] !== undefined) {
      return Code.Cont
    } else return null
  } else return null
}

/**
 * Renvoie un objet codes selon les propriétés d'une feature, un objet vide si la feature est invalide
 * @param feature
 */
export const getCodesFromFeature = <T extends GeoJSON.Feature>(feature: T): AugoraMap.Codes => {
  const props = feature?.properties
  if (props) {
    const featureKeys = Object.keys(props)

    if (featureKeys.includes(Code.Circ)) return { [Code.Circ]: props[Code.Circ], [Code.Dpt]: props[Code.Dpt] }
    else if (featureKeys.includes(Code.Dpt)) return { [Code.Dpt]: props[Code.Dpt] }
    else if (featureKeys.includes(Code.Reg)) return { [Code.Reg]: props[Code.Reg] }
    else if (featureKeys.includes(Code.Cont)) return { [Code.Cont]: props[Code.Cont] }
    else return {}
  } else return {}
}

/**
 * Compare des features et renvoie true si elles ont les mêmes clés d'identification de nos geojson
 * @param {T} feature1
 * @param {U} feature2
 */
export const compareFeatures = <T extends GeoJSON.Feature, U extends GeoJSON.Feature>(feature1: T, feature2: U): boolean => {
  const zoneCode1 = getZoneCode(feature1)
  const zoneCode2 = getZoneCode(feature2)
  const props1 = feature1?.properties
  const props2 = feature2?.properties

  if (zoneCode1 && zoneCode2 && zoneCode1 === zoneCode2) {
    return zoneCode1 !== Code.Circ
      ? props1[zoneCode1] === props2[zoneCode1]
      : props1[zoneCode1] === props2[zoneCode1] && props1[Code.Dpt] === props2[Code.Dpt]
  } else return false
}

/**
 * Renvoie un array de députés dans une zone, une array avec un seul élément si la zone est une circonscription, ou une array vide si aucun député trouvé
 * @param {GeoJSON.Feature} feature La zone feature à analyser
 * @param {Deputy.DeputiesList} deputies La liste de députés à filtrer
 */
export const getDeputies = <T extends GeoJSON.Feature>(feature: T, deputies: Deputy.DeputiesList): Deputy.DeputiesList => {
  const zoneCode = getZoneCode(feature)
  const props = feature?.properties
  const contId = getContinent(feature)

  switch (zoneCode) {
    case Code.Cont:
      return contId === Cont.World
        ? deputies
        : deputies.filter((deputy) => {
            if (contId === Cont.OM) return parseInt(deputy.NumeroDepartement) > 900 && deputy.NumeroDepartement !== "999"
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
      const depute = deputies.find((deputy) => {
        return deputy.NumeroCirconscription == props[Code.Circ] && deputy.NumeroDepartement == props[Code.Dpt]
      })
      return depute !== undefined ? [depute] : []
    default:
      return []
  }
}

/** Renvoie le nom d'une feature pour le breadcrumb */
export const getZoneName = <T extends GeoJSON.Feature>(feature: T): string => {
  const code = getZoneCode(feature)

  switch (code) {
    case Code.Cont:
    case Code.Reg:
      return feature.properties.nom
    case Code.Dpt:
      return `${feature.properties.nom} (${feature.properties[Code.Dpt]})`
    case Code.Circ:
      return `${feature.properties[Code.Circ]}${feature.properties[Code.Circ] === 1 ? "ère" : "ème"} Circonscription`
    default:
      return ""
  }
}

/** Renvoie le nom d'une feature pour le titre de la page */
export const getZoneTitle = <T extends GeoJSON.Feature>(feature: T) => {
  const code = getZoneCode(feature)
  switch (code) {
    case Code.Cont:
    case Code.Reg:
    case Code.Dpt:
      return feature.properties.nom
    case Code.Circ:
      return `${feature.properties.nom_dpt} ${feature.properties[Code.Circ]}`
    default:
      return ""
  }
}

/** Renvoie l'URL map correspondant à une feature */
export const buildURLFromFeature = <T extends GeoJSON.Feature>(feature: T): string => {
  const props = feature?.properties
  if (props) {
    const featureKeys = Object.keys(props)

    if (featureKeys.includes(Code.Circ)) return `/carte?dpt=${props[Code.Dpt]}&circ=${props[Code.Circ]}`
    else if (featureKeys.includes(Code.Dpt)) return `/carte?dpt=${props[Code.Dpt]}`
    else if (featureKeys.includes(Code.Reg)) return `/carte?reg=${props[Code.Reg]}`
    else if (featureKeys.includes(Code.Cont)) return `/carte?cont=${props[Code.Cont]}`
    else return ""
  } else return ""
}

/** Cherche dans nos fichiers une feature aux coordonnées fournies */
export const geolocateFeature = (coords: AugoraMap.Coordinates, features: AugoraMap.FeatureCollection): AugoraMap.Feature => {
  const trimmedFeatures = features.features.filter((feature) => {
    const SW = feature.properties.bbox[0]
    const NE = feature.properties.bbox[1]

    return coords[0] > SW[0] && coords[0] < NE[0] && coords[1] > SW[1] && coords[1] < NE[1]
  }) //préfiltre les features avec la bounding box, moins couteux en calcul

  if (trimmedFeatures.length > 1) {
    return trimmedFeatures.find((feature) => {
      if (feature.geometry.type === "Polygon") {
        return pointInPolygon(coords, feature.geometry.coordinates[0])
      } else if (feature.geometry.type === "MultiPolygon") {
        return feature.geometry.coordinates.find((polygon) => pointInPolygon(coords, polygon[0])) !== undefined
      }
    })
  } else if (trimmedFeatures.length === 1) return trimmedFeatures[0]
  else return undefined
}

/**
 * Requete les features d'une recherche à l'API mapbox
 * @param {string} token Le mapbox token, obligatoire pour contacter l'API
 */
export async function searchMapboxAPI(search: string, token: string): Promise<AugoraMap.MapboxAPIFeatureCollection> {
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${search}.json?language=fr&limit=10&proximity=2.2137,46.2276&access_token=${token}`
  )
  const data: AugoraMap.MapboxAPIFeatureCollection = await response.json()

  return data
}

/**
 * Renvoie la position d'une URL de la map
 * @param {string} route
 */
export const getPositionFromRoute = (route: string[]): Pos => {
  if (route) {
    switch (route[0]) {
      case "france":
        if (route.length <= 1) return Pos.France
        else if (route.length === 2) return Pos.FrReg
        else if (route.length === 3) return Pos.FrDpt
        else return Pos.FrCirc
      case "om":
        if (route.length <= 1) return null
        else if (route.length === 2) return Pos.OMDpt
        else return Pos.OMCirc
      case "monde":
        if (route.length <= 1) return Pos.World
        else return Pos.WCirc
      default:
        return null
    }
  } else return null
}

export const getPosition = <T extends GeoJSON.Feature>(feature: T): Pos => {
  if (feature?.properties) {
    const featureKeys = Object.keys(feature.properties)

    if (featureKeys.includes("code_circ")) {
      if (feature.properties.code_dpt.length > 2) {
        if (feature.properties.code_dpt === "999") return Pos.WCirc
        else return Pos.OMCirc
      } else return Pos.FrCirc
    } else if (featureKeys.includes("code_dpt")) {
      if (feature.properties.code_dpt.length > 2) return Pos.OMDpt
      else return Pos.FrDpt
    } else if (featureKeys.includes("code_reg")) return Pos.FrReg
    else if (featureKeys.includes("code_cont")) {
      if (feature.properties.code_cont === 0) return Pos.France
      else if (feature.properties.code_cont === 1) return Pos.World
    } else return null
  } else return null
}

export const getFeatureURL = <T extends GeoJSON.Feature>(feature: T): string => {
  switch (getPosition(feature)) {
    case Pos.France:
      return "france"
    case Pos.FrReg:
      return `france/${slugify(feature.properties.nom)}`
    case Pos.FrDpt:
      return `france/${slugify(feature.properties.nom_reg)}/${slugify(feature.properties.nom)}`
    case Pos.FrCirc:
      return `france/${slugify(feature.properties.nom_reg)}/${slugify(feature.properties.nom_dpt)}/${
        feature.properties.code_circ
      }`
    case Pos.OMDpt:
      return `om/${slugify(feature.properties.nom)}`
    case Pos.OMCirc:
      return `om/${slugify(feature.properties.nom_dpt)}/${feature.properties.code_circ}`
    case Pos.World:
      return "monde"
    case Pos.WCirc:
      return `monde/${slugify(feature.properties.code_circ)}`
    default:
      return null
  }
}
