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
  getPolygonCenter,
  filterNewGEOJSonFeatureCollection,
  getZonePolygon,
  getZoneCodeFromFeatureProperties,
  getGEOJsonFile,
  getMouseEventFeatureProps,
} from "../components/maps/maps-utils"
import CustomControl from "../components/maps/CustomControl"
import MapTooltip from "../components/maps/MapTooltip"
import MapDeputyPin from "../components/maps/MapDeputyPin"
import IconFrance from "../images/logos/projet/augora-logo.svg"
import IconArrow from "../images/ui-kit/icon-arrow.svg"
import { DeputiesListContext } from "../context/deputies-filters/deputiesFiltersContext"

interface IHoverInfo {
  filter: any[]
  lngLat: [number, number]
  zoneName: string
  deputiesInZone: any[]
}

interface ICurrentView {
  GEOJson: FranceZoneFeatureCollection
  zoneCode: ZoneCode
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
  const [currentView, setCurrentView] = useState<ICurrentView>({
    GEOJson: GEOJsonReg,
    zoneCode: ZoneCode.Regions,
  })
  const [hoverInfo, setHoverInfo] = useState<IHoverInfo>({
    filter: ["==", ["get", ""], 0],
    lngLat: null,
    zoneName: null,
    deputiesInZone: null,
  })
  const { state } = useContext(DeputiesListContext)

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
  ): void => {
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

    setCurrentView({ GEOJson: newZoneGEOJson, zoneCode: zonesToDisplayCode })

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
          if (hoverInfo.deputiesInZone[0] !== undefined)
            navigate(`/depute/${hoverInfo.deputiesInZone[0].Slug}`)
          break
        default:
          return
      }
    }
  }

  const handleBack = () => {
    if (currentView.zoneCode === ZoneCode.Circonscriptions) {
      const regionId = currentView.GEOJson.features[0].properties[
        ZoneCode.Regions
      ] as number
      displayNewZone(ZoneCode.Departements, regionId)
    } else if (currentView.zoneCode === ZoneCode.Departements) {
      handleReset()
    }
  }

  const handleReset = () => {
    setCurrentView({ GEOJson: GEOJsonReg, zoneCode: ZoneCode.Regions })
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
          <Source type="geojson" data={currentView.GEOJson}>
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
          {currentView.zoneCode === ZoneCode.Circonscriptions
            ? currentView.GEOJson.features.map((element, index) => {
                return (
                  <MapDeputyPin
                    key={`${element.properties.nom_dpt.toLowerCase()} ${index}`}
                    lng={getPolygonCenter(element)[0]}
                    lat={getPolygonCenter(element)[1]}
                  />
                )
              })
            : null}
          <div className="map__navigation-right">
            <NavigationControl
              showCompass={false}
              zoomInLabel="Zoomer"
              zoomOutLabel="Dézoomer"
            />
            <FullscreenControl />
            <CustomControl
              onClick={handleReset}
              className={`map__navigation-custom visible`}
              title="Revenir à la vue Régions"
            >
              <IconFrance />
            </CustomControl>
          </div>
          <div className="map__navigation-left">
            <CustomControl
              onClick={handleBack}
              className={`map__navigation-custom ${
                currentView.zoneCode === ZoneCode.Regions ? "" : "visible"
              }`}
              title="Revenir à la vue précédente"
            >
              <IconArrow style={{ transform: "rotate(90deg)" }} />
            </CustomControl>
          </div>
        </ReactMapGL>
      </div>
    </div>
  )
}
