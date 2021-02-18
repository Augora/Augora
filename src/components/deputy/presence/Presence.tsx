import React from "react"
import Block from "../_block/_Block"
import PresenceParticipation from "src/components/charts/PresenceParticipation"
import IconStat from "images/ui-kit/icon-stat.svg"

/**
 * Return deputy's presence and participation graph in a Block component
 * @param {*} props
 */

const Presence = (props: Bloc.Presence) => {
  return (
    <Block title="Présence et participation" type="presence" color={props.color} size={props.size}>
      <PresenceParticipation width={1000} height={300} data={props.activite} mediane={props.mediane} color={props.color} />
      <div className="icon-wrapper">
        <IconStat />
      </div>
    </Block>
  )
}

export default Presence
