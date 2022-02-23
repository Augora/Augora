import React from "react"
import Block from "../_block/_Block"

/**
 * Return deputy's commission info in a Block component
 * @param {*} props
 */
const Commission = (props: Bloc.Commission) => {
  const permanente = props.organismes.find((o) => o.Permanente)
  return (
    <Block title="Commission permanente" type="commission" color={props.color} size={props.size} wip={props.wip}>
      <div className="commission__nom">{permanente.OrganismeNom}</div>
      <div className="commission__responsabilite" style={{ color: props.color.HSL.Full }}>
        {permanente.Fonction}
      </div>
    </Block>
  )
}

export default Commission
