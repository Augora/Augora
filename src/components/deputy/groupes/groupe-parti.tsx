import React from "react"
import Block from "../_block/_Block"
import Image from "next/image"
import FAQLink from "components/faq/Liens-faq"

/**
 * Return deputy's contact info in a Block component
 * @param {*} props
 */
const GroupeEtParti = (props: Bloc.GroupeEtParti) => {
  return (
    <Block
      title="Groupes et partis"
      type="groupe"
      color={props.color}
      size={props.size}
      wip={props.wip}
      info={
        <p>
          Un{" "}
          {
            <FAQLink link={"quest-ce-quun-groupe-parlementaire"} colorHSL={props.color.HSL.Full}>
              groupe parlementaire
            </FAQLink>
          }{" "}
          est un ensemble de députés. Ils peuvent faire partie d'un même parti politique ou de partis différents (alliance de
          plusieurs partis politiques). Lorsqu'un député fait partie d'un groupe de moins de 15 députés, il est assigné au groupe
          des non-inscrits.
          <br />
          <br />
          Un{" "}
          {
            <FAQLink link={"quest-ce-quun-rattachement-financier"} colorHSL={props.color.HSL.Full}>
              rattachement financier
            </FAQLink>
          }{" "}
          indique le rattachement d'un député à un parti politique. Cela permet d'attribuer une partie de leur financement public
          au parti choisit.
        </p>
      }
      isLockedByDefault={false}
    >
      <div className="groupe">
        <div className="groupe__title" style={{ color: props.color.HSL.Full }}>
          Groupe Parlementaire
        </div>
        <div className="groupe__role" style={{ color: props.color.HSL.Full }}>
          {props.responsabiliteGroupe}
        </div>
        <div className="groupe__logo" title={props.groupe}>
          <props.photoGroupe />
        </div>
      </div>
      <div className="rattachement">
        <div className="rattachement__title" style={{ color: props.color.HSL.Full }}>
          Rattachement financier
        </div>
        {props.photoRattachement ? (
          typeof props.photoRattachement === "function" ? (
            <div className="rattachement__logo" title={props.rattachement}>
              <props.photoRattachement />
            </div>
          ) : (
            <div className="rattachement__logo rattachement__png" title={props.rattachement}>
              <Image src={props.photoRattachement} alt={props.rattachement} priority />
            </div>
          )
        ) : (
          <div className="rattachement__nom" title={props.rattachement}>
            {props.rattachement.includes("Non déclaré") ? `Non déclaré${props.sexe === "F" ? "e" : ""}` : props.rattachement}
          </div>
        )}
      </div>
    </Block>
  )
}

export default GroupeEtParti
