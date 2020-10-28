import { WebMercatorViewport, FlyToInterpolator } from "react-map-gl"
import polylabel from "polylabel"
import GEOJsonDistrictFile from "static/list-district.json"
import GEOJsonDptFile from "static/departements.json"
import GEOJsonRegFile from "static/regions.json"
import { cloneDeep, remove } from "lodash"

/**
 * Un enum pour simplifier visuellement les clés de numéro de zone de nos GeoJSON.
 *
 * Valeurs possibles: Cont (code_cont), Reg (code_reg), Dpt (code_dpt), ou Circ (num_circ)
 */
export enum Code {
  Cont = "code_cont",
  Reg = "code_reg",
  Dpt = "code_dpt",
  Circ = "num_circ",
}

/**
 * Un enum pour simplifier visuellement un code de Continent
 *
 * Valeurs possibles: France, OM (Outre-Mer), Hors (Etablis hors de france)
 */
export enum Cont {
  France,
  OM,
  Hors,
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
    file.features.filter((feature) => feature.properties[Code.Reg] > 10)
  )
}

/**
 * Renvoie une feature array de pseudo-départements DROM-COM
 */
const createDROMCOMDpts = (): AugoraMap.FeatureCollection => {
  const COMFeatures: AugoraMap.Feature[] = GEOJsonDistrictFile.features.filter(
    (feat) => feat.properties[Code.Dpt] > 900
  )

  let newFeatures: AugoraMap.Feature[] = []

  cloneDeep(COMFeatures).forEach((o) => {
    //il faire un cloneDeep sinon le fichier est modifié
    const otherOccurence = newFeatures.find(
      (entry) => entry.properties.code_dpt === o.properties.code_dpt
    )

    let protoFeature = createFeature(
      o.properties.nom_dpt,
      {
        code_dpt: o.properties.code_dpt,
      },
      o.geometry.type,
      o.geometry.coordinates
    )

    if (otherOccurence) {
      if (o.geometry.type === "MultiPolygon") {
        if (otherOccurence.geometry.type === "MultiPolygon") {
          protoFeature.geometry.coordinates = [
            ...otherOccurence.geometry.coordinates,
            ...o.geometry.coordinates,
          ]
        } else {
          protoFeature.geometry.coordinates = [
            ...o.geometry.coordinates,
            otherOccurence.geometry.coordinates,
          ]
        }
      } else {
        if (otherOccurence.geometry.type === "MultiPolygon") {
          protoFeature.geometry.coordinates = [
            o.geometry.coordinates,
            ...otherOccurence.geometry.coordinates,
          ]
          protoFeature.geometry.type = "MultiPolygon"
        } else {
          protoFeature.geometry.coordinates = [
            o.geometry.coordinates,
            otherOccurence.geometry.coordinates,
          ]
          protoFeature.geometry.type = "MultiPolygon"
        }
      }
      remove(newFeatures, (entry) => entry === otherOccurence)
    }
    newFeatures.push(protoFeature)
  })

  return createFeatureCollection(newFeatures)
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
export const OMGEOJsonDistrict: AugoraMap.FeatureCollection = createFeatureCollection(
  GEOJsonDistrictFile.features.filter(
    (feature) => feature.properties[Code.Dpt] > 900
  )
)

/**
 * Feature collection GeoJSON des départements / régions / collectivités DROM-COM
 */
export const OMGEOJsonDpt: AugoraMap.FeatureCollection = createDROMCOMDpts()

/**
 * Feature collection GeoJSON de tous les départements
 */
export const AllGEOJsonDpt: AugoraMap.FeatureCollection = createFeatureCollection(
  [...GEOJsonDpt.features, ...OMGEOJsonDpt.features]
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

export const OMBox: AugoraMap.Bounds = [
  [-111.005859, -28.381735],
  [81.914063, 59.800634],
]

/**
 * Pseudo-feature de la france metropolitaine
 */
export const metroFranceFeature: AugoraMap.Feature = createFeature(
  "France métropolitaine",
  { code_cont: Cont.France }
)

/**
 * Pseudo-feature des DROM-COM
 */
export const OMFeature: AugoraMap.Feature = createFeature("Outre-Mer", {
  code_cont: Cont.OM,
})

/**
 * Pseudo-feature des Français établis hors de France
 */
export const HorsFeature: AugoraMap.Feature = createFeature(
  "Français établis hors de France",
  { code_cont: Cont.Hors }
)

/**
 * Pseudo feature collection des continents
 */
export const GEOJsonCont: AugoraMap.FeatureCollection = createFeatureCollection(
  [metroFranceFeature, OMFeature]
)

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
  if (feature?.geometry?.type) {
    if (getZoneCode(feature) !== Code.Cont)
      return feature.geometry.type === "Polygon"
        ? getBoundingBoxFromCoordinates(feature.geometry.coordinates)
        : getBoundingBoxFromCoordinates(feature.geometry.coordinates, true)
    else if (getContinent(feature) === Cont.France) return franceBox
    else return OMBox
  } else return null
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
 * @param {*} viewState Le state du viewport
 * @param {React.Dispatch<React.SetStateAction<{}>>} setViewState Le setState du viewport
 */
export const flyToBounds = (
  feature: AugoraMap.Feature,
  viewState: any,
  setViewState: React.Dispatch<React.SetStateAction<{}>>
): void => {
  const bounds = new WebMercatorViewport(
    viewState
  ).fitBounds(getBoundingBoxFromFeature(feature), { padding: 100 })
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
      if (feature.properties[Code.Dpt] === undefined) return Cont.Hors
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
      return getFeature(
        featureProps[zoneCode],
        zoneCode,
        zoneCode === Code.Circ ? featureProps[Code.Dpt] : null
      )
    } else return null
  } else return null
}

/**
 * Renvoie la feature d'une zone
 * @param {number | string} zoneId L'id de la zone
 * @param {Code} Code Le code de la zone
 * @param {number} [dptID] L'id du département, obligatoire si c'est une circonscription
 */
export const getFeature = (
  zoneId: number | string,
  zoneCode: Code,
  dptId?: number
): AugoraMap.Feature => {
  switch (zoneCode) {
    case Code.Cont:
      return GEOJsonCont.features.find(
        (entry) => entry.properties[zoneCode] == zoneId
      )
    case Code.Reg:
      return GEOJsonReg.features.find(
        (entry) => entry.properties[zoneCode] == zoneId
      )
    case Code.Dpt:
      return AllGEOJsonDpt.features.find(
        (entry) => entry.properties[zoneCode] == zoneId
      )
    case Code.Circ:
      return GEOJsonDistrictFile.features.find(
        (entry) =>
          entry.properties[zoneCode] == zoneId &&
          entry.properties[Code.Dpt] == dptId
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

  switch (zoneCode) {
    case Code.Cont:
      if (feature.properties[zoneCode] === Cont.OM) return OMGEOJsonDpt
      else return GEOJsonReg
    case Code.Reg:
      return createFeatureCollection(
        GEOJsonDpt.features.filter(
          (element) =>
            element.properties[zoneCode] === feature.properties[zoneCode]
        )
      )
    case Code.Dpt:
      return createFeatureCollection(
        GEOJsonDistrictFile.features.filter(
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
  const contId = getContinent(feature)

  switch (zoneCode) {
    case Code.Cont:
      return GEOJsonCont.features.filter(
        (entry) => entry.properties[zoneCode] !== props[zoneCode]
      )
    case Code.Reg:
      return GEOJsonReg.features.filter(
        (entry) => entry.properties[zoneCode] !== props[zoneCode]
      )
    case Code.Dpt:
      return contId === Cont.France
        ? GEOJsonDpt.features.filter(
            (entry) =>
              entry.properties[zoneCode] !== props[zoneCode] &&
              entry.properties[Code.Reg] === props[Code.Reg]
          )
        : OMGEOJsonDpt.features.filter(
            (entry) => entry.properties[zoneCode] !== props[zoneCode]
          )
    case Code.Circ:
      return GEOJsonDistrictFile.features.filter(
        (entry) =>
          entry.properties[zoneCode] !== props[zoneCode] &&
          entry.properties[Code.Dpt] === props[Code.Dpt]
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
  const contId = getContinent(feature)

  if (zoneCode === Code.Reg || Code.Dpt) {
    const Registers = getSisterFeatures(
      getFeature(feature.properties[Code.Reg], Code.Reg)
    )
    if (zoneCode === Code.Reg) return createFeatureCollection(Registers)
    else {
      const dptSisters = getSisterFeatures(feature)
      return contId === Cont.France
        ? createFeatureCollection([...Registers, ...dptSisters])
        : createFeatureCollection(dptSisters)
    }
  } else return createFeatureCollection()
}

/**
 * Renvoie un array de députés dans une zone, une array avec un seul élément si la zone est une circonscription, ou une array vide si aucun député trouvé
 * @param {AugoraMap.Feature} feature La feature à analyser
 * @param {AugoraMap.DeputiesList} list La liste de députés à filtrer
 */
export const getDeputies = (
  feature: AugoraMap.Feature,
  list: AugoraMap.DeputiesList
): AugoraMap.DeputiesList => {
  const zoneCode = getZoneCode(feature)

  switch (zoneCode) {
    case Code.Cont:
      return list.filter((i) => {
        return feature.properties[zoneCode] === Cont.OM
          ? parseInt(i.NumeroDepartement) > 900
          : parseInt(i.NumeroDepartement) < 900
      })
    case Code.Reg:
      return list.filter((i) => {
        return i.NumeroRegion == feature.properties[Code.Reg]
      })
    case Code.Dpt:
      return list.filter((i) => {
        return i.NumeroDepartement == feature.properties[Code.Dpt]
      })
    case Code.Circ:
      return [
        list.find((i) => {
          return (
            i.NumeroCirconscription == feature.properties[Code.Circ] &&
            i.NumeroDepartement == feature.properties[Code.Dpt]
          )
        }),
      ]
    default:
      return []
  }
}
