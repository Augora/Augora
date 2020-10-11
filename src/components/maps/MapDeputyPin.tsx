import React from "react"
import { Marker } from "react-map-gl"

export default function MapDeputiesPins(props) {
  return (
    <Marker longitude={props.lng} latitude={props.lat}>
      <div style={{ height: 30, width: 30, background: "blue" }} />
    </Marker>
  )
}
