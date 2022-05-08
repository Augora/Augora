import React from "react"
import { Popup } from "react-map-gl"
import IconPin from "images/ui-kit/icon-pin.svg"

interface IMapPin {
  coords: AugoraMap.Coordinates
  color?: string
  children?: React.ReactNode
}

/** Renvoie un popup mapbox avec une icone de pin ou des children custom*/
export default function MapPin({ coords, color, children }: IMapPin) {
  return (
    <Popup
      className="map__popup"
      longitude={coords[0]}
      latitude={coords[1]}
      closeButton={false}
      anchor={"bottom"}
      closeOnClick={false}
    >
      {children ? (
        children
      ) : (
        <div className="icon-wrapper">
          <IconPin style={{ fill: color }} />
        </div>
      )}
    </Popup>
  )
}
