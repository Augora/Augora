import React from "react"
import Coworker from "./Coworker/Coworker"
import { slugify } from "Utils/utils"
import Block from "../_Block/_Block"

// use it to resize the box as you wish, maybe with default values ?
interface CssValues {}

// export interface ICoworkers {
//   coworkers: Array<ICoworker>
// }

function Coworkers(props) {
  return (
    <Block
      className="deputy__block deputy__coworkers"
      title="Assistants"
      type="coworkers"
      color={props.color}
    >
      <div className="deputy__coworkers">
        {props.coworkers.map(coworker => {
          return <Coworker key={slugify(coworker.coworker)} {...coworker} />
        })}
      </div>
    </Block>
  )
}

export default Coworkers
