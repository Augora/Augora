import React from "react"
import Button from "./Button"

type ButtonType = "checkbox" | "radio"

export interface IInput {
  className?: string
  onClick: Function
  style?: object
  color?: string
  children?: React.ReactNode
  type: ButtonType
  checked?: boolean
  name?: string
}

/**
 * Returns a Tooltip in a div tag
 * @param {string} className - Class names
 * @param {Function} onClick - onClick trigger
 * @param {string} [color] - Color of the button
 * @param {React.ReactNode} [children] - Children content
 * @param {boolean} [checked] - Is the button checked
 * @param {ButtonType} [type] - Type of input
 */
export default function Input(props: IInput) {
  return (
    <Button
      className={`${props.className} btn--input btn--${props.type} btn--${props.className.split(' ')[0]} ${
        props.checked ? "checked" : ""
      }`}
      onClick={() => props.onClick()}
      style={{ 
        ...props.style
      }}
      color={props.color}
    >
      <input
        className={`${props.className.split(' ')[0]}__${props.type}`}
        type={props.type}
        checked={props.checked}
        onChange={() => {}}
        name={props.name}
      />
      {props.children}
    </Button>
  )
}
