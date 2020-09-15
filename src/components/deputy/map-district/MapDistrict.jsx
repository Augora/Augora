import React, { useEffect, useState } from "react"
// import styled from "styled-components"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import GEOJsonDistrict from "../../../static/list-district.json"
import Block from "../_block/_Block"
import { retirerAccentsFR } from "../../../utils/string-format/accent"
import IconReset from "../../../images/ui-kit/icon-refresh.svg"

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

  return selectedDistrictBox
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
    id: props.nom.toLowerCase() + "-" + props.num + "-fill",
    type: "fill",
    source: {
      type: "geojson",
      data: district,
    },
    layout: {},
    paint: {
      "fill-color": "#fff",
      "fill-opacity": 0.5,
    },
  })
  // Add outline
  map.addLayer({
    id: props.nom.toLowerCase() + "-" + props.num + "-outline",
    type: "line",
    source: {
      type: "geojson",
      data: district,
    },
    paint: {
      "line-color": "#4d4d4d",
      "line-width": 2,
      "line-dasharray": [4, 2],
      "line-opacity": 0.8,
    },
  })
  map.setPadding({ top: 90, left: 40, right: 40, bottom: 40 })
  if (box) {
    setTimeout(() => {
      map.fitBounds(box, {
        padding: 10,
        maxZoom: 11,
        duration: 2000,
      })
    }, 1000)
    setTimeout(() => {
      map.dragPan.enable()
      map.scrollZoom.enable()
    }, 3000)
  }
}

const handleReset = (map, box, setMapModified) => {
  if (map !== null || box.length > 0) {
    map.fitBounds(box, {
      padding: 10,
      maxZoom: 11,
      duration: 2000,
    })
    setMapModified(false)
  }
}

const MapDistrict = (props) => {
  const [map, setMap] = useState(null)
  const [box, setBox] = useState([])
  const [mapModified, setMapModified] = useState(false)
  useEffect(() => {
    setMap(initializeMap(props))
  }, [props])

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
      minZoom: 2,
      interactive: true,
      dragPan: false,
      scrollZoom: false,
      boxZoom: false,
      dragRotate: false,
      doubleClickZoom: false,
      touchZoomRotate: false,
      touchPitch: false,
      // attributionControl: false, //hide bottom right text
    })
    map.addControl(
      new mapboxgl.NavigationControl({
        showCompass: false,
      })
    ) //add zoom buttons
    map.addControl(new mapboxgl.FullscreenControl({}))

    map.on("style.load", () => {
      // Récupérer la circonscription concernée
      const selectedDistrict = GEOJsonDistrict.features.find((district) => {
        return (
          district.properties.nom_dpt.toLowerCase() ===
            retirerAccentsFR(props.nom.toLowerCase()) &&
          parseInt(district.properties.num_circ) === props.num
        )
      })
      const box = getSelectedDistrictBox(map, selectedDistrict, props)
      setBox(box)
    })
    map.on("dragstart", () => {
      setMapModified(true)
    })
    setTimeout(() => {
      map.on("zoomstart", () => {
        setMapModified(true)
      })
    }, 3000)

    return map
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
        <button
          className={`map__container-btn ${mapModified ? "visible" : ""}`}
          onClick={() => handleReset(map, box, setMapModified)}
          title="Réinitialiser la position"
          style={{ zIndex: 1, position: "absolute" }}
        >
          <div className="icon-wrapper">
            <IconReset />
          </div>
        </button>
      </div>
    </Block>
  )
}

export default MapDistrict
