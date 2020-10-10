import React, { useState, useContext } from "react"
import ReactMapGL, {
  NavigationControl,
  FullscreenControl,
  Source,
  Layer,
  ViewState,
} from "react-map-gl"
import { navigate } from "gatsby"
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
  getMouseEventFeatureProps,
} from "../components/maps/maps-utils"
import ResetControl from "../components/maps/ResetControl"
import MapTooltip from "../components/maps/MapTooltip"
import { DeputiesListContext } from "../context/deputies-filters/deputiesFiltersContext"

interface IHoverInfo {
  filter: any[]
  lngLat: [number, number]
  zoneName: string
  deputiesInZone: any[]
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
 * Returns formatted mouse event object
 */
const formatMouseEvent = (
  e
): {
  zoneId: number
  zoneCode: ZoneCode
  parentZoneId: number
  allProps: GeoJSON.GeoJsonProperties
} => {
  const featureProps = getMouseEventFeatureProps(e)
  if (featureProps) {
    const currentZoneCode = getZoneCodeFromFeatureProperties(featureProps)
    var parentZoneId

    switch (currentZoneCode) {
      case ZoneCode.Departements:
        parentZoneId = featureProps[ZoneCode.Regions] as number
        break
      case ZoneCode.Circonscriptions:
        parentZoneId = featureProps[ZoneCode.Departements] as number
        break
      default:
        parentZoneId = null
        break
    }

    return {
      zoneId: featureProps[currentZoneCode] as number,
      zoneCode: currentZoneCode,
      parentZoneId: parentZoneId,
      allProps: featureProps,
    }
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
    deputiesInZone: null,
  })
  const { state } = useContext(DeputiesListContext)

  const getCurrentZoneCode = (): ZoneCode => {
    return getZoneCodeFromFeatureProperties(
      currentGEOJson.features[0].properties
    )
  }

  const resetHoverInfo = () => {
    setHoverInfo({
      filter: ["==", ["get", ""], 0],
      lngLat: null,
      zoneName: null,
      deputiesInZone: null,
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
    resetHoverInfo()
  }

  /**
   * Renvoie un array contenant tous les députés de la zone et leurs infos
   * @param {ZoneCode} zoneCode Le code de la zone
   * @param {number} zoneId L'id de la zone
   * @param {number} [parentZoneId] L'id de la zone parente, nécéssaire quand la zone ciblée est une circonscription
   */
  const getDeputiesInZone = (
    zoneCode: ZoneCode,
    zoneId: number,
    parentZoneId?: number
  ): any[] => {
    switch (zoneCode) {
      case ZoneCode.Regions:
        return state.FilteredList.filter((i) => {
          return i.NumeroRegion == zoneId
        })
      case ZoneCode.Departements:
        return state.FilteredList.filter((i) => {
          return i.NumeroDepartement == zoneId
        })
      case ZoneCode.Circonscriptions:
        return [
          state.FilteredList.find((i) => {
            return (
              i.NumeroCirconscription == zoneId &&
              i.NumeroDepartement == parentZoneId
            )
          }),
        ]
      default:
        return []
    }
  }

  const handleHover = (e) => {
    const mouseInfo = formatMouseEvent(e)
    if (mouseInfo) {
      setHoverInfo({
        filter: ["==", ["get", mouseInfo.zoneCode], mouseInfo.zoneId],
        lngLat: e.lngLat,
        zoneName: mouseInfo.allProps.nom
          ? mouseInfo.allProps.nom
          : `Circonscription n°${mouseInfo.allProps.num_circ}`,
        deputiesInZone: getDeputiesInZone(
          mouseInfo.zoneCode,
          mouseInfo.zoneId,
          mouseInfo.parentZoneId
        ),
      })
    } else if (hoverInfo.filter !== ["==", ["get", ""], 0]) {
      resetHoverInfo()
    }
  }

  const handleClick = (e) => {
    const mouseInfo = formatMouseEvent(e)
    if (mouseInfo) {
      switch (mouseInfo.zoneCode) {
        case ZoneCode.Regions:
          displayNewZone(ZoneCode.Departements, mouseInfo.zoneId)
          break
        case ZoneCode.Departements:
          displayNewZone(ZoneCode.Circonscriptions, mouseInfo.zoneId)
          break
        case ZoneCode.Circonscriptions:
          navigate(`/depute/${hoverInfo.deputiesInZone[0].Slug}`)
          break
        default:
          return
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
            <MapTooltip
              lngLat={hoverInfo.lngLat}
              zoneName={hoverInfo.zoneName}
              deputiesArray={hoverInfo.deputiesInZone}
              totalDeputes={state.FilteredList.length}
            />
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
  )
}
