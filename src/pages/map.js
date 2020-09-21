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
import GEOJsonDistrict from "../static/list-district"
import GEOJsonDpt from "../static/departements"
import GEOJsonReg from "../static/regions"

const France = {
  center: { lng: 1.88, lat: 46.6 },
  northWest: { lng: -6.864165, lat: 50.839888 },
  southEast: { lng: 13.089067, lat: 41.284012 },
  southWest: { lng: -10, lat: 40.2 },
  northEast: { lng: 11, lat: 51.15 },
}

const franceBox = [
  [France.southWest.lng, France.southWest.lat],
  [France.northEast.lng, France.northEast.lat],
]

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
 * Returns a bounding box from a polygon
 * @param {*} polygon : the selected district found in GEOJsonDistrict file
 */
const getBoundingBoxFromPolygon = (polygon) => {
  // Récupérer le NW et SE du(des) polygone(s) de la Circonscription
  let boxListOfLng = []
  let boxListOfLat = []

  if (polygon.geometry.type === "Polygon") {
    polygon.geometry.coordinates[0].forEach((coords) => {
      boxListOfLng.push(coords[0])
      boxListOfLat.push(coords[1])
    })
  } else {
    polygon.geometry.coordinates.forEach((polygon) => {
      polygon[0].forEach((coords) => {
        boxListOfLng.push(coords[0])
        boxListOfLat.push(coords[1])
      })
    })
  }
  return [
    [Math.min(...boxListOfLng), Math.min(...boxListOfLat)],
    [Math.max(...boxListOfLng), Math.max(...boxListOfLat)],
  ]
}

/**
 * Renvoie les donées GEOJson de la prochaine vue à afficher
 * @param {*} GEOJsonFile Le fichier GEOJson dans lequel fouiller
 * @param {*} currentZoneType La vue dans laquelle on est actuellement (régions, départements, ou circonscriptions)
 * @param {*} selectedZoneId La zone cliquée par l'utilisateur
 */
const filterNewGEOJSonFeatureCollection = (
  GEOJsonFile,
  currentZoneType,
  selectedZoneId
) => {
  return {
    type: "FeatureCollection",
    features: GEOJsonFile.features.filter(
      (feature) => feature.properties[currentZoneType] === selectedZoneId
    ),
  }
}

/**
 * Renvoie le polygone d'une zone
 * @param {*} selectedZoneId L'id de la zone
 * @param {*} zoneType Le type de la zone (régions, départements, ou circonscriptions)
 * @param {*} zoneTypeFile Le fichier dans lequel fouiller
 */
const getSelectedZonePolygon = (selectedZoneId, zoneType, zoneTypeFile) => {
  return zoneTypeFile.features.find((zone) => {
    return zone.properties[zoneType] === selectedZoneId
  })
}

/**
 * Determine dans quelle vue on est actuellement
 * @param {*} featureProperties A mouseevent features properties object
 */
const determineZoneType = (featureProperties) => {
  if (featureProperties) {
    const featureAsAnArray = Object.keys(featureProperties)

    if (featureAsAnArray.includes("num_circ")) return "num_circ"
    else if (featureAsAnArray.includes("code_dpt")) return "code_dpt"
    else return "code_reg"
  }
}

//determine quel fichier devrait être utilisé pour la prochaine vue
const determineNextZoneTypeFile = (currentZoneType) => {
  return currentZoneType === "code_reg" ? GEOJsonDpt : GEOJsonDistrict
}

//returns an object if the mousevent is on a valid layer, else returns undefined
const formatMouseEventFeatures = (e) => {
  let object = {}
  if (e.features) {
    object.currentZoneType = determineZoneType(e.features[0]?.properties)
    if (object.currentZoneType) {
      object.selectedZoneId = e.features[0]?.properties[object.currentZoneType]
      return object
    } else return undefined
  } else return undefined
}

export default function MapPage() {
  const [viewport, setViewport] = useState({})
  const [currentView, setCurrentView] = useState({
    zoneGEOJson: GEOJsonReg,
    parentZoneId: "",
  })
  const [hoverFilter, setHoverFilter] = useState(["==", "no", ""])

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

  const handleHover = (e) => {
    const mouseEventInfo = formatMouseEventFeatures(e)
    if (mouseEventInfo)
      setHoverFilter([
        "==",
        ["get", mouseEventInfo.currentZoneType],
        mouseEventInfo.selectedZoneId,
      ])
    else setHoverFilter(["==", "no", ""])
  }

  const handleClick = (e) => {
    const mouseEventInfo = formatMouseEventFeatures(e)
    if (mouseEventInfo) {
      //ne rien faire si on est en vue circ (pour l'instant en tout cas)
      if (mouseEventInfo.currentZoneType !== "num_circ") {
        //récupère les données geojson de la nouvelle vue à afficher
        const zoneToDisplay = filterNewGEOJSonFeatureCollection(
          determineNextZoneTypeFile(mouseEventInfo.currentZoneType),
          mouseEventInfo.currentZoneType,
          mouseEventInfo.selectedZoneId
        )

        //récupère le polygon de la region actuelle
        const selectedZonePolygon = getSelectedZonePolygon(
          mouseEventInfo.selectedZoneId,
          mouseEventInfo.currentZoneType,
          currentView.zoneGEOJson
        )

        setCurrentView({
          zoneGEOJson: zoneToDisplay,
          parentZoneId: mouseEventInfo.selectedZoneId,
        })
        setHoverFilter(["==", "no", ""])
        flyToBounds(getBoundingBoxFromPolygon(selectedZonePolygon))
      }
    }
  }

  return (
    <>
      <div className="page page__map">
        <div className="map__container">
          <ReactMapGL
            mapboxApiAccessToken="pk.eyJ1Ijoia29iYXJ1IiwiYSI6ImNrMXBhdnV6YjBwcWkzbnJ5NDd5NXpja2sifQ.vvykENe0q1tLZ7G476OC2A"
            mapStyle="mapbox://styles/mapbox/streets-v11"
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
            <Source type="geojson" data={currentView.zoneGEOJson}>
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
              <button
                onClick={() => {
                  setCurrentView(
                    Object.assign({}, currentView, { zoneGEOJson: GEOJsonReg })
                  )
                  flyToBounds(franceBox)
                }}
                style={{ width: "100%", minHeight: "30px" }}
              >
                R
              </button>
              {/* <ResetControl
                onReset={handleReset}
                className={`map__navigation-reset ${
                  userInteracted ? "visible" : null
                }`}
                title="Revenir à la position initiale"
              /> */}
            </div>
          </ReactMapGL>
        </div>
      </div>
    </>
  )
}
