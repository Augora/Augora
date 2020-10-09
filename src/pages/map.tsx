import React, { useState, useContext } from "react"
import ReactMapGL, {
  NavigationControl,
  FullscreenControl,
  Source,
  Layer,
  Marker,
  ViewState,
} from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import {
  ZoneCode,
  FranceZoneFeatureCollection,
  France,
  franceBox,
  GEOJsonReg,
  flyToBounds,
  getBoundingBoxFromPolygon,
  filterNewGEOJSonFeatureCollection,
  getZonePolygon,
  getZoneCodeFromFeatureProperties,
  getGEOJsonFile,
} from "../components/maps/maps-utils"
import ResetControl from "../components/maps/ResetControl"
import Tooltip from "../components/tooltip/Tooltip"
import { DeputiesListContext } from "../context/deputies-filters/deputiesFiltersContext"

interface IHoverInfo {
  filter: any[]
  lngLat: [number, number]
  zoneName: string
  nbDeputes: number
}

const fillLayerLayout = {
  type: "fill",
  paint: {
    "fill-color": "#fff",
    "fill-opacity": 0.3,
  },
}

const lineLayerLayout = {
  type: "line",
  paint: {
    "line-color": "#4d4d4d",
    "line-width": 1,
    // "line-dasharray": [4, 2],
  },
}

const hoverLayerLayout = {
  type: "fill",
  paint: {
    "fill-color": "#14ccae",
    "fill-opacity": 0.5,
  },
}

/**
 * Returns the zone id of a mouseevent
 */
const getMouseEventZoneId = (e): number => {
  if (e.features) {
    const currentZoneCode = getZoneCodeFromFeatureProperties(
      e.features[0]?.properties
    )
    if (currentZoneCode) {
      const zoneId = e.features[0].properties[currentZoneCode] as number
      return zoneId
    } else return null
  } else return null
}

export default function MapPage() {
  const [viewport, setViewport] = useState<ViewState>({
    zoom: 2,
    longitude: France.center.lng,
    latitude: France.center.lat,
  })
  const [currentGEOJson, setCurrentGEOJson] = useState<
    FranceZoneFeatureCollection
  >(GEOJsonReg)
  const [hoverInfo, setHoverInfo] = useState<IHoverInfo>({
    filter: ["==", ["get", ""], 0],
    lngLat: null,
    zoneName: null,
    nbDeputes: null,
  })
  const { state } = useContext(DeputiesListContext)

  const getCurrentZoneCode = (): ZoneCode => {
    return getZoneCodeFromFeatureProperties(
      currentGEOJson.features[0].properties
    )
  }

  const resetFilter = () => {
    setHoverInfo({
      filter: ["==", ["get", ""], 0],
      lngLat: null,
      zoneName: null,
      nbDeputes: null,
    })
  }

  /**
   * Affiche une nouvelle vue
   * @param {ZoneCode} zonesToDisplayCode Le code du groupe de zones à afficher
   * @param {number} zonesToDisplayCommonId L'id qu'ils ont en commun (si ce sont des départements, leur région id, si ce sont des circonscriptions, leur département id)
   */
  const displayNewZone = (
    zonesToDisplayCode: ZoneCode,
    zonesToDisplayCommonId: number
  ) => {
    const parentZoneCode =
      zonesToDisplayCode === ZoneCode.Circonscriptions
        ? ZoneCode.Departements
        : ZoneCode.Regions

    const newZoneGEOJson = filterNewGEOJSonFeatureCollection(
      getGEOJsonFile(zonesToDisplayCode),
      parentZoneCode,
      zonesToDisplayCommonId
    )

    const newZonePolygon = getZonePolygon(
      getGEOJsonFile(parentZoneCode),
      parentZoneCode,
      zonesToDisplayCommonId
    )

    setCurrentGEOJson(newZoneGEOJson)
    flyToBounds(
      getBoundingBoxFromPolygon(newZonePolygon),
      viewport,
      setViewport
    )
    resetFilter()
  }

  const getNbDeputesInZone = (zoneCode: ZoneCode, zoneId: number): number => {
    switch (zoneCode) {
      case ZoneCode.Regions:
        return state.FilteredList.filter((i) => {
          return i.NumeroRegion == zoneId
        }).length
      case ZoneCode.Departements:
        return state.FilteredList.filter((i) => {
          return i.NumeroDepartement == zoneId
        }).length
      default:
        return 1
    }
  }

  const handleHover = (e) => {
    const hoveredZoneId = getMouseEventZoneId(e)
    if (hoveredZoneId) {
      const featureProps = e.features[0].properties
      const currentZoneCode = getCurrentZoneCode()
      setHoverInfo({
        filter: ["==", ["get", currentZoneCode], hoveredZoneId],
        lngLat: e.lngLat,
        zoneName: featureProps.nom
          ? featureProps.nom
          : `Circonscription n°${featureProps.num_circ}`,
        nbDeputes: getNbDeputesInZone(currentZoneCode, hoveredZoneId),
      })
    } else if (hoverInfo.filter !== ["==", ["get", ""], 0]) {
      resetFilter()
    }
  }

  const handleClick = (e) => {
    const clickedZoneId = getMouseEventZoneId(e)
    if (clickedZoneId) {
      const currentZoneCode = getCurrentZoneCode()
      //ne rien faire si on est en vue circ (pour l'instant en tout cas)
      if (currentZoneCode === ZoneCode.Regions) {
        displayNewZone(ZoneCode.Departements, clickedZoneId)
      } else if (currentZoneCode === ZoneCode.Departements) {
        displayNewZone(ZoneCode.Circonscriptions, clickedZoneId)
      }
    }
  }

  const handleBack = () => {
    const currentZoneCode = getCurrentZoneCode()

    if (currentZoneCode === ZoneCode.Circonscriptions) {
      const regionId = currentGEOJson.features[0].properties[
        ZoneCode.Regions
      ] as number
      displayNewZone(ZoneCode.Departements, regionId)
    } else if (currentZoneCode === ZoneCode.Departements) {
      handleReset()
    }
  }

  const handleReset = () => {
    setCurrentGEOJson(GEOJsonReg)
    flyToBounds(franceBox, viewport, setViewport)
  }

  return (
    <>
      <div className="page page__map">
        <div className="map__container">
          <ReactMapGL
            mapboxApiAccessToken="pk.eyJ1Ijoia29iYXJ1IiwiYSI6ImNrMXBhdnV6YjBwcWkzbnJ5NDd5NXpja2sifQ.vvykENe0q1tLZ7G476OC2A"
            mapStyle="mapbox://styles/mapbox/streets-v11?optimize=true"
            {...viewport}
            width="100%"
            height="100%"
            minZoom={2}
            dragRotate={false}
            doubleClickZoom={false}
            touchRotate={false}
            interactiveLayerIds={["zone-fill", "zone-line"]}
            onLoad={() => {
              flyToBounds(franceBox, viewport, setViewport)
            }}
            onViewportChange={(change) => setViewport(change)}
            onHover={handleHover}
            onClick={handleClick}
          >
            <Source type="geojson" data={currentGEOJson}>
              <Layer
                id="zone-fill-hovered"
                {...hoverLayerLayout}
                filter={hoverInfo.filter}
              />
              <Layer id="zone-fill" {...fillLayerLayout} />
              <Layer id="zone-line" {...lineLayerLayout} />
            </Source>
            {hoverInfo.zoneName ? (
              <Marker
                longitude={hoverInfo.lngLat[0]}
                latitude={hoverInfo.lngLat[1]}
                offsetTop={40}
              >
                <Tooltip
                  title={hoverInfo.zoneName}
                  nbDeputes={hoverInfo.nbDeputes}
                  totalDeputes={state.FilteredList.length}
                />
              </Marker>
            ) : null}
            <div className="map__navigation">
              <NavigationControl
                showCompass={false}
                zoomInLabel="Zoomer"
                zoomOutLabel="Dézoomer"
              />
              <FullscreenControl />
              <ResetControl
                onReset={handleReset}
                className={`map__navigation-reset visible`}
                title="Revenir à la position initiale"
              />
            </div>
            <button
              style={{
                position: "absolute",
                left: "10px",
                top: "10px",
                minHeight: "30px",
              }}
              onClick={handleBack}
            >
              Précedent
            </button>
          </ReactMapGL>
        </div>
      </div>
    </>
  )
}
