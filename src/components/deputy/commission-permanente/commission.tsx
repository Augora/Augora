import React from "react"
import Block from "../_block/_Block"

/**
 * Return deputy's commission info in a Block component
 * @param {*} props
 */
const Commission = (props: Bloc.Commission) => {
  return (
    <Block title="Commission permanente" type="commission" color={props.color} size={props.size} wip={props.wip}>
      <div className="commission__nom">{props.nomCommission}</div>
      <div className="commission__responsabilite" style={{ color: props.color.HSL.Full }}>
        {props.responsabiliteCommission}
      </div>
    </Block>
  )
}

export default Commission
