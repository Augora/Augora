import React from "react"
import { Group } from "@visx/group"
import XYBarStack from "src/components/charts/XYBarStack"

interface BarStackProps extends Omit<Chart.BaseProps, "data"> {
  dataAgeFemme: Chart.AgeData[]
  dataAgeHomme: Chart.AgeData[]
  groups: Group.GroupsList
  totalDeputes: number
  maxAge: number
}

export default function PyramideBarStack(props: BarStackProps) {
  const { width, height, dataAgeFemme, dataAgeHomme, groups, totalDeputes, maxAge } = props

  // bounds
  const marginTop = 20
  const marginLeft = 30

  return (
    <div className="pyramidechart chart">
      <svg width={width / 2} height={height}>
        <Group top={marginTop}>
          <XYBarStack
            width={width / 2}
            height={height}
            dataAge={dataAgeHomme}
            groups={groups}
            totalDeputes={totalDeputes}
            maxAge={maxAge}
            axisLeft={false}
            renderVertically={false}
            marginTop={marginTop}
            marginLeft={marginLeft}
          />
        </Group>
      </svg>
      <svg width={width / 2} height={height}>
        <Group top={marginTop} left={marginLeft}>
          <XYBarStack
            width={width / 2}
            height={height}
            dataAge={dataAgeFemme}
            groups={groups}
            totalDeputes={totalDeputes}
            maxAge={maxAge}
            axisLeft={true}
            renderVertically={false}
            marginTop={marginTop}
            marginLeft={marginLeft}
          />
        </Group>
      </svg>
    </div>
  )
}
