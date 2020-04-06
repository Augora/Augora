import React, { useState, useEffect } from "react"
import block, { MyState } from "utils/styled-components/block"
import styled from "styled-components"
import moment from "moment"
import "moment/locale/fr"
import Block from "../_block/_Block"

const Title = styled.h2``

const P = styled.p`
  margin: 0;
`

const DateMandate = styled.p`
  margin: 0;
`

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
        <Title>Mandat en cours</Title>
        <DateMandate>Depuis le {dateToDisplay}</DateMandate>
      </Block>
    )
  } else {
    return (
      <Block>
        <Title>Pas de mandat en cours</Title>
      </Block>
    )
  }
}

export default CurrentMandate
