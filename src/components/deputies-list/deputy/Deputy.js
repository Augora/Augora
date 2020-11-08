import React from "react"
import Link from "next/link"
import Image from "next/image"
import { groupeIconByGroupeSigle } from "../deputies-list-utils"
import DeputyImage from "components/deputy/general-information/deputy-image/DeputyImage"

export default function OneDeputy(props) {
  return (
    <>
      <Link href={`/depute/${props.data.Slug}`}>
        <a
          id={"depute-" + props.data.Slug}
          className={"depute"}
          style={{
            backgroundColor: props.data.GroupeParlementaire.Couleur,
          }}
        >
          <h2>{props.data.Nom}</h2>
          <DeputyImage src={props.data.URLPhotoAugora} alt={props.data.Slug} sex={props.data.Sexe} />
          <div className="deputy__icon-container">
            <Image
              layout="fill"
              className="deputy__groupe-icon"
              src={groupeIconByGroupeSigle(props.data.GroupeParlementaire.Sigle)}
              alt={`Icône du groupe ${props.data.GroupeParlementaire.Sigle}`}
            />
          </div>
        </a>
      </Link>
    </>
  )
}
