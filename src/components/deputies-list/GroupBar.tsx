import React, { useContext } from "react"
import { calculateNbDepute } from "components/deputies-list/deputies-list-utils"
import { calculatePercentage } from "utils/math/percentage"
import { DeputiesListContext } from "context/deputies-filters/deputiesFiltersContext"

interface IGroupBar {
  deputiesList: AugoraMap.DeputiesList
  className?: string
}

type IGroupWeight = {
  percent: number
  color: string
  sigle: string
}[]

/**
 * Renvoie une barre de répartition des groupes parlementaires
 * @param {AugoraMap.DeputiesList} deputiesList La liste de députés à analyser
 */
export default function GroupBar({ deputiesList, className }: IGroupBar) {
  const {
    state: { GroupesList },
  } = useContext(DeputiesListContext)

  const groups: IGroupWeight = GroupesList.map((o) => {
    return {
      percent:
        Math.round(
          calculatePercentage(
            deputiesList.length,
            calculateNbDepute(deputiesList, "groupe", o.Sigle)
          ) * 10
        ) / 10,
      color: o.Couleur,
      sigle: o.Sigle,
    }
  })

  return (
    <div className={`group-bar ${className ? className : ""}`}>
      {groups.map((o) => {
        return (
          <div
            key={`bar-${o.sigle}-${o.percent}`}
            className={"group-bar--element"}
            style={{
              background: o.color,
              width: o.percent + "%",
            }}
          />
        )
      })}
    </div>
  )
}
