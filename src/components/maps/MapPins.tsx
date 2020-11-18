import React from "react"
import { Marker } from "react-map-gl"
import { getDeputies, getZoneCode } from "components/maps/maps-utils"
import DeputyImage from "components/deputy/general-information/deputy-image/DeputyImage"

interface IMapPins {
  features: AugoraMap.Feature[]
  deputiesList: AugoraMap.DeputiesList
}

interface IMapPin {
  deputies: AugoraMap.DeputiesList
  coords: AugoraMap.Coordinates
}

function MapPin({ deputies, coords }: IMapPin) {
  return deputies.length ? (
    deputies.length === 1 ? (
      <Marker className="pins__marker" longitude={coords[0]} latitude={coords[1]} offsetTop={-38} offsetLeft={-38}>
        <div
          className="pins__deputy"
          style={{
            borderColor: deputies[0].GroupeParlementaire.Couleur,
          }}
        >
          <DeputyImage src={deputies[0].URLPhotoAugora} alt={deputies[0].Nom} sex={deputies[0].Sexe} />
        </div>
      </Marker>
    ) : (
      <Marker className="pins__marker" longitude={coords[0]} latitude={coords[1]} offsetTop={-35} offsetLeft={-35}>
        <div className="pins__number">{deputies.length}</div>
      </Marker>
    )
  ) : null
}

/**
 * Renvoie un pin pour chaque zone affichée
 * @param {AugoraMap.Feature[]} features Array des features
 * @param {AugoraMap.DeputiesList} deputiesList Liste des députés à filtrer
 */
export default function MapPins({ features, deputiesList }: IMapPins) {
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
