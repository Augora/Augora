import React from "react"
import Link from "next/link"
import { getGroupLogo } from "../deputies-list-utils"
import DeputyImage from "components/deputy/general-information/deputy-image/DeputyImage"

interface IOneDeputy {
  depute: Deputy.Deputy
  groupNumber?: number
}

export default function OneDeputy({ depute, groupNumber }: IOneDeputy) {
  const GroupLogo = getGroupLogo(depute.GroupeParlementaire.Sigle)
  const isPresidentGroupe =
    depute.ResponsabiliteGroupe.Fonction === "président" || depute.ResponsabiliteGroupe.Fonction === "présidente"
  return (
    <>
      <Link href={`/depute/${depute.Slug}`}>
        <a
          id={"depute-" + depute.Slug}
          className={`depute${isPresidentGroupe && groupNumber == 1 ? " depute__president" : ""}`}
          style={{
            backgroundColor: depute.GroupeParlementaire.Couleur,
          }}
        >
          <h2>{depute.Nom}</h2>
          {isPresidentGroupe ? <h3>Président{depute.Sexe === "F" ? "e" : ""} du groupe</h3> : ""}
          <DeputyImage src={depute.URLPhotoAugora} alt={depute.Slug} sex={depute.Sexe} />
          <div className="deputy__icon-container">
            <div className="icon-wrapper">
              <GroupLogo />
            </div>
          </div>
        </a>
      </Link>
    </>
  )
}
