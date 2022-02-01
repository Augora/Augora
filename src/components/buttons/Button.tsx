import React from "react"

export interface IButton extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  onClick: <T>(args?: T) => void
}

/**
 * Returns a button component
 * @param {string} [className] - Class names
 * @param {Function} onClick - onClick trigger
 * @param {string} [color] - Color of the button
 * @param {React.ReactNode} [children] - Children content
 */
export default function Button(props: IButton) {
  const { className, onClick, children, ...restProps } = props

  return (
    <button className={`btn ${className} ${props.color ? "btn--" + props.color : ""}`} onClick={onClick} {...restProps}>
      {children}
    </button>
  )
}
