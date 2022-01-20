import React from "react"
import Button from "components/buttons/Button"
import IconMaleSymbol from "images/ui-kit/icon-male.svg"
import IconFemaleSymbol from "images/ui-kit/icon-female.svg"

interface ISexButton {
  sex: "H" | "F"
  onClick(): void
  checked?: boolean
  children?: React.ReactNode
}

/**
 * Renvoie un bouton de genre du filtre, peut recevoir une tooltip en enfant
 * @param {string} sex "H" ou "F"
 * @param {Function} onClick Callback du click
 * @param {boolean} [checked] L'état du bouton
 */
export default function SexButton(props: ISexButton) {
  const { sex, onClick, checked, children } = props
  const gender = sex === "F" ? "female" : "male"

  return (
    <Button
      className={`sexes__btn ${gender} ${checked ? "checked" : ""}`}
      onClick={onClick}
      color={`${sex === "F" ? "main" : "secondary"}`}
    >
      <div className={`sexe__icon--${gender}-symbol icon-wrapper`}>{sex === "F" ? <IconFemaleSymbol /> : <IconMaleSymbol />}</div>
      {children}
    </Button>
  )
}
