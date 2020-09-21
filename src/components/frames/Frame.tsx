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
    <div
      className={`frame ${props.className ? props.className : ""}`}
      style={props.style ? props.style : null}
    >
      <div
        className={`frame__header ${
          props.className ? props.className + "__header" : ""
        }`}
      >
        <span
          className={`frame__header-title ${
            props.className ? props.className + "__header-title" : ""
          }`}
        >
          {props.title}
        </span>
        {props.center ? (
          <span
            className={`frame__header-center ${
              props.className ? props.className + "__header-center" : ""
            }`}
          >
            {props.center}
          </span>
        ) : null}
        {props.right ? (
          <span
            className={`frame__header-right ${
              props.className ? props.className + "__header-right" : ""
            }`}
          >
            {props.right}
          </span>
        ) : null}
      </div>
      <div
        className={`frame__content ${
          props.className ? props.className + "__content" : ""
        }`}
      >
        {props.children ? props.children : null}
      </div>
    </div>
  )
}
