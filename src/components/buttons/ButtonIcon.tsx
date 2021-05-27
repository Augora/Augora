import React from "react"
import Button from "./Button"

/**
 * Construct a type with the properties in both A and B that have the same type
 *
 * Loses optionality in the process
 */
type Common<A, B> = Pick<
  A,
  {
    [K in keyof A & keyof B]: A[K] extends B[K] ? K : never
  }[keyof A & keyof B]
>

type AnchorProps = React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
type BtnProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

export interface IButtonIcon extends Partial<Omit<Common<AnchorProps, BtnProps>, "onClick">> {
  /** Soit une fonction, soit une URL */
  onClick: (<T>(args?: T) => void) | string
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
 * @param {ButtonType} [type] - Type of input
 */
export default function ButtonIcon(props: IButtonIcon) {
  const { className, target, deactivated, children, onClick, ...restProps } = props
  const classNames = `${className} btn--icon ${deactivated ? "btn--deactivated" : ""}`
  if (typeof onClick === "string") {
    return (
      <a href={onClick} className={`btn ${classNames}`} title={props.title} target={onClick ? target : ""} {...restProps}>
        {children}
      </a>
    )
  } else {
    return (
      <Button className={`${classNames} btn--${className.split(" ")[0]}`} onClick={onClick} {...restProps}>
        {children}
      </Button>
    )
  }
}
