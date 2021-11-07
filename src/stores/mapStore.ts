import create, { State } from "zustand"
import { ViewportProps } from "react-map-gl"
import { createFeature, createFeatureCollection, France, getLayerPaint } from "src/components/maps/maps-utils"

interface MapState extends State, AugoraMap.MapView {
  /** La hauteur & largeur en pixel du viewport */
  viewsize: { height: number; width: number }
  viewport: ViewportProps
  /** Liste des députés de l'ensemble des zones */
  deputies: Deputy.DeputiesList
  /** Si on affiche la zone en dézoomé avec un pin */
  overview: boolean
  setViewsize(newViewsize: { height: number; width: number }): void
  setViewport(newViewport: ViewportProps): void
  setMapView(newMapView: AugoraMap.MapView): void
  setDeputies(newDeputies: Deputy.DeputiesList): void
  setOverview(value: boolean): void
}

const mapStore = create<MapState>((set) => ({
  viewsize: {
    height: 100,
    width: 100,
  },
  viewport: {
    zoom: 3,
    longitude: France.center.lng,
    latitude: France.center.lat,
  },
  overview: false,
  geoJSON: createFeatureCollection(),
  ghostGeoJSON: null,
  feature: createFeature("Empty"),
  deputies: [],
  paint: getLayerPaint(),

  setViewsize(newViewsize: { height: number; width: number }) {
    set(() => {
      return { viewsize: { ...newViewsize } }
    })
  },

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

  setOverview(value: boolean) {
    set(() => {
      return { overview: value }
    })
  },
}))

export default mapStore
