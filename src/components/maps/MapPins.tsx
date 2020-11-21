import React, { useState } from "react"
import { Popup } from "react-map-gl"
import { Code, getDeputies, getZoneCode } from "components/maps/maps-utils"
import DeputyImage from "components/deputy/general-information/deputy-image/DeputyImage"

interface IMapPins {
  features: AugoraMap.Feature[]
  deputiesList: AugoraMap.DeputiesList
  handleClick?: (args?: any) => any
}

interface IMapPin {
  deputies: AugoraMap.DeputiesList
  coords: AugoraMap.Coordinates
  isSolo?: boolean
  onClick?: (args?: any) => any
}

function MapPin({ deputies, coords, onClick, isSolo }: IMapPin) {
  return (
    <Popup className="pins__popup" longitude={coords[0]} latitude={coords[1]} closeButton={false} tipSize={0} anchor={"bottom"}>
      {isSolo ? (
        <>
          <button
            className="pins__deputy"
            style={{
              borderColor: deputies[0].GroupeParlementaire.Couleur,
              boxShadow: `0px 5px 10px ${deputies[0].GroupeParlementaire.Couleur}`,
            }}
            onClick={() => onClick()}
          >
            <DeputyImage src={deputies[0].URLPhotoAugora} alt={deputies[0].Nom} sex={deputies[0].Sexe} />
          </button>
          <div
            className="pins__arrowdown arrowdown__deputy"
            style={{ borderTopColor: deputies[0].GroupeParlementaire.Couleur }}
          />
        </>
      ) : (
        <>
          <button className="pins__number" onClick={() => onClick()}>
            {deputies.length}
          </button>
          <div className="pins__arrowdown arrowdown__number" />
        </>
      )}
    </Popup>
  )
}

/**
 * Renvoie un pin pour chaque zone affichée
 * @param {AugoraMap.Feature[]} features Array des features
 * @param {AugoraMap.DeputiesList} deputiesList Liste des députés à filtrer
 */
export default function MapPins({ features, deputiesList, handleClick }: IMapPins) {
  return (
    <div className="map__pins">
      {features.map((feature, index) => {
        const deputies = getDeputies(feature, deputiesList)
        const zoneCode = getZoneCode(feature)

        return (
          <MapPin
            key={`${index}-${zoneCode}-${feature.properties.nom}`}
            deputies={deputies}
            coords={feature.properties.center}
            isSolo={zoneCode === Code.Circ ? true : false}
            onClick={() => handleClick(feature)}
          />
        )
      })}
    </div>
  )
}
