import React from "react"
import Link from "next/link"
import { getGroupLogo } from "../deputies-list-utils"
import DeputyImage from "components/deputy/general-information/deputy-image/DeputyImage"

interface IOneDeputy {
  depute: Deputy.Deputy
}

export default function OneDeputy({ depute }: IOneDeputy) {
  const GroupLogo = getGroupLogo(depute.GroupeParlementaire.Sigle)

  return (
    <>
      <Link href={`/depute/${depute.Slug}`}>
        <a
          id={"depute-" + depute.Slug}
          className={"depute"}
          style={{
            backgroundColor: depute.GroupeParlementaire.Couleur,
          }}
        >
          <h2>{depute.Nom}</h2>
          <DeputyImage slug={depute.Slug} alt={depute.Slug} sex={depute.Sexe} />
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
