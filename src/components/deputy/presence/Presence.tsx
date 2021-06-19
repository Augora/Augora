import React, { useState } from "react"
import Block from "../_block/_Block"
import PresenceParticipation from "src/components/charts/PresenceParticipation"
import { ParentSize } from "@visx/responsive"

/**
 * Return deputy's presence and participation graph in a Block component
 * @param {*} props
 */

const Presence = (props: Bloc.Presence) => {
  const [HasInformations, setHasInformations] = useState(false)
  return (
    <Block title="Présence et participation" type="presence" color={props.color} size={props.size}>
      <ParentSize debounceTime={400}>
        {(parent) => (
          <PresenceParticipation
            width={parent.width}
            height={parent.height * 0.9}
            data={props.activite}
            color={props.color.HSL.Full}
          />
        )}
      </ParentSize>
    </Block>
  )
}

export default Presence
