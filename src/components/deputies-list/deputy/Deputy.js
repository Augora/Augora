import React from "react"
import { Link } from "gatsby"
import { groupeIconByGroupeSigle } from "../deputies-list-utils"
import DeputyImage from "components/deputy/general-information/deputy-image/DeputyImage"

export default function OneDeputy(props) {
  return (
    <>
      <Link
        to={`/depute/${props.data.Slug}`}
        id={"depute-" + props.data.Slug}
        className={"depute"}
        style={{
          backgroundColor: props.data.GroupeParlementaire.Couleur,
        }}
      >
        <h2>{props.data.Nom}</h2>
        <DeputyImage src={props.data.URLPhotoAugora} alt={props.data.Slug} sex={props.data.Sexe} />
        <div className="deputy__icon-container">
          <img
            className="deputy__groupe-icon"
            src={groupeIconByGroupeSigle(props.data.GroupeParlementaire.Sigle)}
            alt={`Icône du groupe ${props.data.GroupeParlementaire.Sigle}`}
          />
        </div>
      </Link>
    </>
  )
}
