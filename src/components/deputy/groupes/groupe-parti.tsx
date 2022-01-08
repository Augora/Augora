import React from "react"
import Block from "../_block/_Block"

/**
 * Return deputy's contact info in a Block component
 * @param {*} props
 */
const GroupeEtParti = (props: Bloc.GroupeEtParti) => {
  return (
    <Block title="Groupes et partis" type="groupes" color={props.color} size={props.size} wip={props.wip}>
      <div className="groupes__title" style={{ color: props.color.HSL.Full }}>
        Groupe Parlementaire
      </div>
      <div className="groupes__role" style={{ color: props.color.HSL.Full }}>
        ({props.responsabiliteGroupe})
      </div>
      <div className="groupes__nom" title={props.groupe}>
        <props.photoGroupe />
      </div>

      <div className="rattachement__title" style={{ color: props.color.HSL.Full }}>
        Rattachement financier
      </div>

      {props.photoRattachement != null ? (
        <div className="rattachement__image" title={props.rattachement}>
          <props.photoRattachement />
        </div>
      ) : (
        <div className="rattachement__nom" title={props.rattachement}>
          {props.rattachement.includes("Non déclaré")
            ? props.rattachement.substring(0, props.rattachement.length - 3)
            : props.rattachement}
        </div>
      )}
    </Block>
  )
}

export default GroupeEtParti
