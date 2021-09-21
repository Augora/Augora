import React from "react"
import { Popup } from "react-map-gl"
import IconPin from "images/ui-kit/icon-pin.svg"

interface IMapPin {
  long: number
  lat: number
  color?: string
  children?: React.ReactNode
}

/** Renvoie un popup mapbox avec une icone de pin */
export default function MapPin({ long, lat, color, children }: IMapPin) {
  return (
    <Popup
      className="map__popup"
      longitude={long}
      latitude={lat}
      closeButton={false}
      tipSize={0}
      anchor={"bottom"}
      dynamicPosition={false}
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
