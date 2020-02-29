import React from "react"
import Block from "../_Block/_Block"

export default function GeneralInformation(props) {
  return (
    <Block
      className="deputy__block deputy__general"
      title="Informations Générales"
    >
      <div className="main">
        <img src={props.picture} alt={props.id} />
        <img src={props.pictureGroup} alt={props.groupe} />
      </div>
      <div className="blocks">
        <div className="age">{props.age}</div>
        <div className="job">{props.job}</div>
      </div>
    </Block>
  )
}
