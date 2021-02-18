import React from "react"
import Block from "../_block/_Block"
import PresenceParticipation from "src/components/charts/PresenceParticipation"

/**
 * Return deputy's presence and participation graph in a Block component
 * @param {*} props
 */

const Presence = (props: Bloc.Presence) => {
  return (
    <Block title="Présence et participation" type="presence" color={props.color} size={props.size}>
      <PresenceParticipation width={1000} height={300} data={props.activite} mediane={props.mediane} color={props.color} />
    </Block>
  )
}

export default Presence
