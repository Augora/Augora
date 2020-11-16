import React, { useState } from "react"
import moment from "moment"
import Block from "../_block/_Block"

/**
 * Return deputy's current mandate in a Block component
 * @param props
 */
export function CurrentMandate(props) {
  const [blockSize, setBlockSize] = useState("block")
  moment.locale("fr")
  const dateToDisplay = moment(props.dateBegin).format("Do MMMM YYYY")

  if (props.isInMandate === true) {
    return (
      <Block>
        <h2>Mandat en cours</h2>
        <p style={{ margin: 0 }}>Depuis le {dateToDisplay}</p>
      </Block>
    )
  } else {
    return (
      <Block>
        <h2>Pas de mandat en cours</h2>
      </Block>
    )
  }
}

export default CurrentMandate
