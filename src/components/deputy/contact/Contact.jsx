import React, { useState } from "react"
import Block from "../_block/_Block"
import Adresse from "./Adresse"
import IconMail from "images/ui-kit/icon-mail.svg"

const formatAddress = (address, codepostal) => {
  const splitedAddress = address.split(codepostal)
  return [splitedAddress[0], codepostal + splitedAddress[1]]
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
            <Adresse
              adresseDetails={adresseDetails}
              formatedAddress={formatedAddress}
            />
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
