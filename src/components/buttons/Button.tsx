import React from "react"

export interface IButton {
  className?: string
  onClick(): Function
  style?: object
  color?: string
  children?: React.ReactNode
  checked?: boolean
}

/**
 * Returns a Tooltip in a div tag
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
      style={{
        ...props.style,
      }}
    >
      {props.children}
    </button>
  )
}
