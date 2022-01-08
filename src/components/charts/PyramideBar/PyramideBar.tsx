import React from "react"
import { Group } from "@visx/group"
import XYBar from "src/components/charts/PyramideBar/XYBar"

interface BarStackProps extends Omit<Chart.BaseProps, "data"> {
  dataAgeFemme: Chart.AgeData[]
  dataAgeHomme: Chart.AgeData[]
  totalDeputes: number
  maxAge: number
}

export default function PyramideBar(props: BarStackProps) {
  const { width, height, dataAgeHomme, dataAgeFemme, totalDeputes, maxAge } = props

  // bounds
  const marginTop = 20
  const marginLeft = 30
  const xMax = width / 2 - marginLeft
  const yMax = height - marginTop

  return (
    <div className="pyramidechart chart">
      <svg width={width / 2} height={height}>
        <Group top={marginTop}>
          <XYBar
            width={width / 2}
            height={height}
            data={dataAgeHomme}
            dataKey={"hommes"}
            color={"#14ccae"}
            totalDeputes={totalDeputes}
            maxAge={maxAge}
            xMax={xMax}
            yMax={yMax}
            pyramideRight={false}
          />
        </Group>
      </svg>
      <svg width={width / 2} height={height}>
        <Group top={marginTop} left={marginLeft}>
          <XYBar
            width={width / 2}
            height={height}
            data={dataAgeFemme}
            dataKey={"femmes"}
            color={"#00bbcc"}
            totalDeputes={totalDeputes}
            maxAge={maxAge}
            xMax={xMax}
            yMax={yMax}
            pyramideRight={true}
          />
        </Group>
      </svg>
    </div>
  )
}
