import React from "react"
import Coworker from "./coworker/Coworker"
import { slugify } from "utils/utils"
import Block from "../_block/_Block"

/**
 * Return deputy's coworkers in a Block component
 * @param props
 */
function Coworkers(props) {
  return (
    <Block
      title="Assistants"
      type="coworkers"
      color={props.color}
      size={props.size}
      wip={props.wip ? props.wip : false}
    >
      <div className="deputy__coworkers">
        {props.coworkers.map((coworker) => {
          return (
            <Coworker
              key={slugify(coworker.coworker)}
              color={props.color}
              {...coworker}
            />
          )
        })}
      </div>
    </Block>
  )
}

export default Coworkers
