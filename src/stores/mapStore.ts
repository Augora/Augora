import create, { State } from "zustand"
import { ViewportProps } from "react-map-gl"
import { createFeature, createFeatureCollection, France, getLayerPaint } from "src/components/maps/maps-utils"

interface MapState extends State, AugoraMap.MapView {
  viewport: ViewportProps
  /** Liste des députés de l'ensemble des zones */
  deputies: Deputy.DeputiesList
  setViewport(newViewport: ViewportProps): void
  setMapView(newMapView: AugoraMap.MapView): void
  setDeputies(newDeputies: Deputy.DeputiesList): void
}

const mapStore = create<MapState>((set) => ({
  viewport: {
    zoom: 5.5,
    longitude: France.center.lng,
    latitude: France.center.lat,
  },
  geoJSON: createFeatureCollection(),
  ghostGeoJSON: null,
  feature: createFeature(),
  deputies: [],
  paint: getLayerPaint(),

  setViewport(newViewport: ViewportProps) {
    set(() => {
      return { viewport: newViewport }
    })
  },

  setMapView(newMapView: AugoraMap.MapView) {
    set(() => {
      return newMapView.ghostGeoJSON ? { ...newMapView } : { ...newMapView, ghostGeoJSON: null }
    })
  },

  setDeputies(newDeputies: Deputy.DeputiesList) {
    set(() => {
      return { deputies: newDeputies }
    })
  },
}))

export default mapStore
