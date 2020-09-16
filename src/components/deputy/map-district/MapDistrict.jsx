import React, { useState } from "react"
// import styled from "styled-components"
import ReactMapGL, {
  NavigationControl,
  FullscreenControl,
  WebMercatorViewport,
  FlyToInterpolator,
  Source,
  Layer,
} from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import GEOJsonDistrict from "../../../static/list-district.json"
import Block from "../_block/_Block"
import { retirerAccentsFR } from "../../../utils/string-format/accent"
import ResetControl from "./ResetControl"

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
  const [userInteracted, setUserInteracted] = useState(false)

  //récupère le polygone complexe de la circonscription
  const districtPolygon = GEOJsonDistrict.features.find((district) => {
    return (
      district.properties.nom_dpt.toLowerCase() ===
        retirerAccentsFR(props.nom.toLowerCase()) &&
      parseInt(district.properties.num_circ) === props.num
    )
  })

  //récupère la bounding box à paris du polygone de la circonscription
  const districtBox = getSelectedDistrictBox(districtPolygon)

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

  //     const marker = new mapboxgl.Marker({
  //       scale: 0.8,
  //     })
  //       .setLngLat([
  //         box[1][0] - (box[1][0] - box[0][0]) / 2,
  //         box[0][1] - (box[0][1] - box[1][1]) / 2,
  //       ])
  //       .addTo(map)
  //   })

  //   map.on("dragstart", () => {
  //     setMapModified(true)
  //   })
  //   setTimeout(() => {
  //     map.on("zoomstart", () => {
  //       setMapModified(true)
  //     })
  //   }, 3000)

  //   return map
  // }

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
          width="100%"
          height="100%"
          minZoom={2}
          dragRotate={false}
          doubleClickZoom={false}
          touchRotate={false}
          mapOptions={{}}
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
          onViewportChange={(change) => {
            setViewport(change)
          }}
          //appelé quand une interaction est constatée
          onInteractionStateChange={(state) => {
            if (
              !userInteracted &&
              !state.inTransition &&
              (state.isPanning || state.isZooming)
            ) {
              setUserInteracted(true)
            }
          }}
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
                "line-color": "#4d4d4d",
                "line-width": 1,
                "line-dasharray": [4, 2],
              }}
            />
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
