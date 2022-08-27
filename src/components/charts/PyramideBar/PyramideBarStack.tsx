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

  const dataAge = getAgeData(groupList, deputes, ageDomain)
  const isRange = dataAge.length < 30
  const deputesFemmes = isRange
    ? getAgeData(groupList, deputes, ageDomain, "F")
    : rangifyAgeData(getAgeData(groupList, deputes, ageDomain, "F"), 6)
  const deputesHommes = isRange
    ? getAgeData(groupList, deputes, ageDomain, "H")
    : rangifyAgeData(getAgeData(groupList, deputes, ageDomain, "H"), 6)

  const maxAgeFemme = Math.max(...deputesFemmes.map((d) => d.total))
  const maxAgeHomme = Math.max(...deputesHommes.map((d) => d.total))
  const maxAge = Math.max(maxAgeFemme, maxAgeHomme)

  return (
    <div className="pyramidechart chart">
      <svg width={width / 2} height={height}>
        <Group top={marginTop + 20}>
          <XYBarStack
            width={width / 2}
            height={height}
            deputesData={{
              groupList: groupList,
              deputes: deputes,
              deputesBySexe: deputesHommes,
              ageDomain: ageDomain,
              maxAgeSexe: maxAge,
            }}
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
            deputesData={{
              groupList: groupList,
              deputes: deputes,
              deputesBySexe: deputesFemmes,
              ageDomain: ageDomain,
              maxAgeSexe: maxAge,
            }}
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
