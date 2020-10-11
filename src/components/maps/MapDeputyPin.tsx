import React from "react"
import { Marker } from "react-map-gl"
import DeputyImage from "../deputy/general-information/deputy-image/DeputyImage"

export default function MapDeputyPin(props) {
  return (
    <Marker
      className="map__deputy-pin--marker"
      longitude={props.lng}
      latitude={props.lat}
      offsetTop={-50}
      offsetLeft={-50}
    >
      <div
        className="map__deputy-pin"
        style={{
          borderColor: props.deputy.GroupeParlementaire.Couleur,
        }}
      >
        <DeputyImage
          src={props.deputy.URLPhotoAugora}
          alt={props.deputy.Nom}
          sex={props.deputy.Sexe}
        />
      </div>
    </Marker>
  )
}
