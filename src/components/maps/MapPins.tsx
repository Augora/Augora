import React from "react"
import { Marker } from "react-map-gl"
import { getDeputies, getZoneCode } from "components/maps/maps-utils"
import DeputyImage from "components/deputy/general-information/deputy-image/DeputyImage"

interface IMapPin {
  features: AugoraMap.Feature[]
  deputiesList: AugoraMap.DeputiesList
}

function MapPin({ deputies, coords }) {
  return (
    deputies[0] !== undefined && (
      <Marker className="map__pins--marker" longitude={coords[0]} latitude={coords[1]} offsetTop={-50} offsetLeft={-50}>
        {deputies.length === 1 ? (
          <div
            className="map__deputy-pin"
            style={{
              borderColor: deputies[0].GroupeParlementaire.Couleur,
            }}
          >
            <DeputyImage src={deputies[0].URLPhotoAugora} alt={deputies[0].Nom} sex={deputies[0].Sexe} />
          </div>
        ) : (
          <div className="map__number-pin">{deputies.length}</div>
        )}
      </Marker>
    )
  )
}

/**
 * Renvoie un pin pour chaque zone affichée
 * @param {ICurrentView} viewData Le state currentView
 * @param {AugoraMap.DeputiesList} deputiesList Liste des députés à filtrer
 */
export default function MapPins({ features, deputiesList }: IMapPin) {
  return (
    <div className="map__pins">
      {features.map((feature, index) => {
        const deputies = getDeputies(feature, deputiesList)
        return (
          <MapPin
            key={`${index}-${getZoneCode(feature)}-${
              feature.properties.nom ? feature.properties.nom : feature.properties.nom_dpt
            }`}
            deputies={deputies}
            coords={feature.properties.center}
          />
        )
      })}
    </div>
  )
}
