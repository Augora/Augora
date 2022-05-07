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
  const nombreMission = props.organismes.length

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
            <br />
            <br />
            Une commission est un groupe de députés spécialisé dans un domaine. Une commission parmenante est un cas particulier
            d'une{" "}
            {
              <FAQLink link={"quest-ce-quune-commission-parlementaire"} colorHSL={props.color.HSL.Full}>
                commission parlementaire
              </FAQLink>
            }
            . Tous les groupes parlementaires sont représentés dans chaque commission permanente de façon <b>proportionnelle</b>.
            Un député ne peut appartenir qu'à une seule commission permanente.
          </p>
        </>
      }
    >
      <div className="missions__groupe">
        <Mission
          key={`mission-${IndexMission}`}
          color={props.color.HSL.Full}
          nom={props.organismes[IndexMission].OrganismeNom}
          fonction={props.organismes[IndexMission].Fonction}
          permanente={props.organismes[IndexMission].Permanente}
        />
      </div>
      {nombreMission > 1 ? (
        <>
          <div className="missions__circles">
            {props.organismes.map((o, i) => {
              return (
                <button
                  key={`circle-${i}`}
                  name={`circle-${i}`}
                  onClick={() => {
                    setIndexMission(i)
                  }}
                  className={`circle`}
                  style={{
                    border: `2px solid ${props.color.RGB.Full}`,
                    color: props.color.HSL.Full,
                    backgroundColor: i == IndexMission ? props.color.HSL.Full : "unset",
                  }}
                />
              )
            })}
          </div>
          <div className="missions__boutons">
            <button
              key={"Précédent"}
              name={"Précédent"}
              onClick={() => {
                IndexMission != 0 ? setIndexMission(IndexMission - 1) : null
              }}
              className={`missions__precedent`}
              style={{ border: `2px solid ${props.color.RGB.Full}`, color: props.color.HSL.Full }}
            >
              {"<"}
            </button>
            <button
              key={"Suivant"}
              name={"Suivant"}
              onClick={() => {
                IndexMission == props.organismes.length - 1 ? null : setIndexMission(IndexMission + 1)
              }}
              className={`missions__suivant`}
              style={{ border: `2px solid ${props.color.RGB.Full}`, color: props.color.HSL.Full }}
            >
              {">"}
            </button>
          </div>
        </>
      ) : null}
    </Block>
  )
}

export default Missions
