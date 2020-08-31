import React, { useEffect } from "react"
import mapboxgl from "mapbox-gl"
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

      // Dessiner les départements ou les régions
      //district.properties.nom.toLowerCase() + "-" + district.properties.code,
      "regions",

    type: "fill",
    source: "regions",
    layout: {},
    paint: {
      "fill-color": "#fff",
      "fill-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        1,
        0.5,
      ],
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
    //center: France.center, // starting position [lng, lat]
    // zoom: 9, // starting zoom
    interactive: true,
    maxBounds: [
      [France.southWest.lng, France.southWest.lat], // Appliquer Southwest coordinates
      [France.northEast.lng, France.northEast.lat], // Appliquer Northeast coordinates
    ],
  })
  var hoveredZoneId = null
  map.on("style.load", () => {
    setTimeout(() => {
      zoomOnFrance(map)
      // GEOJsonDistrict.features.forEach((district, index) => {
      //   drawDistrictBox(map, district)
      // })
      //GEOJsonDpt.features.forEach((dpt, index) => {
      //  drawDistrictBox(map, dpt)
      map.addSource("regions", {
        type: "geojson",
        data: GEOJsonReg,
        generateId: true,
      })
      map.addSource("departements", {
        type: "geojson",
        data: GEOJsonDpt,
        generateId: true,
      })
      map.addSource("circonscriptions", {
        type: "geojson",
        data: GEOJsonDistrict,
        generateId: true,
      })
      drawDistrictBox(map, "regions")
      //GEOJsonReg.features.forEach((reg, index) => {
    }, 2000)
  })
  MouseEvents(map)
  MouseHover(map, hoveredZoneId)
  return map
}
const MouseHover = (map, hoveredZoneId) => {
  // When the user moves their mouse over the state-fill layer, we'll update the
  // feature state for the feature under the mouse.

  map.on("mousemove", "regions", function (e) {
    if (e.features.length > 0) {
      if (hoveredZoneId) {
        map.setFeatureState(
          {
            source: "regions",
            id: hoveredZoneId,
          },
          { hover: false }
        )
      }
      hoveredZoneId = e.features[0].id
      console.log(hoveredZoneId)
      map.setFeatureState(
        {
          source: "regions",
          id: hoveredZoneId,
        },
        { hover: true }
      )
    }
  })

  // When the mouse leaves the state-fill layer, update the feature state of the
  // previously hovered feature.
  map.on("mouseleave", "regions", function () {
    if (hoveredZoneId) {
      map.setFeatureState(
        {
          source: "regions",
          id: hoveredZoneId,
        },
        { hover: false }
      )
    }
    hoveredZoneId = null
  })
}

const MouseEvents = (map) => {
  map.on("click", "regions", function (e) {
    var coordinates = e.lngLat
    var description = e.features[0].properties.nom
    new mapboxgl.Popup().setLngLat(coordinates).setHTML(description).addTo(map)
  })
  map.on("mouseenter", "regions", function () {
    map.getCanvas().style.cursor = "pointer"
  })

  map.on("mouseleave", "regions", function () {
    map.getCanvas().style.cursor = ""
  })
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
