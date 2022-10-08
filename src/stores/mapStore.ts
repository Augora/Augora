import create, { State } from "zustand"
import { ViewState } from "react-map-gl"
import { createFeature, createFeatureCollection, France, getLayerPaint } from "src/components/maps/maps-utils"

interface MapState extends State {
  /** La hauteur & largeur en pixel du viewport */
  viewsize: { height: number; width: number }
  viewstate: ViewState
  /** Si on affiche la zone en dézoomé avec un pin */
  overview: boolean
  setViewsize(newViewsize: { height: number; width: number }): void
  setViewstate(newViewstate: ViewState): void
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

  setOverview(value: boolean) {
    set(() => {
      return { overview: value }
    })
  },
}))

export default mapStore
