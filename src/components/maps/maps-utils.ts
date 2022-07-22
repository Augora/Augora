import { LayerProps, MapRef } from "react-map-gl"
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

/** Traduction FR de l'interface mapbox */
export const localeFR = {
  // "AttributionControl.ToggleAttribution": "Toggle attribution",
  "AttributionControl.MapFeedback": "Retours sur la map",
  "FullscreenControl.Enter": "Entrer en plein écran",
  "FullscreenControl.Exit": "Sortir du plein écran",
  "GeolocateControl.FindMyLocation": "Me géolocaliser",
  "GeolocateControl.LocationNotAvailable": "Géolocalisation indisponible",
  "LogoControl.Title": "Logo Mapbox ",
  // "NavigationControl.ResetBearing": "Reset bearing to north",
  "NavigationControl.ZoomIn": "Zoomer",
  "NavigationControl.ZoomOut": "Dézoomer",
  "ScaleControl.Feet": "pieds",
  "ScaleControl.Meters": "m",
  "ScaleControl.Kilometers": "km",
  "ScaleControl.Miles": "miles",
  "ScaleControl.NauticalMiles": "nm",
  "ScrollZoomBlocker.CtrlMessage": "Utilisez control + molette pour zoomer la carte",
  "ScrollZoomBlocker.CmdMessage": "Utilisez ⌘ + molette pour zoomer la carte",
  "TouchPanBlocker.Message": "Utilisez deux doigts pour bouger la carte",
}

/**
 * Renvoie une feature augoramap
 * @param {AugoraMap.Properties} [opts.props] Les properties
 * @param {AugoraMap.Properties} [opts.geometry] L'objet geometry
 */
export const createFeature = (opts?: { props?: AugoraMap.Properties; geometry?: AugoraMap.Geometry }): AugoraMap.Feature => {
  const { props, geometry } = opts || {}

  return {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [],
      ...geometry,
    },
    properties: props,
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

/** Bounding box de l'atlantique */
export const worldBox: AugoraMap.Bounds = [
  [-111.005859, -28.381735],
  [81.914063, 59.800634],
]

/**
 * Renvoie un objet paint pour les layers
 * @param {string} [opts.color] Pour renseigner une couleur dynamiquement
 * @param {boolean} [opts.ghost] Si c'est la layer ghost
 */
export const getLayerPaint = (opts?: {
  color?: string
  ghost?: boolean
}): {
  fill: mapboxgl.FillPaint
  line: mapboxgl.LinePaint
} => {
  const { color, ghost } = opts || {}

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
      "line-opacity": ghost ? 0.2 : 1,
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
  if (feature && mapRef) {
    const bounds: AugoraMap.Bounds = feature?.properties?.bbox ? feature.properties.bbox : worldBox

    const { longitude, latitude, zoom } = new WebMercatorViewport({
      width: mapRef.getContainer().getBoundingClientRect().width,
      height: mapRef.getContainer().getBoundingClientRect().height,
    }).fitBounds(bounds, {
      padding: isMobile ? 20 : 80,
    })

    flyToCoords(mapRef, [longitude, latitude], { zoom: zoom })
  }
}

/**
 * Transitionne de façon fluide vers des coordonnées
 * @param {mapRef} mapRef Pointeur vers l'objet map
 * @param {AugoraMap.Coordinates} coords Format [longitude, latitude]
 * @param {number} [opts.zoom] Default 1
 * @param {number} [opts.duration] Pour renseigner une durée fixe, par défaut entre 1 et 3 secondes selon la distance
 */
export const flyToCoords = (mapRef: MapRef, coords: AugoraMap.Coordinates, opts?: { zoom?: number; duration?: number }): void => {
  const distance = getDistance(mapRef.getCenter().toArray() as AugoraMap.Coordinates, coords)
  const dynDuration = distance < 750 ? 1000 : distance > 3000 ? 3000 : distance
  const { zoom = 1, duration = dynDuration } = opts || {}

  mapRef.flyTo({
    center: [coords[0], coords[1]],
    zoom: zoom,
    easing: (x) => -(Math.cos(Math.PI * x) - 1) / 2,
    duration: duration,
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

/** Renvoie la position d'une zone qui devrait être affiché selon une liste de de codes
 * @param codes Contient cont, reg, dpt, circ
 */
export const getPosFromCodes = (codes: AugoraMap.Codes): Pos => {
  if (codes) {
    if (codes[Code.Circ]) {
      return codes[Code.Dpt] === "999" ? Pos.WCirc : codes[Code.Dpt] > 900 ? Pos.OMCirc : Pos.FrCirc
    } else if (codes[Code.Dpt]) {
      return codes[Code.Dpt] > 900 ? Pos.OMDpt : Pos.FrDpt
    } else if (codes[Code.Reg]) {
      return Pos.FrReg
    } else if (codes[Code.Cont] !== undefined) {
      return codes[Code.Cont] === 1 ? Pos.World : Pos.France
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
  const props = feature?.properties

  switch (getPosition(feature)) {
    case Pos.FrReg:
      return deputies.filter((deputy) => {
        return deputy.NumeroRegion == props[Code.Reg]
      })
    case Pos.OMDpt:
    case Pos.FrDpt:
      return deputies.filter((deputy) => {
        return deputy.NumeroDepartement == props[Code.Dpt]
      })
    case Pos.OMCirc:
    case Pos.FrCirc:
    case Pos.WCirc:
      const depute = deputies.find((deputy) => {
        return deputy.NumeroCirconscription == props[Code.Circ] && deputy.NumeroDepartement == props[Code.Dpt]
      })
      return depute !== undefined ? [depute] : []
    case Pos.France:
      return deputies.filter((deputy) => +deputy.NumeroDepartement < 900)
    case Pos.World:
      return deputies
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
 * Renvoie la position d'une route query de la map
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

/**
 * Renvoie la position d'une feature
 * @param {GeoJSON.Feature} feature
 */
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

/**
 * Renvoie l'URL feature fournie
 * @param {GeoJSON.Feature} feature
 */
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

/**
 * Renvoie l'URL parente de la feature fournie
 * @param {GeoJSON.Feature} feature
 */
export const getParentURL = <T extends GeoJSON.Feature>(feature: T): string => {
  switch (getPosition(feature)) {
    case Pos.FrReg:
      return "france"
    case Pos.FrDpt:
      return `france/${slugify(feature.properties.nom_reg)}`
    case Pos.FrCirc:
      return `france/${slugify(feature.properties.nom_reg)}/${slugify(feature.properties.nom_dpt)}`
    case Pos.OMCirc:
      return `om/${slugify(feature.properties.nom_dpt)}`
    case Pos.France:
    case Pos.OMDpt:
    case Pos.WCirc:
      return "monde"
    case Pos.World:
    default:
      return null
  }
}
