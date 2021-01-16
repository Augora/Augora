import React from "react"
import Block from "../_block/_Block"

interface IPresence {
  color: string
  size?: string
  wip?: boolean
}

/**
 * Return deputy's presence and participation graph in a Block component
 * @param {*} props
 */
const Presence = (props: IPresence) => {
  console.log(props)

  return (
    <Block
      title="Présence et participation"
      type="presence"
      color={props.color}
      size={props.size}
      wip={props.wip ? props.wip : false}
    >
      Je suis un graph
    </Block>
  )
}

export default Presence
