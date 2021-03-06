import React, { useContext } from "react"
import { getNbDeputiesGroup } from "components/deputies-list/deputies-list-utils"
import { calculatePercentage } from "utils/math/percentage"
import useDeputiesFilters from "src/hooks/deputies-filters/useDeputiesFilters"

interface IGroupBar {
  deputiesList: Deputy.DeputiesList
  className?: string
}

type IGroupWeight = {
  percent: number
  color: string
  sigle: string
}[]

/**
 * Renvoie une barre de répartition des groupes parlementaires
 * @param {Deputy.DeputiesList} deputiesList La liste de députés à analyser
 */
export default function GroupBar({ deputiesList, className }: IGroupBar) {
  const {
    state: { GroupesList },
  } = useDeputiesFilters()

  const groups: IGroupWeight = GroupesList.map((o) => {
    return {
      percent: Math.round(calculatePercentage(deputiesList.length, getNbDeputiesGroup(deputiesList, o.Sigle)) * 10) / 10,
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
