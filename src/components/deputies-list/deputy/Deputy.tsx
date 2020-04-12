//// Imports
// React
import React, { memo } from "react"
import { Link } from "gatsby"
import { groupeIconByGroupeSigle } from "../deputies-list-utils"
import { memoize } from "lodash"
// Style
import "./deputy.scss"

interface OneDeputyProps {
  Slug: string
  URLPhotoAugora: string
  Nom: string
  GroupeParlementaire: {
    Sigle: string
    Couleur: string
  }
}

function OneDeputy(props: OneDeputyProps) {
  return (
    <Link
      to={`/deputy/${props.Slug}`}
      id={"depute-" + props.Slug}
      key={props.Slug}
      className={"depute depute--opened-false"}
      style={{
        backgroundColor: props.GroupeParlementaire.Couleur,
      }}
    >
      <h2>{props.Nom}</h2>
      <img
        className="deputy__photo"
        src={props.URLPhotoAugora}
        alt={props.Slug}
      />
      <div className="deputy__icon-container">
        <img
          className="deputy__groupe-icon"
          src={groupeIconByGroupeSigle(props.GroupeParlementaire.Sigle)}
          alt={`Icône du groupe ${props.GroupeParlementaire.Sigle}`}
        />
      </div>
    </Link>
  )
}

function areEquals(prevProps: OneDeputyProps, nextProps: OneDeputyProps) {
  return prevProps.Slug === nextProps.Slug
}

export default memo(OneDeputy, areEquals)
