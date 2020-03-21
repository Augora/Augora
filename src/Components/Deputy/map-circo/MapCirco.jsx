import React, { useEffect } from "react"
// import styled from "styled-components"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import GEOJsonCirco from "./list-circo.json"
import Block from "../_block/_Block"
import { retirerAccentsFR } from './../../../utils/string-format/accent';
const France = {
  center: { lng: 1.88, lat: 46.6 },
  northWest: { lng: -6.864165, lat: 50.839888 },
  southEast: { lng: 13.089067, lat: 41.284012 },
}

const getSelectedCircoBox = (map, selectedCirco, props) => {
  // Récupérer le NW et SE du(des) polygone(s) de la Circonscription
  let boxListOfLng = []
  let boxListOfLat = []

  if (selectedCirco.geometry.type === "Polygon") {
    selectedCirco.geometry.coordinates[0].forEach(coords => {
      boxListOfLng.push(coords[0])
      boxListOfLat.push(coords[1])
    })
  } else {
    selectedCirco.geometry.coordinates.forEach(polygon => {
      polygon[0].forEach(coords => {
        boxListOfLng.push(coords[0])
        boxListOfLat.push(coords[1])
      })
    })
  }
  const selectedCircoBox = [
    [Math.min(...boxListOfLng), Math.max(...boxListOfLat)],
    [Math.max(...boxListOfLng), Math.min(...boxListOfLat)],
  ]

  drawSelectedCircoBox(map, selectedCirco, selectedCircoBox, props)
}

const drawSelectedCircoBox = (map, circo, box, props) => {
  // Dessiner la circo
  map.addLayer({
    id: props.nom.toLowerCase() + "-" + props.num,
    type: "fill",
    source: {
      type: "geojson",
      data: circo,
    },
    layout: {},
    paint: {
      "fill-color": "#fff",
      "fill-opacity": 0.5,
      "fill-outline-color": "#f00",
    },
  })
  if (box) {
    setTimeout(() => {
      map.fitBounds(box, {
        padding: 10,
        maxZoom: 9,
      })
    }, 1000)
  }
}

const initMap = props => {
  mapboxgl.accessToken =
    "pk.eyJ1Ijoia29iYXJ1IiwiYSI6ImNrMXBhdnV6YjBwcWkzbnJ5NDd5NXpja2sifQ.vvykENe0q1tLZ7G476OC2A"
  const map = new mapboxgl.Map({
    container: document.querySelector(".map__container"), // container id
    style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
    center: France.center, // starting position [lng, lat]
    zoom: 2, // starting zoom
  })
  map.on("style.load", () => {
    // Récupérer la circonscription concernée
    const selectedCirco = GEOJsonCirco.features.find(circo => {
      return (
        circo.properties.nom_dpt.toLowerCase() ===
          retirerAccentsFR(props.nom.toLowerCase()) &&
        parseInt(circo.properties.num_circ) === props.num
      )
    })
    getSelectedCircoBox(map, selectedCirco, props)
  })
}

const MapCirco = props => {
  useEffect(() => {
    initMap(props)
  }, [props])

  return (
    <Block title="Circonscription" type="map" color={props.color}>
      <p className="map__title">{props.nom}</p>
      <div className="map__container"></div>
    </Block>
  )
}

export default MapCirco
