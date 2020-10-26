import React from "react"

export interface IButton {
  className?: string
  onClick: <T>(args?: T) => void
  style?: React.CSSProperties
  color?: string
  children?: React.ReactNode
  checked?: boolean
  title?: string
}

/**
 * Returns a button component
 * @param {string} className - Class names
 * @param {Function} onClick - onClick trigger
 * @param {string} [color] - Color of the button
 * @param {React.ReactNode} [children] - Children content
 * @param {boolean} [checked] - Is the button checked
 */
export default function Button(props: IButton) {
  return (
    <button
      className={`btn ${props.className} ${
        props.color ? "btn--" + props.color : ""
      }`}
      onClick={props.onClick}
      color={props.color}
      style={{
        ...props.style,
      }}
      title={props.title}
    >
      {props.children}
    </button>
  )
}
