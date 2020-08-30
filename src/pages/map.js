import React, { useEffect } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import GEOJsonDistrict from "../static/list-district"
import GEOJsonDpt from "../static/departements"
import GeoJsonReg from "../static/regions"

const France = {
  center: { lng: 1.88, lat: 46.6 },
  northWest: { lng: -6.864165, lat: 50.839888 },
  southEast: { lng: 13.089067, lat: 41.284012 },
}

const zoomOnFrance = (map) => {
  map.fitBounds(
    [
      [France.northWest.lng, France.northWest.lat],
      [France.southEast.lng, France.southEast.lat],
    ],
    {
      padding: 30,
      maxZoom: 9,
      duration: 2000,
    }
  )
}

const drawDistrictBox = (map, district) => {
  map.addLayer({
    id:
      // Dessiner les circonscriptions
      // district.properties.nom_dpt.toLowerCase() +
      // "-" +
      // district.properties.num_circ,

      // Dessiner les départements
      district.properties.nom.toLowerCase() + "-" + district.properties.code,

    // Dessiner les régions

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
}

const initializeMap = () => {
  mapboxgl.accessToken =
    "pk.eyJ1Ijoia29iYXJ1IiwiYSI6ImNrMXBhdnV6YjBwcWkzbnJ5NDd5NXpja2sifQ.vvykENe0q1tLZ7G476OC2A"
  const map = new mapboxgl.Map({
    container: document.querySelector(".map__container"), // container id
    style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
    center: France.center, // starting position [lng, lat]
    // zoom: 9, // starting zoom
    interactive: false,
  })
  map.on("style.load", () => {
    setTimeout(() => {
      zoomOnFrance(map)
      // GEOJsonDistrict.features.forEach((district, index) => {
      //   drawDistrictBox(map, district)
      // })
      //GEOJsonDpt.features.forEach((dpt, index) => {
      //  drawDistrictBox(map, dpt)
      GeoJsonReg.features.forEach((reg, index) => {
        drawDistrictBox(map, reg)
      })
    }, 2000)
  })

  return map
}

const MapPage = () => {
  useEffect(() => {
    initializeMap()
  }, [])

  return (
    <>
      <div className="page page__map">
        <div></div>
        <div className="map__container"></div>
      </div>
    </>
  )
}

export default MapPage
