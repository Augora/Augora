import React, { useState, useContext, useMemo } from "react"
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
import MapBreadcrumb from "../components/maps/MapBreadcrumb"
import IconFrance from "../images/logos/projet/augora-logo.svg"
import IconArrow from "../images/ui-kit/icon-arrow.svg"
import { DeputiesListContext } from "../context/deputies-filters/deputiesFiltersContext"

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
  zoneName: string
  parentZoneId: number
  parentZoneCode: ZoneCode
  allProps: GeoJSON.GeoJsonProperties
} => {
  const featureProps = getMouseEventFeatureProps(e)
  if (featureProps) {
    const currentZoneCode = getZoneCodeFromFeatureProperties(featureProps)
    var parentZoneId, parentZoneCode

    switch (currentZoneCode) {
      case ZoneCode.Departements:
        parentZoneId = featureProps[ZoneCode.Regions] as number
        parentZoneCode = ZoneCode.Regions
        break
      case ZoneCode.Circonscriptions:
        parentZoneId = featureProps[ZoneCode.Departements] as number
        parentZoneCode = ZoneCode.Departements
        break
      default:
        parentZoneId = null
        parentZoneCode = null
        break
    }

    return {
      zoneId: featureProps[currentZoneCode] as number,
      zoneCode: currentZoneCode,
      zoneName: featureProps.nom,
      parentZoneId: parentZoneId,
      parentZoneCode: parentZoneCode,
      allProps: featureProps,
    }
  } else return null
}

export default function MapPage() {
  const { state } = useContext(DeputiesListContext)
  const franceMetroDeputies = useMemo(
    () => state.FilteredList.filter((entry) => entry.NumeroRegion > 10),
    [state.FilteredList]
  )

  const [viewport, setViewport] = useState<ViewState>({
    zoom: 5,
    longitude: France.center.lng,
    latitude: France.center.lat,
  })
  const [currentView, setCurrentView] = useState<{
    GEOJson: FranceZoneFeatureCollection
    zoneCode: ZoneCode
    deputiesInZone: any[]
    breadcrumb: string[]
  }>({
    GEOJson: GEOJsonReg,
    zoneCode: ZoneCode.Regions,
    deputiesInZone: franceMetroDeputies,
    breadcrumb: ["France métropolitaine"],
  })
  const [hoverInfo, setHoverInfo] = useState<{
    filter: any[]
    lngLat: [number, number]
    zoneName: string
    deputiesInZone: any[]
  }>({
    filter: ["==", ["get", ""], 0],
    lngLat: null,
    zoneName: null,
    deputiesInZone: null,
  })

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
   * @param {string} [zoneName] Le nom de la zone à afficher, pour le breadcrumb. Ne rien mettre si c'est un dezoom
   */
  const displayNewZone = (
    zonesToDisplayCode: ZoneCode,
    zonesToDisplayCommonId: number,
    zoneName?: string
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

    const newDeputiesInZone = getDeputiesInZone(
      parentZoneCode,
      zonesToDisplayCommonId
    )

    setCurrentView((prevState) => {
      return {
        GEOJson: newZoneGEOJson,
        zoneCode: zonesToDisplayCode,
        deputiesInZone: newDeputiesInZone,
        breadcrumb: zoneName
          ? [...prevState.breadcrumb, zoneName]
          : [...prevState.breadcrumb.slice(0, -1)],
      }
    })

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
          displayNewZone(
            ZoneCode.Departements,
            mouseInfo.zoneId,
            mouseInfo.zoneName
          )
          return
        case ZoneCode.Departements:
          displayNewZone(
            ZoneCode.Circonscriptions,
            mouseInfo.zoneId,
            mouseInfo.zoneName
          )
          return
        case ZoneCode.Circonscriptions:
          const deputy = getDeputiesInZone(
            mouseInfo.zoneCode,
            mouseInfo.zoneId,
            mouseInfo.parentZoneId
          )[0]
          if (deputy) navigate(`/depute/${deputy.Slug}`)
          return
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
    setCurrentView({
      GEOJson: GEOJsonReg,
      zoneCode: ZoneCode.Regions,
      deputiesInZone: franceMetroDeputies,
      breadcrumb: ["France métropolitaine"],
    })
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
                    deputy={currentView.deputiesInZone.find((entry) => {
                      return (
                        entry.NumeroCirconscription ==
                        element.properties.num_circ
                      )
                    })}
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
            <MapBreadcrumb data={currentView.breadcrumb} />
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
