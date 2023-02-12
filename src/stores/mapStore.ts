import { create } from "zustand"
import { ViewState } from "react-map-gl"
import { createFeature, createFeatureCollection, France, getLayerPaint } from "src/components/maps/maps-utils"

interface MapState extends AugoraMap.MapView {
  /** La hauteur & largeur en pixel du viewport */
  viewsize: { height: number; width: number }
  viewstate: ViewState
  /** Liste des députés de l'ensemble des zones */
  deputies: Deputy.DeputiesList
  /** Si on affiche la zone en dézoomé avec un pin */
  overview: boolean
  setViewsize(newViewsize: { height: number; width: number }): void
  setViewstate(newViewstate: ViewState): void
  setMapView(newMapView: AugoraMap.MapView): void
  setDeputies(newDeputies: Deputy.DeputiesList): void
  setOverview(value: boolean): void
}

const mapStore = create<MapState>((set) => ({
  viewsize: {
    height: 100,
    width: 100,
  },
  viewstate: {
    zoom: 3,
    longitude: France.center.lng,
    latitude: France.center.lat,
    bearing: 0,
    pitch: 0,
    padding: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
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

  setViewstate(newViewstate: ViewState) {
    set(() => {
      return { viewstate: newViewstate }
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
