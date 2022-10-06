import React from "react"
import { Marker } from "react-map-gl"
import IconPin from "images/ui-kit/icon-pin.svg"

interface IMapPin {
  coords: AugoraMap.Coordinates
  color?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

/** Renvoie un popup mapbox avec une icone de pin ou des children custom*/
export default function MapPin({ coords, color, style, children }: IMapPin) {
  return (
    <Marker longitude={coords[0]} latitude={coords[1]} anchor={"bottom"} style={style}>
      {children ? (
        <div className="marker__container">
          <div className="marker__content">{children}</div>
          <div className="marker__arrowdown" />
        </div>
      ) : (
        <div className="icon-wrapper marker__pin">
          <IconPin style={{ fill: color ? color : "" }} />
        </div>
      )}
    </Marker>
  )
}
