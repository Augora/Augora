import React, { useState } from "react"
import Block from "../_block/_Block"
import PresenceParticipation from "src/components/charts/PresenceParticipation"
import IconInfo from "images/ui-kit/icon-info.svg"
import IconStat from "images/ui-kit/icon-stat.svg"
import { ParentSize } from "@visx/responsive"

/**
 * Return deputy's presence and participation graph in a Block component
 * @param {*} props
 */

const Presence = (props: Bloc.Presence) => {
  const [HasInformations, setHasInformations] = useState(false)
  return (
    <Block title="Présence et participation" type="presence" color={props.color} size={props.size}>
      <button className="info__button" onClick={() => setHasInformations(!HasInformations)} title="Informations">
        {HasInformations ? <IconStat className={"icon-info"} /> : <IconInfo className={"icon-info"} />}
      </button>
      <ParentSize debounceTime={10}>
        {(parent) =>
          HasInformations ? (
            <div className="info__content">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
              standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a
              type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,
              remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing
              Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </div>
          ) : (
            <PresenceParticipation
              width={parent.width}
              height={parent.height * 0.9}
              data={props.activite}
              color={props.color.HSL.Full}
            />
          )
        }
      </ParentSize>
    </Block>
  )
}

export default Presence
