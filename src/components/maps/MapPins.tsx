import React from "react"
import { Marker } from "react-map-gl"
import { getPolygonCenter } from "components/maps/maps-utils"
import { ICurrentView } from "components/maps/MapAugora"
import DeputyImage from "components/deputy/general-information/deputy-image/DeputyImage"

interface IMapPin {
  viewData: ICurrentView
}

export default function MapPins({ viewData }: IMapPin) {
  return (
    <>
      {viewData.GEOJson.features.map((feature, index) => {
        const centerCoords = getPolygonCenter(feature)
        const deputy = viewData.zoneDeputies.find((entry) => {
          return entry.NumeroCirconscription == feature.properties.num_circ
        })
        return deputy !== undefined ? (
          <Marker
            key={`${feature.properties.nom_dpt} ${index}`}
            className="map__deputy-pin--marker"
            longitude={centerCoords[0]}
            latitude={centerCoords[1]}
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
        ) : null
      })}
    </>
  )
}
