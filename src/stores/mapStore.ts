import create, { State } from "zustand"
import { ViewportProps } from "react-map-gl"
import { createFeature, createFeatureCollection, France, getLayerPaint } from "src/components/maps/maps-utils"

interface MapView {
  /** Feature collection des zones principales */
  geoJSON: AugoraMap.FeatureCollection
  /** Feature contenant toutes les zones. Exemple: si on est en vue Pyrénées-Orientales, ce sera l'Occitanie */
  feature: AugoraMap.Feature
  /** Liste des députés de l'ensemble des zones */
  deputies: Deputy.DeputiesList
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
  setViewport(newViewport: ViewportProps): void
  setMapView(newMapView: MapView): void
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

  setCodes(newCodes: AugoraMap.Codes) {
    set(() => {
      return { codes: newCodes }
    })
  },
}))

export default mapStore
