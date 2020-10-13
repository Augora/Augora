import React, { useState } from "react"
import Tooltip from "../../tooltip/Tooltip"
import IconCopy from "images/ui-kit/icon-copy.svg"
import IconTel from "images/ui-kit/icon-phone.svg"

const formatTelephoneNumber = (number) => {
  return number.match(/.{1,2}/g).join(" ")
}

const handleClick = (content, setCopyClicked) => {
  navigator.clipboard.writeText(content)
  setCopyClicked(true)
  setTimeout(() => {
    setCopyClicked(false)
  }, 1500)
}

export default function Adresse(props) {
  const [copyClicked, setCopyClicked] = useState(false)

  return (
    <div className="contact__adresse">
      <button
        onClick={() =>
          handleClick(props.adresseDetails.Adresse, setCopyClicked)
        }
        title="Copier"
      >
        <Tooltip
          className={`copy-tooltip ${
            copyClicked ? "copy-tooltip--visible" : ""
          }`}
        >
          <span>Copié !</span>
        </Tooltip>
        <p className="adresse__street">{props.formatedAddress[0]}</p>
        <p className="adresse__city">{props.formatedAddress[1]}</p>
        <div className="copy__icon icon-wrapper">
          <IconCopy />
        </div>
      </button>
      {props.adresseDetails.Telephone ? (
        <a
          className="contact__tel"
          href={`tel: ${props.adresseDetails.Telephone}`}
          title="Appeler le numéro"
        >
          {formatTelephoneNumber(props.adresseDetails.Telephone)}
          <div className="tel__icon icon-wrapper">
            <IconTel />
          </div>
        </a>
      ) : null}
    </div>
  )
}
