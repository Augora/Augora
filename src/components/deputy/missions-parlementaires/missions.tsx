import React, { useState } from "react"
import Block from "../_block/_Block"
import Mission from "src/components/deputy/missions-parlementaires/mission/mission"
import FAQLink from "src/components/faq/Liens-faq"

/**
 * Return deputy's commission info in a Block component
 * @param {*} props
 */
const Missions = (props: Bloc.Organismes) => {
  const [IndexMission, setIndexMission] = useState(0)
  const nombreMission = props.organismes.length < 3 ? props.organismes.length : 3

  return (
    <Block
      title="Missions parlementaires"
      type="missions"
      color={props.color}
      size={props.size}
      wip={props.wip}
      info={
        <>
          <p>
            Les missions parlementaires regroupent différentes actions qu'un député doit effectuer. On y retrouve les{" "}
            {
              <FAQLink link={"quest-ce-quun-groupe-detude"} colorHSL={props.color.HSL.Full}>
                groupes d'études
              </FAQLink>
            }
            , les{" "}
            {
              <FAQLink link={"quest-ce-quune-mission-dinformation"} colorHSL={props.color.HSL.Full}>
                missions d'information
              </FAQLink>
            }{" "}
            ,{" "}
            {
              <FAQLink link={"quest-ce-quune-commission-denquete"} colorHSL={props.color.HSL.Full}>
                commissions d'enquête
              </FAQLink>
            }{" "}
            ou les{" "}
            {
              <FAQLink link={"quest-ce-quune-commission-parlementaire"} colorHSL={props.color.HSL.Full}>
                commissions parlementaires
              </FAQLink>
            }
            .
          </p>
        </>
      }
    >
      <div className="missions__groupe">
        {props.organismes.map((mission, i) => {
          return (
            <>
              {i >= IndexMission && i < IndexMission + nombreMission && !mission.Permanente ? (
                <Mission
                  key={`${mission}-${i}`}
                  color={props.color.HSL.Full}
                  nom={mission.OrganismeNom}
                  fonction={mission.Fonction}
                />
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
            IndexMission != props.organismes.length - nombreMission ? setIndexMission(IndexMission + 1) : ""
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
