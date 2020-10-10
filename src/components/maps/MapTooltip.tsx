import React from "react"
import Tooltip from "../tooltip/Tooltip"
import { Marker } from "react-map-gl"

interface IMapTooltip {
  lngLat: [number, number]
  zoneName: string
  nbDeputes?: number
  totalDeputes?: number
}

export default function MapTooltip(props: IMapTooltip) {
  return (
    <Marker
      longitude={props.lngLat[0]}
      latitude={props.lngLat[1]}
      offsetTop={40}
    >
      {props.nbDeputes ? (
        <Tooltip
          title={props.zoneName}
          nbDeputes={props.nbDeputes}
          totalDeputes={props.totalDeputes}
        />
      ) : (
        <Tooltip title={props.zoneName} nbDeputes={0} totalDeputes={0} />
      )}
    </Marker>
  )
}
