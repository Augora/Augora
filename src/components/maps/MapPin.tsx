import React from "react"
import { Marker } from "react-map-gl"
import { getCSSColor } from "utils/style/color"

interface IMapPin {
  coords: AugoraMap.Coordinates
  color?: Color.Any
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
          <svg version="1.1" id="Pin" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 500 500">
            <path
              id="Path"
              d="M421.45,180.85c0,131.6-163.89,310.36-171.18,310.36c-7.84,0-171.18-178.76-171.18-310.36
              	c0-94.54,76.64-171.18,171.18-171.18S421.45,86.31,421.45,180.85z"
              style={{ fill: color ? getCSSColor(color) : "" }}
            />
            <circle
              id="Circle"
              className="st0"
              cx="250.27"
              cy="180.85"
              r="82.47"
              style={{ opacity: color && typeof color !== "string" ? color.A : "", fill: "white" }}
            />
          </svg>
        </div>
      )}
    </Marker>
  )
}
