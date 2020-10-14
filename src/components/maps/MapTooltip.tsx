import React from "react"
import { Popup } from "react-map-gl"
import {
  ZoneCode,
  FranceZoneFeature,
  getZoneCodeFromFeature,
} from "./maps-utils"
import Tooltip from "components/tooltip/Tooltip"

interface IMapTooltip {
  lngLat: [number, number]
  zoneFeature: FranceZoneFeature
  deputiesArray: { [key: string]: any }[]
  totalDeputes: number
}

export default function MapTooltip(props: IMapTooltip) {
  const zoneCode = getZoneCodeFromFeature(props.zoneFeature)
  const zoneName = props.zoneFeature.properties.nom
    ? props.zoneFeature.properties.nom
    : `Circonscription n°${props.zoneFeature.properties.num_circ}`

  return (
    <Popup
      className="map__tooltip--popup"
      longitude={props.lngLat[0]}
      latitude={props.lngLat[1]}
      closeButton={false}
      tipSize={0}
      anchor={"top-left"}
      offsetTop={20}
    >
      {zoneCode !== ZoneCode.Circonscriptions ? (
        <Tooltip
          className="map__tooltip"
          title={zoneName}
          nbDeputes={props.deputiesArray.length}
          totalDeputes={props.totalDeputes}
        />
      ) : (
        <Tooltip className="map__tooltip-solo" title={zoneName}>
          {props.deputiesArray[0] !== undefined ? (
            <>
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
            </>
          ) : (
            <div className="tooltip__nom">Pas de député trouvé</div>
          )}
        </Tooltip>
      )}
    </Popup>
  )
}
