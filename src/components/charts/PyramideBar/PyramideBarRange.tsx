import React from "react"
import { Group } from "@visx/group"
import PyramideBarRangeChart from "./PyramideBarRangeChart"

interface BarStackProps extends Omit<Chart.BaseProps, "data"> {
  dataAgeFemme: Chart.RangeAgeData[]
  dataAgeHomme: Chart.RangeAgeData[]
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
          <PyramideBarRangeChart
            width={width / 2}
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
            margin={{ top: 0, right: 0, bottom: 50, left: 0 }}
          />
        </Group>
      </svg>
      <svg height={height}>
        <Group top={marginTop / 2} left={marginLeft}>
          <PyramideBarRangeChart
            width={width / 2}
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
            margin={{ top: 0, right: 0, bottom: 50, left: 0 }}
          />
        </Group>
      </svg>
    </div>
  )
}
