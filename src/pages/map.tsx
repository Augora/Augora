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
  FranceZoneProperties,
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
  getZoneFeatureProps,
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
    zoneData: FranceZoneProperties
    zoneDeputies: { [key: string]: any }[] //ça veut juste dire que c'est un array d'objets
  }>({
    GEOJson: GEOJsonReg,
    zoneCode: ZoneCode.Regions,
    zoneData: {
      nom: "France métropolitaine",
    },
    zoneDeputies: franceMetroDeputies,
  })
  const [hoverInfo, setHoverInfo] = useState<{
    filter: any[]
    lngLat: [number, number]
    zoneName: string
    deputiesInZone: { [key: string]: any }[]
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
   * @param {FranceZoneProperties} zoneFeatureProps La feature props de la zone à afficher
   */
  const displayNewZone = (zoneFeatureProps: FranceZoneProperties): void => {
    const zoneCode = getZoneCodeFromFeatureProperties(zoneFeatureProps)
    if (!zoneCode) return

    const zoneId = zoneFeatureProps[zoneCode]

    const childrenZonesCode =
      zoneCode === ZoneCode.Regions
        ? ZoneCode.Departements
        : ZoneCode.Circonscriptions

    const newZoneGEOJson = filterNewGEOJSonFeatureCollection(
      getGEOJsonFile(childrenZonesCode),
      zoneCode,
      zoneId
    )

    const newZonePolygon = getZonePolygon(
      getGEOJsonFile(zoneCode),
      zoneCode,
      zoneId
    )

    const newDeputiesInZone = getDeputiesInZone(zoneFeatureProps)

    setCurrentView({
      GEOJson: newZoneGEOJson,
      zoneCode: childrenZonesCode,
      zoneData: zoneFeatureProps,
      zoneDeputies: newDeputiesInZone,
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
   * @param {FranceZoneProperties} featureProps La feature props de la zone à fouiller
   */
  const getDeputiesInZone = (
    featureProps: FranceZoneProperties
  ): { [key: string]: any }[] => {
    switch (getZoneCodeFromFeatureProperties(featureProps)) {
      case ZoneCode.Regions:
        return state.FilteredList.filter((i) => {
          return i.NumeroRegion == featureProps[ZoneCode.Regions]
        })
      case ZoneCode.Departements:
        return state.FilteredList.filter((i) => {
          return i.NumeroDepartement == featureProps[ZoneCode.Departements]
        })
      case ZoneCode.Circonscriptions:
        return [
          state.FilteredList.find((i) => {
            return (
              i.NumeroCirconscription ==
                featureProps[ZoneCode.Circonscriptions] &&
              i.NumeroDepartement == featureProps[ZoneCode.Departements]
            )
          }),
        ]
      default:
        return []
    }
  }

  const handleHover = (e) => {
    const featureProps = getMouseEventFeatureProps(e)
    if (featureProps) {
      const zoneCode = getZoneCodeFromFeatureProperties(featureProps)
      const parentZoneId =
        zoneCode === ZoneCode.Circonscriptions
          ? featureProps[ZoneCode.Departements]
          : null
      setHoverInfo({
        filter: ["==", ["get", zoneCode], featureProps[zoneCode]],
        lngLat: e.lngLat,
        zoneName: featureProps.nom
          ? featureProps.nom
          : `Circonscription n°${featureProps.num_circ}`,
        deputiesInZone: getDeputiesInZone(featureProps),
      })
    } else if (hoverInfo.filter !== ["==", ["get", ""], 0]) {
      resetHoverInfo()
    }
  }

  const handleClick = (e) => {
    const featureProps = getMouseEventFeatureProps(e)
    if (featureProps) {
      const zoneCode = getZoneCodeFromFeatureProperties(featureProps)
      if (zoneCode === ZoneCode.Circonscriptions) {
        const parentZoneId = featureProps[ZoneCode.Departements]
        const deputy = getDeputiesInZone(featureProps)[0]
        if (deputy) navigate(`/depute/${deputy.Slug}`)
      } else {
        displayNewZone(featureProps)
      }
    }
  }

  const handleBack = () => {
    if (currentView.zoneCode === ZoneCode.Circonscriptions) {
      const regionProps = getZoneFeatureProps(
        currentView.GEOJson.features[0].properties[ZoneCode.Regions],
        ZoneCode.Regions
      )
      displayNewZone(regionProps)
    } else if (currentView.zoneCode === ZoneCode.Departements) {
      handleReset()
    }
  }

  const handleReset = () => {
    setCurrentView({
      GEOJson: GEOJsonReg,
      zoneCode: ZoneCode.Regions,
      zoneData: {
        nom: "France métropolitaine",
      },
      zoneDeputies: franceMetroDeputies,
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
                    deputy={currentView.zoneDeputies.find((entry) => {
                      return (
                        entry.NumeroCirconscription ==
                        element.properties.num_circ
                      )
                    })}
                  />
                )
              })
            : null}
          <div className="map__navigation map__navigation-right">
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
          <div className="map__navigation map__navigation-left">
            <MapBreadcrumb
              data={currentView.zoneData}
              handleReset={handleReset}
              handleClick={displayNewZone}
            />
            <CustomControl
              onClick={handleBack}
              className={`map__navigation-custom ${
                currentView.zoneCode === ZoneCode.Regions ? "" : "visible"
              }`}
              title="Revenir à la vue précédente"
            >
              <IconArrow
                style={{
                  transform: "rotate(90deg)",
                }}
              />
            </CustomControl>
          </div>
        </ReactMapGL>
      </div>
    </div>
  )
}
