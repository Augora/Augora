import create, { State } from "zustand"
import { ViewportProps } from "react-map-gl"
import { createFeature, createFeatureCollection, France, getLayerPaint } from "src/components/maps/maps-utils"

interface MapView {
  /** Feature collection des zones affichées. Exemple: en vue Occitanie, tous ses départements */
  geoJSON: AugoraMap.FeatureCollection
  /** Feature contenant toutes les zones. */
  feature: AugoraMap.Feature
  /** Objet paint pour les layers. Utilisé pour avoir une couleur dynamique */
  paint: {
    fill: mapboxgl.FillPaint
    line: mapboxgl.LinePaint
  }
  /** Feature collection des zones estompées voisines */
  ghostGeoJSON?: AugoraMap.FeatureCollection
}

interface MapState extends State, MapView {
  viewport: ViewportProps
  codes: AugoraMap.Codes
  /** Liste des députés de l'ensemble des zones */
  deputies: Deputy.DeputiesList
  setViewport(newViewport: ViewportProps): void
  setMapView(newMapView: MapView): void
  setDeputies(newDeputies: Deputy.DeputiesList): void
  setCodes(newCodes: AugoraMap.Codes): void
}

const mapStore = create<MapState>((set) => ({
  viewport: {
    zoom: 5,
    longitude: France.center.lng,
    latitude: France.center.lat,
  },
  geoJSON: createFeatureCollection(),
  ghostGeoJSON: null,
  feature: createFeature(),
  deputies: [],
  paint: getLayerPaint(),
  codes: {},

  setViewport(newViewport: ViewportProps) {
    set(() => {
      return { viewport: newViewport }
    })
  },

  setMapView(newMapView: MapView) {
    set(() => {
      return newMapView.ghostGeoJSON ? { ...newMapView } : { ...newMapView, ghostGeoJSON: null }
    })
  },

  setDeputies(newDeputies: Deputy.DeputiesList) {
    set(() => {
      return { deputies: newDeputies }
    })
  },

  setCodes(newCodes: AugoraMap.Codes) {
    set(() => {
      return { codes: newCodes }
    })
  },
}))

export default mapStore
