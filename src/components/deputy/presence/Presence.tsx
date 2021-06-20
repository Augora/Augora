import React, { useState } from "react"
import Block from "../_block/_Block"
import PresenceParticipation from "src/components/charts/PresenceParticipation"
import { ParentSize } from "@visx/responsive"
import { orderBy } from "lodash"
import PresenceHeader from "./Presence-header"

/**
 * Return deputy's presence and participation graph in a Block component
 * @param {*} props
 */

const Presence = (props: Bloc.Presence) => {
  const orderedWeeks = orderBy(props.activite, "DateDeFin")
  const [RangeOrderedWeeks, setRangeOrderedWeeks] = useState(orderedWeeks)

  return (
    <Block title="Présence et participation" type="presence" color={props.color} size={props.size}>
      <ParentSize debounceTime={400}>
        {(parent) => (
          <>
            <div className="presence">
              <PresenceHeader width={parent.width} data={orderedWeeks} setRange={setRangeOrderedWeeks} />
              <PresenceParticipation
                width={parent.width}
                height={parent.height * 0.9}
                data={orderedWeeks}
                slicedData={RangeOrderedWeeks}
                color={props.color.HSL.Full}
              />
            </div>
          </>
        )}
      </ParentSize>
    </Block>
  )
}

export default Presence
