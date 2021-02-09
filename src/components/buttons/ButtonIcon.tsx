import React from "react"
import Button from "./Button"

export interface IButtonIcon {
  className?: string
  /** Soit une fonction, soit une URL */
  onClick: (<T>(args?: T) => void) | string
  style?: React.CSSProperties
  color?: string
  children?: React.ReactNode
  checked?: boolean
  name?: string
  title?: string
  target?: string
  deactivated?: boolean
}

/**
 * Returns an input component
 * @param {string} className - Class names
 * @param {string} href - Must contain href or...
 * @param {Function} onClick - ... must contain onClick
 * @param {string} [color] - Color of the button
 * @param {React.ReactNode} [children] - Children content
 * @param {boolean} [checked] - Is the button checked
 * @param {ButtonType} [type] - Type of input
 */
export default function ButtonIcon(props: IButtonIcon) {
  const classNames = `${props.className} btn--icon ${props.deactivated ? "btn--deactivated" : ""}`
  if (typeof props.onClick === "string") {
    return (
      <a href={props.onClick} className={`btn ${classNames}`} title={props.title} target={props.onClick ? props.target : ""}>
        {props.children}
      </a>
    )
  } else {
    return (
      <Button
        className={`${classNames} btn--${props.className.split(" ")[0]}`}
        onClick={props.onClick}
        title={props.title}
        style={{
          ...props.style,
        }}
        color={props.color}
      >
        {props.children}
      </Button>
    )
  }
}
