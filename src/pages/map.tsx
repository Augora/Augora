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
} from "../components/maps/maps-utils"
import GEOJsonDistrict from "../static/list-district"
import GEOJsonDpt from "../static/departements"

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
 * Renvoie les donées GEOJson de la prochaine vue à afficher
 * @param {any} GEOJsonFile Le fichier GEOJson dans lequel fouiller
 * @param {ZoneCode} zoneCodeToSearch Le type de zone commune à chercher dans les entrées GEOJson
 * @param {string | number} zoneCodeId L'id de la zone commune
 */
const filterNewGEOJSonFeatureCollection = (
  GEOJsonFile: any,
  zoneCodeToSearch: ZoneCode,
  zoneCodeId: string | number
): GeoJSON.FeatureCollection => {
  return {
    type: "FeatureCollection",
    features: GEOJsonFile.features.filter(
      (feature) => feature.properties[zoneCodeToSearch] === zoneCodeId
    ),
  }
}

/**
 * Renvoie le polygone d'une zone
 * @param {any} GEOJsonFile Le fichier dans lequel fouiller
 * @param {string | number} zoneId L'id de la zone
 * @param {ZoneCode} zoneCode Le type de la zone (régions, départements, ou circonscriptions)
 */
const getZonePolygon = (
  GEOJsonFile: any,
  zoneId: string | number,
  zoneCode: ZoneCode
) => {
  return GEOJsonFile.features.find((zone) => {
    return zone.properties[zoneCode] === zoneId
  })
}

/**
 * Determine dans quelle vue on est actuellement
 * @param {object} featureProperties A GEOJson feature properties object
 */
const getZoneCodeFromFeatureProperties = (featureProperties: object) => {
  if (featureProperties) {
    const featureAsAnArray = Object.keys(featureProperties)

    if (featureAsAnArray.includes(ZoneCode.Circonscriptions))
      return ZoneCode.Circonscriptions
    else if (featureAsAnArray.includes(ZoneCode.Departements))
      return ZoneCode.Departements
    else return ZoneCode.Regions
  }
}

const getParentZoneCode = (zoneCode: ZoneCode) => {
  switch (zoneCode) {
    case ZoneCode.Circonscriptions:
      return ZoneCode.Departements
    case ZoneCode.Departements:
      return ZoneCode.Regions
    default:
      return null
  }
}

const getChildZoneCode = (zoneCode: ZoneCode) => {
  switch (zoneCode) {
    case ZoneCode.Regions:
      return ZoneCode.Departements
    case ZoneCode.Departements:
      return ZoneCode.Circonscriptions
    default:
      return null
  }
}

//donne le fichier associé au type de zone
const getGEOJsonFile = (zoneCode: ZoneCode) => {
  switch (zoneCode) {
    case ZoneCode.Circonscriptions:
      return GEOJsonDistrict
    case ZoneCode.Departements:
      return GEOJsonDpt
    default:
      return GEOJsonReg
  }
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
      setCurrentGEOJson(GEOJsonReg)
      flyToBounds(franceBox)
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
              <button
                onClick={() => {
                  setCurrentGEOJson(GEOJsonReg)
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
