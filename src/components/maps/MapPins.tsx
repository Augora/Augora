import React from "react"
import { Marker } from "react-map-gl"
import {
  getDeputies,
  getPolygonCenter,
  ZoneCode,
} from "components/maps/maps-utils"
import { ICurrentView } from "components/maps/MapAugora"
import DeputyImage from "components/deputy/general-information/deputy-image/DeputyImage"

interface IMapPin {
  viewData: ICurrentView
}

function MapNumberPin({ number, coords }) {
  return (
    <Marker
      className="map__pins--marker"
      longitude={coords[0]}
      latitude={coords[1]}
      offsetTop={-40}
      offsetLeft={-40}
    >
      <div className="map__number-pin">{number}</div>
    </Marker>
  )
}

function MapDeputyPin({ deputy, coords }) {
  return (
    <Marker
      className="map__pins--marker"
      longitude={coords[0]}
      latitude={coords[1]}
      offsetTop={-50}
      offsetLeft={-50}
    >
      <div
        className="map__deputy-pin"
        style={{
          borderColor: deputy.GroupeParlementaire.Couleur,
        }}
      >
        <DeputyImage
          src={deputy.URLPhotoAugora}
          alt={deputy.Nom}
          sex={deputy.Sexe}
        />
      </div>
    </Marker>
  )
}

export default function MapPins({ viewData }: IMapPin) {
  return (
    <div className="map__pins">
      {viewData.GEOJson.features.map((feature, index) => {
        const centerCoords = getPolygonCenter(feature)
        const deputies = getDeputies(feature, viewData.zoneDeputies)

        if (viewData.zoneCode === ZoneCode.Circonscriptions) {
          return deputies[0] ? (
            <MapDeputyPin
              key={`${feature.properties.nom_dpt} ${index}`}
              deputy={deputies[0]}
              coords={centerCoords}
            />
          ) : null
        } else {
          return (
            <MapNumberPin
              key={`${feature.properties.nom} ${index}`}
              number={deputies.length}
              coords={centerCoords}
            />
          )
        }
      })}
    </div>
  )
}
