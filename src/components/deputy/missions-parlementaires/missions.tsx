import React, { useState } from "react"
import Block from "../_block/_Block"
import Mission from "src/components/deputy/missions-parlementaires/mission/mission"

/**
 * Return deputy's commission info in a Block component
 * @param {*} props
 */
const Missions = (props: Bloc.Missions) => {
  const nomsMissions = [
    "Développement durable et aménagement du territoire",
    "Commission du développement durable et de l'aménagement du territoire",
    "Commission spéciale chargée d'examiner le projet de loi portant lutte contre le dérèglement climatique et renforcement de la résilience face à ses effets",
    "Mission d'information sur le secteur coopératif dans le domaine agricole",
    "Mission d'information sur l'aide au développement : quelles nouvelles approches pour l'aide française au développement",
  ]
  const [IndexMission, setIndexMission] = useState(0)

  return (
    <Block title="Missions parlementaires" type="missions" color={props.color} size={props.size} wip={props.wip}>
      <div className="missions__groupe">
        {nomsMissions.map((mission, i) => {
          return (
            <>
              {i >= IndexMission && i < IndexMission + 3 ? (
                <Mission key={`${mission}-${i}`} color={props.color.HSL.Full} nom={mission} />
              ) : (
                ""
              )}
            </>
          )
        })}
      </div>
      <div className="missions__boutons">
        <button
          name={"Précédent"}
          onClick={() => {
            IndexMission != 0 ? setIndexMission(IndexMission - 1) : ""
          }}
          className={"missions__precedent"}
          style={{ borderColor: props.color.HSL.Full, color: props.color.HSL.Full }}
        >
          {"<"}
        </button>
        <button
          name={"Suivant"}
          onClick={() => {
            IndexMission != nomsMissions.length - 3 ? setIndexMission(IndexMission + 1) : ""
          }}
          className={"missions__suivant"}
          style={{ borderColor: props.color.HSL.Full, color: props.color.HSL.Full }}
        >
          {">"}
        </button>
      </div>
    </Block>
  )
}

export default Missions
