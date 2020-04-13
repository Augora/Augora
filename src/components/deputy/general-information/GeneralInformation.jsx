import React from "react"
import Block from "../_block/_Block"
import IconMale from "images/ui-kit/iconpersontie.svg"
import IconFemale from "images/ui-kit/iconpersonw.svg"

/**
 * Return deputy's general information in a Block component
 * @param {*} props
 */
export default function GeneralInformation(props) {
  return (
    <Block
      className="deputy__block deputy__general"
      title="Informations Générales"
      type="general"
      color={props.color}
      size={props.size}
      wip={props.wip ? props.wip : false}
    >
      <div className="icon-wrapper">
        {props.sexe === "F" ? <IconFemale /> : <IconMale />}
      </div>
      <div className={`block__main general__main`}>
        <div className="main__picture">
          <img src={props.picture} alt={props.id} />
        </div>
        <div className="main__info">
          <img src={props.pictureGroup} alt={props.groupe} />
          <div className="main__age">
            {props.age}
            <div>ans</div>
          </div>
        </div>
      </div>
      <div className="general__job">
        <div className="job">{props.job}</div>
      </div>
    </Block>
  )
}
