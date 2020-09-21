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
 * @param {*} districtPolygon : the selected district found in GEOJsonDistrict file
 */
const getSelectedDistrictBox = (districtPolygon) => {
  // Récupérer le NW et SE du(des) polygone(s) de la Circonscription
  let boxListOfLng = []
  let boxListOfLat = []

  if (districtPolygon.geometry.type === "Polygon") {
    districtPolygon.geometry.coordinates[0].forEach((coords) => {
      boxListOfLng.push(coords[0])
      boxListOfLat.push(coords[1])
    })
  } else {
    districtPolygon.geometry.coordinates.forEach((polygon) => {
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
 * Determine dans quelle vue on est actuellement
 * @param {*} featureProperties A mouseevent features array
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

export default function MapPage() {
  const [viewport, setViewport] = useState({})
  const [hoverFilter, setHoverFilter] = useState(["==", "no", ""])
  const [currentView, setCurrentView] = useState({
    zoneGEOJson: GEOJsonReg,
    parentZoneId: "",
  })
  // useEffect(() => {
  //   initializeMap()
  // }, [])

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
    if (e.features) {
      const currentZoneType = determineZoneType(e.features[0]?.properties) //determine dans quelle vue on est
      if (currentZoneType) {
        const hoveredZoneId = e.features[0]?.properties[currentZoneType]
        if (hoveredZoneId) {
          setHoverFilter(["==", ["get", currentZoneType], hoveredZoneId])
        }
      } else {
        setHoverFilter(["==", "no", ""])
      }
    }
  }

  const handleClick = (e) => {
    if (e.features) {
      const currentZoneType = determineZoneType(e.features[0]?.properties) //determine dans quelle vue on est
      if (currentZoneType && currentZoneType !== "num_circ") {
        //ne rien faire si on est en vue circonscription
        const selectedZoneId = e.features[0]?.properties[currentZoneType] //recupère l'id de la zone cliquée
        if (selectedZoneId) {
          const zoneToDisplay = filterNewGEOJSonFeatureCollection(
            //récupère les données geojson de la nouvelle vue à afficher
            determineNextZoneTypeFile(currentZoneType),
            currentZoneType,
            selectedZoneId
          )
          setCurrentView({
            zoneGEOJson: zoneToDisplay,
            parentZoneId: selectedZoneId,
          })
          setHoverFilter(["==", "no", ""])
          // console.log(getSelectedDistrictBox(zoneToDisplay))
        }
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
