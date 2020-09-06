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
const getSelectedDistrictBox = (map, selectedDistrict) => {
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

  UpdateDistrictBox(map, selectedDistrict, selectedDistrictBox)
}

const UpdateDistrictBox = (map, district, box) => {
  if (box) {
    setTimeout(() => {
      map.fitBounds(box, {
        padding: 10,
        maxZoom: 9,
      })
    }, 1000)
  }
}

const drawDistrictBox = (map, id_district, district, hoveredZoneId) => {
  map.addLayer({
    id: id_district,
    type: "fill",
    source: district,
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
  // map.addLayer({
  //   id: "nbDepute",
  //   type: "circle",
  //   source: "circonscriptions",
  //   paint: {
  //     "circle-color": {
  //       property: "code_reg",
  //     },
  //     "circle-opacity": 1.0,
  //     "circle-radius": 20,
  //   },
  // })
  MouseEvents(map, "regions", "departements", "circonscriptions")
  MouseHover(map, hoveredZoneId, "regions", "departements", "circonscriptions")
  var selectedDistrict = null

  if (hoveredZoneId) {
    if (district === "departements") {
      selectedDistrict = GEOJsonReg.features.find((district) => {
        return district.properties.code_reg.toLowerCase() === hoveredZoneId
      })
    }
    getSelectedDistrictBox(map, selectedDistrict)
    map.setPadding({ top: 20, left: 20, right: 20, bottom: 20 })
  }
}

const initializeMap = () => {
  mapboxgl.accessToken =
    "pk.eyJ1Ijoia29iYXJ1IiwiYSI6ImNrMXBhdnV6YjBwcWkzbnJ5NDd5NXpja2sifQ.vvykENe0q1tLZ7G476OC2A"
  const map = new mapboxgl.Map({
    container: document.querySelector(".map__container"), // container id
    style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
    center: France.center, // starting position [lng, lat]
    zoom: 9, // starting zoom
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
      drawDistrictBox(map, "regions", "regions")
    }, 2000)
  })
  // MouseEvents(map, "regions", "departements", "circonscriptions")
  // MouseHover(map, hoveredZoneId, "regions", "departements", "circonscriptions")
  return map
}
const MouseHover = (
  map,
  hoveredZoneId,
  districtReg,
  districtDpt,
  discrictCir
) => {
  var CurrentDistrict = null
  if (districtReg) {
    CurrentDistrict = districtReg
  } else if (districtDpt) {
    CurrentDistrict = districtDpt
  } else {
    CurrentDistrict = discrictCir
  }
  map.on("mousemove", CurrentDistrict, function (e) {
    if (e.features.length > 0) {
      console.log(hoveredZoneId)
      if (hoveredZoneId || hoveredZoneId === 0) {
        map.setFeatureState(
          {
            source: CurrentDistrict,
            id: hoveredZoneId,
          },
          { hover: false }
        )
      }
      hoveredZoneId = e.features[0].id
      map.setFeatureState(
        {
          source: CurrentDistrict,
          id: hoveredZoneId,
        },
        { hover: true }
      )
    }
  })

  map.on("mouseleave", CurrentDistrict, function () {
    if (hoveredZoneId) {
      map.setFeatureState(
        {
          source: CurrentDistrict,
          id: hoveredZoneId,
        },
        { hover: false }
      )
    }
    hoveredZoneId = null
  })
}

const MouseEvents = (map, districtReg, districtDpt, discrictCir) => {
  var CurrentDistrict = null
  if (districtReg) {
    CurrentDistrict = districtReg
  } else if (districtDpt) {
    CurrentDistrict = districtDpt
  } else {
    CurrentDistrict = discrictCir
  }
  map.on("click", CurrentDistrict, function (e) {
    if (map.getLayer(CurrentDistrict)) map.removeLayer(CurrentDistrict)
    if (CurrentDistrict === "regions") {
      drawDistrictBox(
        map,
        "departements",
        "departements",
        e.features[0].properties.code_reg
      )
      map.setFilter("departements", [
        "==",
        ["get", "code_reg"],
        e.features[0].properties.code_reg,
      ])
    } else if (CurrentDistrict === "departements") {
      drawDistrictBox(
        map,
        "circonscriptions",
        "circonscriptions",
        e.features[0].properties.code_dpt
      )
      map.setFilter("circonscriptions", [
        "==",
        ["get", "code_dpt"],
        e.features[0].properties.code_dpt,
      ])
    }
  })
  map.on("mouseenter", CurrentDistrict, function () {
    map.getCanvas().style.cursor = "pointer"
  })

  map.on("mouseleave", CurrentDistrict, function () {
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
        <div>
          <button onClick={(e) => initializeMap()}>Reset</button>
        </div>
        <div className="map__container"></div>
      </div>
    </>
  )
}

export default MapPage
