import React, { useEffect } from "react"
// import styled from "styled-components"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
//import GEOJsonDistrict from "../components/deputy/map-district/list-district.json"
import GEOJsonDistrict from "../components/carte-france/map/ZB.json"
import Block from "../components/deputy/_block/_Block"
import { retirerAccentsFR } from "../utils/string-format/accent"
const France = {
  center: { lng: 1.88, lat: 46.6 },
  northWest: { lng: -6.864165, lat: 50.839888 },
  southEast: { lng: 13.089067, lat: 41.284012 },
}

/**
 * Initialize map for the deputy's district
 * @param {*} props
 */
const initializeMap = () => {
  mapboxgl.accessToken =
    "pk.eyJ1Ijoia29iYXJ1IiwiYSI6ImNrMXBhdnV6YjBwcWkzbnJ5NDd5NXpja2sifQ.vvykENe0q1tLZ7G476OC2A"
  const map = new mapboxgl.Map({
    container: "map", // container id
    style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
    center: France.center, // starting position [lng, lat]
    zoom: 9, // starting zoom
    interactive: false,
  })
}

const MapDistrict = () => {
  useEffect(() => {
    initializeMap()
  })
  return <div id="map"></div>
}

export default MapDistrict
