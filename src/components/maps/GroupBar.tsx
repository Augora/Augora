import React from "react"
import { calculateNbDepute } from "components/deputies-list/deputies-list-utils"
import { calculatePercentage } from "utils/math/percentage"

interface IGroupBar {
  deputiesList: AugoraMap.DeputiesList
  groupList: { [key: string]: any }[]
}

type IGroupWeight = {
  percent: number
  color: string
  sigle: string
}[]

export default function GroupBar({ deputiesList, groupList }: IGroupBar) {
  const groups: IGroupWeight = groupList.map((o) => {
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
    <div className="color-bar">
      {groups.map((o) => {
        return (
          <div
            key={`bar-${o.sigle}`}
            className="color-bar--element"
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
