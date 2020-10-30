import React from "react"
import { Popup } from "react-map-gl"
import { Code, getDeputies, getZoneCode } from "components/maps/maps-utils"
import GroupBar from "components/deputies-list/GroupBar"
import Tooltip from "components/tooltip/Tooltip"

interface IMapTooltip {
  lngLat: [number, number]
  zoneFeature: AugoraMap.Feature
  deputiesList: AugoraMap.DeputiesList
}

/**
 * Renvoie une tooltip dans un component Popup de mapbox
 * @param {[number, number]} lngLat Array de [lgn, lat] pour positionner la popup
 * @param {AugoraMap.Feature} zoneFeature La feature de la zone à analyser
 * @param {AugoraMap.DeputiesList} deputiesList La liste de députés à filtrer
 */
export default function MapTooltip(props: IMapTooltip) {
  const zoneCode = getZoneCode(props.zoneFeature)
  const zoneName = props.zoneFeature.properties.nom
    ? props.zoneFeature.properties.nom
    : `Circonscription n°${props.zoneFeature.properties[Code.Circ]}`
  const deputies = getDeputies(props.zoneFeature, props.deputiesList)

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
      {zoneCode !== Code.Circ ? (
        <Tooltip
          className="map__tooltip"
          title={zoneName}
          nbDeputes={deputies.length}
          totalDeputes={props.deputiesList.length}
        >
          <GroupBar className="map__tooltip-bar" deputiesList={deputies} />
        </Tooltip>
      ) : (
        <Tooltip className="map__tooltip-solo" title={zoneName}>
          {deputies[0] !== undefined ? (
            <>
              <div className="tooltip__nom">
                {deputies[0].Sexe === "F" ? "MME " : "M. "}
                {deputies[0].Nom}
              </div>
              <div
                className="tooltip__groupe"
                style={{
                  color: deputies[0].GroupeParlementaire.Couleur,
                }}
              >
                {deputies[0].GroupeParlementaire.NomComplet}
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
