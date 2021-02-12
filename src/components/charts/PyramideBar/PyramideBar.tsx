import React from "react"
import { Group } from "@visx/group"
import PyramideBarChart from "./PyramideBarChart"

interface BarStackProps extends Omit<Chart.BaseProps, "data"> {
  dataAgeFemme: Chart.AgeData[]
  dataAgeHomme: Chart.AgeData[]
  totalDeputes: number
}

export default function PyramideBar({ width, height, dataAgeFemme, dataAgeHomme, totalDeputes }: BarStackProps) {
  const maxAgeFemme = Math.max(...dataAgeFemme.map((d) => d.deputyCount))
  const maxAgeHomme = Math.max(...dataAgeHomme.map((d) => d.deputyCount))
  const maxAge = Math.max(maxAgeFemme, maxAgeHomme)

  const animationTrajectoire = "center"

  // bounds
  const marginTop = 50
  const marginLeft = 30
  const xMax = width / 2 - marginLeft
  const yMax = height - marginTop

  return (
    <div className="pyramidebarchart chart">
      <svg height={height}>
        <Group top={marginTop / 2} left={marginLeft / 2}>
          <PyramideBarChart
            width={width}
            height={height}
            data={dataAgeHomme}
            dataKey={"homme"}
            color={"#14ccae"}
            totalDeputes={totalDeputes}
            maxAge={maxAge}
            xMax={xMax}
            yMax={yMax}
            animationTrajectoire={animationTrajectoire}
            pyramideRight={false}
            tooltipTop={300}
            tooltipLeft={150}
          />
        </Group>
      </svg>
      <svg height={height}>
        <Group top={marginTop / 2} left={marginLeft / 2}>
          <PyramideBarChart
            width={width}
            height={height}
            data={dataAgeFemme}
            dataKey={"femme"}
            color={"#00bbcc"}
            totalDeputes={totalDeputes}
            maxAge={maxAge}
            xMax={xMax}
            yMax={yMax}
            animationTrajectoire={animationTrajectoire}
            pyramideRight={true}
            tooltipTop={300}
            tooltipLeft={680}
          />
        </Group>
      </svg>
    </div>
  )
}