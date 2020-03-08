import React from "react"
import Coworker from "./Coworker/Coworker"
import { slugify } from "Utils/utils"
import Block from "../_Block/_Block"

function Coworkers(props) {
  return (
    <Block title="Assistants" type="coworkers" color={props.color}>
      <div className="deputy__coworkers">
        {props.coworkers.map(coworker => {
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
