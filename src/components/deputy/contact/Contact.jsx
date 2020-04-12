import React from "react"
import Block from "../_block/_Block"

/**
 * Return deputy's contact info in a Block component
 * @param {*} props
 */
const Contact = (props) => {
  console.log(props)
  return (
    <Block
      title="Contact"
      type="contact"
      color={props.color}
      size={props.size}
      wip={props.wip ? props.wip : false}
    >
      {props.adresses.map((adresseDetails) => (
        <div className="contact__adresse">
          <p>{adresseDetails.Adresse}</p>
          <p>{adresseDetails.CodePostal}</p>
          <p className="contact__tel">{adresseDetails.Telephone}</p>
        </div>
      ))}
    </Block>
  )
}

export default Contact
