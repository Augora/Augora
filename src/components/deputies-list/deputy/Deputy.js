import React from "react"
import { Link } from "gatsby"
import { groupeIconByGroupeSigle } from "../deputies-list-utils"

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
        <img
          className="deputy__photo"
          src={props.data.URLPhotoAugora}
          alt={props.data.Slug}
        />
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
