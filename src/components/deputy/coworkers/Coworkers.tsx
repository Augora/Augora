import React from "react"
import Coworker from "./coworker/Coworker"
import { slugify } from "utils/utils"
import Block from "../_block/_Block"
import IconGroupe from "images/ui-kit/icon-group.svg"

/**
 * Return deputy's coworkers in a Block component
 * @param props
 */
function Coworkers(props: Bloc.Coworkers) {
  const nombreAssistants = props.coworkers.length
  const homme = props.coworkers.map((c) => /^M.\s/.test(c.coworker))
  return (
    <Block
      title={"Assistant" + (nombreAssistants == 0 ? "" : (homme.includes(true) ? "" : "e") + (nombreAssistants > 1 ? "s" : ""))}
      type="coworkers"
      color={props.color}
      size={props.size}
      wip={props.wip ? props.wip : false}
    >
      <div className="icon-wrapper">
        <IconGroupe />
      </div>
      <div className="deputy__coworkers">
        {props.coworkers.map((coworker) => {
          return (
            <Coworker
              key={slugify(coworker.coworker)}
              color={props.color.HSL.Full}
              {...coworker}
              isCompact={props.coworkers.length < 7 ? false : true}
            />
          )
        })}
      </div>
    </Block>
  )
}

export default Coworkers
