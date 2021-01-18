import React, { useState } from "react"
import dayjs from "dayjs"
import "dayjs/locale/fr"
dayjs.locale("fr")

import Block from "../_block/_Block"

/**
 * Return deputy's current mandate in a Block component
 * @param props
 */
export function CurrentMandate(props) {
  const [blockSize, setBlockSize] = useState("block")
  const dateToDisplay = dayjs(props.dateBegin).format("Do MMMM YYYY")

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
