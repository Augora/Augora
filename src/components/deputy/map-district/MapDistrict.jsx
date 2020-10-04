import React, { useState, useMemo } from "react"
import ReactMapGL, {
  NavigationControl,
  FullscreenControl,
  WebMercatorViewport,
  FlyToInterpolator,
  Source,
  Layer,
  Marker,
} from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import GEOJsonDistrict from "../../../static/list-district.json"
import { retirerAccentsFR } from "../../../utils/string-format/accent"
import Block from "../_block/_Block"
import ResetControl from "./ResetControl"
import Tooltip from "../../tooltip/Tooltip"
import IconPin from "../../../images/ui-kit/icon-pin.svg"

const France = {
  center: { lng: 1.88, lat: 46.6 },
  northWest: { lng: -6.864165, lat: 50.839888 },
  southEast: { lng: 13.089067, lat: 41.284012 },
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

export default function MapDistrict(props) {
  const [viewport, setViewport] = useState({})
  const [interactionSettings, setInteractionSettings] = useState({
    dragPan: false,
    touchZoom: false,
    scrollZoom: false,
  })
  const [userInteracted, setUserInteracted] = useState(false)
  const [pinClicked, setPinClicked] = useState(false)

  //récupère le polygone de la circonscription
  const districtPolygon = useMemo(() => {
    return GEOJsonDistrict.features.find((district) => {
      return (
        district.properties.nom_dpt.toLowerCase() ===
          retirerAccentsFR(props.nom.toLowerCase()) &&
        parseInt(district.properties.num_circ) === props.num
      )
    })
  }, [])

  //récupère la bounding box à paris du polygone de la circonscription
  const districtBox = useMemo(() => getSelectedDistrictBox(districtPolygon), [])

  //récupère le centre de la bounding box
  const districtCenter = useMemo(() => {
    return Object.assign(
      {},
      {
        lat: districtBox[1][1] - (districtBox[1][1] - districtBox[0][1]) / 2,
        lng: districtBox[1][0] - (districtBox[1][0] - districtBox[0][0]) / 2,
      }
    )
  }, [])

  //function pour transitionner de façon fluide vers une bounding box
  const flyToBounds = (box) => {
    const bounds = new WebMercatorViewport(viewport).fitBounds(box, {
      padding: 100,
    })
    setViewport({
      ...viewport,
      ...bounds,
      transitionInterpolator: new FlyToInterpolator({ speed: 1.5 }),
      transitionDuration: "auto",
    })
  }

  //reset button handler
  const handleReset = () => {
    setUserInteracted(false)
    flyToBounds(districtBox)
  }

  //interaction handler
  const handleInteraction = (state) => {
    if (!state.inTransition) {
      if (!interactionSettings.dragPan)
        setInteractionSettings({
          dragPan: true,
          touchZoom: true,
          scrollZoom: true,
        })
      if (!userInteracted && (state.isPanning || state.isZooming))
        setUserInteracted(true)
    } else if (interactionSettings.dragPan)
      setInteractionSettings({
        dragPan: false,
        touchZoom: false,
        scrollZoom: false,
      })
    if (pinClicked) setPinClicked(false)
  }

  return (
    <Block
      title="Circonscription"
      type="map"
      color={props.color}
      size={props.size}
      circ={{
        region: props.nom,
        circNb: props.num,
      }}
    >
      <div className="map__container">
        <ReactMapGL
          mapboxApiAccessToken="pk.eyJ1Ijoia29iYXJ1IiwiYSI6ImNrMXBhdnV6YjBwcWkzbnJ5NDd5NXpja2sifQ.vvykENe0q1tLZ7G476OC2A"
          mapStyle="mapbox://styles/mapbox/streets-v11"
          {...viewport}
          {...interactionSettings}
          width="100%"
          height="100%"
          minZoom={2}
          dragRotate={false}
          doubleClickZoom={false}
          touchRotate={false}
          //appelé Au chargement de la page
          onLoad={() => {
            setViewport({
              latitude: France.center.lat,
              longitude: France.center.lng,
              zoom: 2,
            })
            flyToBounds(districtBox)
          }}
          //appelé quand le viewport change - nécéssaire pour que la map bouge
          onViewportChange={(change) => setViewport(change)}
          //appelé quand une interaction est constatée
          onInteractionStateChange={(state) => handleInteraction(state)}
        >
          <Source type="geojson" data={districtPolygon}>
            <Layer
              type="fill"
              paint={{
                "fill-color": "#fff",
                "fill-opacity": 0.5,
              }}
            />
            <Layer
              type="line"
              paint={{
                "line-color": props.color,
                "line-width": 2,
                // "line-dasharray": [4, 2],
              }}
            />
          </Source>
          <Marker
            latitude={districtCenter.lat}
            longitude={districtCenter.lng}
            offsetLeft={-15}
            offsetTop={-30}
          >
            <Tooltip
              className={`circ-tooltip ${
                pinClicked ? "circ-tooltip--visible" : ""
              }`}
            >
              <span>
                {`${props.nom}, ${props.num}${
                  props.num < 2 ? "ère " : "ème "
                }Circonscription `}
              </span>
            </Tooltip>
            <div
              className="icon-wrapper"
              style={{ width: "30px", height: "30px", cursor: "pointer" }}
              onClick={() => setPinClicked(!pinClicked)}
            >
              <IconPin fill={props.color} />
            </div>
          </Marker>
          <div className="map__navigation">
            <NavigationControl
              showCompass={false}
              zoomInLabel="Zoomer"
              zoomOutLabel="Dézoomer"
            />
            <FullscreenControl />
            <ResetControl
              onReset={handleReset}
              className={`map__navigation-reset ${
                userInteracted ? "visible" : null
              }`}
              title="Revenir à la position initiale"
            />
          </div>
        </ReactMapGL>
      </div>
    </Block>
  )
}
