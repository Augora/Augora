import React from "react"
import Block from "../_block/_Block"
import IconCopy from "images/ui-kit/icon-copy.svg"
import IconTel from "images/ui-kit/icon-phone.svg"
import IconMail from "images/ui-kit/icon-mail.svg"

const formatAddress = (address, codepostal) => {
  const splitedAddress = address.split(codepostal)
  return [splitedAddress[0], codepostal + splitedAddress[1]]
}
const formatTelephoneNumber = (number) => {
  return number.match(/.{1,2}/g).join(" ")
}

const handleClick = (content) => {
  navigator.clipboard.writeText(content)
}

/**
 * Return deputy's contact info in a Block component
 * @param {*} props
 */
const Contact = (props) => {
  return (
    <Block
      title="Contact"
      type="contact"
      color={props.color}
      size={props.size}
      wip={props.wip ? props.wip : false}
    >
      {props.adresses.map((adresseDetails, index, array) => {
        const formatedAddress = formatAddress(
          adresseDetails.Adresse,
          adresseDetails.CodePostal
        )
        return (
          <>
            <div className="contact__adresse">
              <button
                onClick={() => handleClick(adresseDetails.Adresse)}
                title="Copier"
              >
                <p>{formatedAddress[0]}</p>
                <p>{formatedAddress[1]}</p>
                <div className="copy__icon icon-wrapper">
                  <IconCopy />
                </div>
              </button>
              {adresseDetails.Telephone ? (
                <a
                  className="contact__tel"
                  href={`tel: ${adresseDetails.Telephone}`}
                  title="Appeler le numéro"
                >
                  {formatTelephoneNumber(adresseDetails.Telephone)}
                  <div className="tel__icon icon-wrapper">
                    <IconTel />
                  </div>
                </a>
              ) : null}
            </div>
            {index + 1 < array.length ? (
              <div className="contact__separator"></div>
            ) : null}
          </>
        )
      })}
      <div className="icon-wrapper">
        <IconMail />
      </div>
    </Block>
  )
}

export default Contact
