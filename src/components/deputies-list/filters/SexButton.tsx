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
