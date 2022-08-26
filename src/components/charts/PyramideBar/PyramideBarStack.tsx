import React from "react"
import { Group } from "@visx/group"
import XYBarStack from "src/components/charts/XYBarStack"
import ChartLegend from "src/components/charts/ChartLegend"
import { getAgeData, rangifyAgeData } from "../chart-utils"
import { scaleOrdinal } from "@visx/scale"
import { GlyphSquare } from "@visx/glyph"

interface BarStackProps extends Omit<Chart.BaseProps, "data"> {
  deputesData: { groupList: Group.GroupsList; deputes: Deputy.DeputiesList; ageDomain: Filter.AgeDomain }
}

export default function PyramideBarStack(props: BarStackProps) {
  const {
    width,
    height,
    deputesData: { groupList, deputes, ageDomain },
  } = props
  // bounds
  const marginTop = 20
  const marginLeft = 30

  const deputesFemmes = deputes.filter((depute) => depute.Sexe === "F")
  const deputesHommes = deputes.filter((depute) => depute.Sexe === "H")

  // const ageDomainFemme =

  return (
    <div className="pyramidechart chart">
      <svg width={width / 2} height={height}>
        <Group top={marginTop + 20}>
          <XYBarStack
            width={width / 2}
            height={height}
            deputesData={{ groupList: groupList, deputes: deputesHommes, ageDomain: ageDomain }}
            axisLeft={false}
            renderVertically={false}
            margin={{ top: marginTop, left: marginLeft }}
            modulableHeight={{ normal: 15, responsive: width <= 585 ? 50 : width <= 735 ? 35 : 0 }}
          />
        </Group>
      </svg>
      <svg width={width / 2} height={height}>
        <Group top={marginTop + 20} left={marginLeft}>
          <XYBarStack
            width={width / 2}
            height={height}
            deputesData={{ groupList: groupList, deputes: deputesFemmes, ageDomain: ageDomain }}
            axisLeft={true}
            renderVertically={false}
            margin={{ top: marginTop, left: marginLeft }}
            modulableHeight={{ normal: 15, responsive: width <= 585 ? 50 : width <= 735 ? 35 : 0 }}
          />
        </Group>
      </svg>
      <ChartLegend groupList={groupList} />
    </div>
  )
}
