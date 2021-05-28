import React from "react"
import Button from "./Button"

export interface IButtonInput
  extends Omit<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, "type"> {
  className: string
  category: string
  type: "checkbox" | "radio"
  onClick: <T>(args?: T) => void
  checked?: boolean
}

/**
 * Returns an input component
 * @param {string} className - Class names
 * @param {Function} onClick - onClick trigger
 * @param {string} [color] - Color of the button
 * @param {React.ReactNode} [children] - Children content
 * @param {boolean} [checked] - Is the button checked
 * @param {ButtonType} [type] - Type of input
 */
export default function ButtonInput(props: IButtonInput) {
  const { className, category, type, checked, name, children, onClick, ...restProps } = props

  return (
    <Button
      className={`${category} ${className} btn--input btn--${props.type} btn--${category} ${props.checked ? "checked" : ""}`}
      onClick={onClick}
      {...restProps}
    >
      <input className={`${category}__${props.type}`} type={type} checked={checked} name={name} />
      {children}
    </Button>
  )
}
