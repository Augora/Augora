import React from "react"
import Button from "components/buttons/Button"
import IconReset from "images/ui-kit/icon-refresh.svg"

interface IResetButton extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  onClick(): void
}

export default function ResetButton(props: IResetButton) {
  const { onClick, className = "reset__btn", title = "Réinitialiser les filtres", ...restProps } = props

  return (
    <Button className={className} title={title} onClick={() => onClick()} {...restProps}>
      <div className="icon-wrapper">
        <IconReset />
      </div>
    </Button>
  )
}
