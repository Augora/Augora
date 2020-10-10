import React from "react"
import Tooltip from "../tooltip/Tooltip"
import { Marker } from "react-map-gl"

interface IMapTooltip {
  lngLat: [number, number]
  zoneName: string
  deputiesArray: any[]
  totalDeputes: number
}

export default function MapTooltip(props: IMapTooltip) {
  return (
    <Marker
      longitude={props.lngLat[0]}
      latitude={props.lngLat[1]}
      offsetTop={40}
    >
      {props.deputiesArray.length > 1 ? (
        <Tooltip
          className="map__tooltip"
          title={props.zoneName}
          nbDeputes={props.deputiesArray.length}
          totalDeputes={props.totalDeputes}
        />
      ) : (
        <Tooltip className="map__tooltip-solo" title={props.zoneName}>
          <div className="tooltip__nom">
            {props.deputiesArray[0].Sexe === "F" ? "MME " : "M. "}
            {props.deputiesArray[0].Nom}
          </div>
          <div
            className="tooltip__groupe"
            style={{
              color: props.deputiesArray[0].GroupeParlementaire.Couleur,
            }}
          >
            {props.deputiesArray[0].GroupeParlementaire.NomComplet}
          </div>
          <div className="tooltip__savoirplus">
            Cliquer pour en savoir plus...
          </div>
        </Tooltip>
      )}
    </Marker>
  )
}
