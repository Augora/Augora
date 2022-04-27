import React from "react"
import Block from "../_block/_Block"
import FAQLink from "components/faq/Liens-faq"

/**
 * Return deputy's commission info in a Block component
 * @param {*} props
 */
const Commission = (props: Bloc.Organismes) => {
  const permanente = props.organismes.find((o) => o.Permanente)
  return (
    <Block
      title="Commission permanente"
      type="commission"
      color={props.color}
      size={props.size}
      wip={props.wip}
      info={
        <>
          <p>
            Une commission est un groupe de députés spécialisé dans un domaine. Une commission parmenante est un cas particulier
            d'une{" "}
            {
              <FAQLink link={"quest-ce-quune-commission-parlementaire"} colorHSL={props.color.HSL.Full}>
                commission parlementaire
              </FAQLink>
            }
            .
            <br />
            <br />
            Tous les groupes parlementaires sont représentés dans chaque commission permanente de façon proportionnelle. Un député
            ne peut appartenir qu'à une seule commission permanente.
          </p>
        </>
      }
    >
      <div className="commission__nom">{permanente.OrganismeNom}</div>
      <div className="commission__responsabilite" style={{ color: props.color.HSL.Full }}>
        {permanente.Fonction}
      </div>
    </Block>
  )
}

export default Commission
