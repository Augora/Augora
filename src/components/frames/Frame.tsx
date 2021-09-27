import React from "react"

export interface IFrame {
  children?: React.ReactNode
  title: string
  right?: string
  center?: string
  className?: string
  style?: object
}

/**
 * Renders an Augora grey frame containing the children passed to it
 * @param {string} title The title of the frame displayed on the upper left corner
 * @param {string} [right] Optional right text of the framer header
 * @param {string} [center] Optional center text of the framer header
 * @param {string} [className] Optional class-name HTML overload
 * @param {object} [style] Optional style CSS object
 */
export default function Frame(props: IFrame) {
  return (
    <div className={`frame ${props.className ? props.className : ""}`} style={props.style ? props.style : null}>
      <div className="frame__header">
        <span className="header__title">{props.title}</span>
        {props.center && <span className="header__center">{props.center}</span>}
        {props.right && <span className="header__right">{props.right}</span>}
      </div>
      <div className="frame__content">{props.children ? props.children : null}</div>
    </div>
  )
}
