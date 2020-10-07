import React, { useState } from "react"
import SimpleTooltip from "../../tooltip/SimpleTooltip"
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
    <div className="contact__adresse" key={`adresse-${props.index}`}>
      <button
        onClick={() =>
          handleClick(props.adresseDetails.Adresse, setCopyClicked)
        }
        title="Copier"
      >
        <SimpleTooltip content="Copié !" wasClicked={copyClicked} />
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
      {/* Separator */}
      {props.separator ? <div className="contact__separator"></div> : null}
    </div>
  )
}
