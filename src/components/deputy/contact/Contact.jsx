import React from "react"
import Block from "../_block/_Block"
import IconCopy from "images/ui-kit/iconcopy.svg"
import IconMail from "images/ui-kit/iconmail.svg"

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
        return (
          <>
            <div className="icon-wrapper">
              <IconMail />
            </div>
            <div className="contact__adresse">
              <button
                role="copy"
                onClick={() => handleClick(adresseDetails.Adresse)}
              >
                {
                  formatAddress(
                    adresseDetails.Adresse,
                    adresseDetails.CodePostal
                  )[0]
                }
                <br />
                {
                  formatAddress(
                    adresseDetails.Adresse,
                    adresseDetails.CodePostal
                  )[1]
                }
                <div className="tel__icon icon-wrapper">
                  <IconCopy />
                </div>
              </button>
              {adresseDetails.Telephone ? (
                <a
                  className="contact__tel"
                  href={`tel: ${adresseDetails.Telephone}`}
                >
                  {formatTelephoneNumber(adresseDetails.Telephone)}
                  <div className="tel__icon icon-wrapper">
                    <IconCopy />
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
    </Block>
  )
}

export default Contact
