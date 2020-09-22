import React, { useState } from "react"
import ReactMapGL, {
  NavigationControl,
  FullscreenControl,
  WebMercatorViewport,
  FlyToInterpolator,
  Source,
  Layer,
} from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import {
  ZoneCode,
  franceBox,
  GEOJsonReg,
  getBoundingBoxFromPolygon,
  filterNewGEOJSonFeatureCollection,
  getZonePolygon,
  getZoneCodeFromFeatureProperties,
  getParentZoneCode,
  getChildZoneCode,
  getGEOJsonFile,
} from "../components/maps/maps-utils"
import ResetControl from "../components/maps/ResetControl"

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

//returns an object if the mousevent is on a valid layer, else returns undefined
const getMouseEventZoneId = (e) => {
  if (e.features) {
    const currentZoneCode = getZoneCodeFromFeatureProperties(
      e.features[0]?.properties
    )
    if (currentZoneCode) {
      const zoneId = e.features[0].properties[currentZoneCode]
      return zoneId
    } else return null
  } else return null
}

export default function MapPage() {
  const [viewport, setViewport] = useState({})
  const [currentGEOJson, setCurrentGEOJson] = useState(GEOJsonReg)
  const [hoverFilter, setHoverFilter] = useState(["==", ["get", ""], ""])

  const resetFilter = () => {
    setHoverFilter(["==", ["get", ""], ""])
  }

  const flyToBounds = (box) => {
    const bounds = new WebMercatorViewport(viewport).fitBounds(box, {
      padding: 100,
    })
    setViewport({
      ...bounds,
      transitionInterpolator: new FlyToInterpolator({ speed: 1.5 }),
      transitionDuration: "auto",
    })
  }

  const displayNewZone = (
    zoom: boolean,
    currentZoneCode: ZoneCode,
    newZoneCodeId: string | number
  ) => {
    const parentParentCode = getParentZoneCode(
      getParentZoneCode(currentZoneCode)
    )
    //récupère les données geojson de la nouvelle vue à afficher
    const newZoneGEOJson = filterNewGEOJSonFeatureCollection(
      getGEOJsonFile(
        zoom
          ? getChildZoneCode(currentZoneCode)
          : getParentZoneCode(currentZoneCode)
      ),
      zoom ? currentZoneCode : parentParentCode,
      newZoneCodeId
    )

    // récupère le polygon de la region actuelle
    const newZonePolygon = getZonePolygon(
      getGEOJsonFile(zoom ? currentZoneCode : parentParentCode),
      newZoneCodeId,
      zoom ? currentZoneCode : parentParentCode
    )

    setCurrentGEOJson(newZoneGEOJson)
    resetFilter()
    flyToBounds(getBoundingBoxFromPolygon(newZonePolygon))
  }

  const handleHover = (e) => {
    const hoveredZoneId = getMouseEventZoneId(e)
    if (hoveredZoneId)
      setHoverFilter([
        "==",
        [
          "get",
          getZoneCodeFromFeatureProperties(
            currentGEOJson.features[0].properties
          ),
        ],
        hoveredZoneId,
      ])
    else if (hoverFilter !== ["==", ["get", ""], ""]) resetFilter()
  }

  const handleClick = (e) => {
    const clickedZoneId = getMouseEventZoneId(e)
    if (clickedZoneId) {
      const currentZoneCode = getZoneCodeFromFeatureProperties(
        currentGEOJson.features[0].properties
      )
      //ne rien faire si on est en vue circ (pour l'instant en tout cas)
      if (currentZoneCode !== ZoneCode.Circonscriptions) {
        displayNewZone(true, currentZoneCode, clickedZoneId)
      }
    }
  }

  const handleBack = () => {
    const currentZoneCode = getZoneCodeFromFeatureProperties(
      currentGEOJson.features[0].properties
    )

    const parentZoneId =
      currentGEOJson.features[0].properties[
        getParentZoneCode(
          getParentZoneCode(
            getZoneCodeFromFeatureProperties(
              currentGEOJson.features[0].properties
            )
          )
        )
      ]

    if (parentZoneId) {
      displayNewZone(false, currentZoneCode, parentZoneId)
    } else {
      handleReset()
    }
  }

  const handleReset = () => {
    setCurrentGEOJson(GEOJsonReg)
    flyToBounds(franceBox)
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
              setViewport({
                zoom: 2,
              })
              flyToBounds(franceBox)
            }}
            onViewportChange={(change) => setViewport(change)}
            onHover={handleHover}
            onClick={handleClick}
          >
            <Source type="geojson" data={currentGEOJson}>
              <Layer
                id="zone-fill-hovered"
                {...hoverLayerLayout}
                filter={hoverFilter}
              />
              <Layer id="zone-fill" {...fillLayerLayout} />
              <Layer id="zone-line" {...lineLayerLayout} />
            </Source>
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
