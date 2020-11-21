import React from "react"
import { Marker } from "react-map-gl"
import { Code, getDeputies, getZoneCode } from "components/maps/maps-utils"
import DeputyImage from "components/deputy/general-information/deputy-image/DeputyImage"

interface IMapPins {
  features: AugoraMap.Feature[]
  deputiesList: AugoraMap.DeputiesList
}

interface IMapPin {
  deputies: AugoraMap.DeputiesList
  coords: AugoraMap.Coordinates
}

interface IMapDeputyPin {
  deputy: AugoraMap.Depute
  coords: AugoraMap.Coordinates
}

function MapDeputyPin({ deputy, coords }: IMapDeputyPin) {
  return (
    <Marker className="pins__marker" longitude={coords[0]} latitude={coords[1]} offsetTop={-82} offsetLeft={-35}>
      <div
        className="pins__deputy"
        style={{
          borderColor: deputy.GroupeParlementaire.Couleur,
          boxShadow: `0px 0px 10px ${deputy.GroupeParlementaire.Couleur}`,
        }}
      >
        <DeputyImage src={deputy.URLPhotoAugora} alt={deputy.Nom} sex={deputy.Sexe} />
      </div>
      <div className="pins__arrowdown pins__arrowdown--deputy" style={{ borderTopColor: deputy.GroupeParlementaire.Couleur }} />
    </Marker>
  )
}

function MapPin({ deputies, coords }: IMapPin) {
  return (
    <Marker className="pins__marker" longitude={coords[0]} latitude={coords[1]} offsetTop={-82} offsetLeft={-35}>
      <div className="pins__number">{deputies.length}</div>
      <div className="pins__arrowdown pins__arrowdown--number" />
    </Marker>
  )
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
        const zoneCode = getZoneCode(feature)

        return zoneCode !== Code.Circ ? (
          <MapPin key={`${index}-${zoneCode}-${feature.properties.nom}`} deputies={deputies} coords={feature.properties.center} />
        ) : (
          deputies[0] && (
            <MapDeputyPin
              key={`${index}-${zoneCode}-${feature.properties.nom_dpt}`}
              deputy={deputies[0]}
              coords={feature.properties.center}
            />
          )
        )
      })}
    </div>
  )
}
