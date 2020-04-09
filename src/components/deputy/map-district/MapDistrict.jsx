import React, { useEffect } from "react"
// import styled from "styled-components"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import GEOJsonDistrict from "./list-district.json"
import Block from "../_block/_Block"
import { retirerAccentsFR } from "../../../utils/string-format/accent"
const France = {
  center: { lng: 1.88, lat: 46.6 },
  northWest: { lng: -6.864165, lat: 50.839888 },
  southEast: { lng: 13.089067, lat: 41.284012 },
}

/**
 * Retrieve the selected district box in the param map
 * @param {mapboxgl.Map} map : filled in the function
 * @param {*} selectedDistrict : the selected district found in GEOJsonDistrict file
 * @param {*} props
 */
const getSelectedDistrictBox = (map, selectedDistrict, props) => {
  // Récupérer le NW et SE du(des) polygone(s) de la Circonscription
  let boxListOfLng = []
  let boxListOfLat = []

  if (selectedDistrict.geometry.type === "Polygon") {
    selectedDistrict.geometry.coordinates[0].forEach((coords) => {
      boxListOfLng.push(coords[0])
      boxListOfLat.push(coords[1])
    })
  } else {
    selectedDistrict.geometry.coordinates.forEach((polygon) => {
      polygon[0].forEach((coords) => {
        boxListOfLng.push(coords[0])
        boxListOfLat.push(coords[1])
      })
    })
  }
  const selectedDistrictBox = [
    [Math.min(...boxListOfLng), Math.max(...boxListOfLat)],
    [Math.max(...boxListOfLng), Math.min(...boxListOfLat)],
  ]

  drawSelectedDistrictBox(map, selectedDistrict, selectedDistrictBox, props)
}

/**
 * Draw the selected district box in the "map" object
 * @param {*} map  : filled in the function
 * @param {*} district : the district found in GEOJsonDistrict file
 * @param {*} box : the district's box to draw
 * @param {*} props
 */
const drawSelectedDistrictBox = (map, district, box, props) => {
  // Dessiner la circonscription
  map.addLayer({
    id: props.nom.toLowerCase() + "-" + props.num,
    type: "fill",
    source: {
      type: "geojson",
      data: district,
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

/**
 * Initialize map for the deputy's district
 * @param {*} props
 */
const initializeMap = (props) => {
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
    const selectedDistrict = GEOJsonDistrict.features.find((district) => {
      return (
        district.properties.nom_dpt.toLowerCase() ===
          retirerAccentsFR(props.nom.toLowerCase()) &&
        parseInt(district.properties.num_circ) === props.num
      )
    })
    getSelectedDistrictBox(map, selectedDistrict, props)
  })
}

const MapDistrict = (props) => {
  useEffect(() => {
    initializeMap(props)
  }, [props])
  return (
    <Block
      title="Circonscription"
      type="map"
      color={props.color}
      size={props.size}
    >
      <div className="map__text-wrapper">
        <p className="map__title">{props.nom}</p>
        <p className="map__number">
          {props.num}
          {props.num < 2 ? "ère" : "ème"} circonscription
        </p>
      </div>
      <div className="map__container"></div>
    </Block>
  )
}

export default MapDistrict
