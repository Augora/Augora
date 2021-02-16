import React from "react"
import { Group } from "@visx/group"
import XYContent from "src/components/charts/PyramideBar/XYContent"

interface BarStackProps extends Omit<Chart.BaseProps, "data"> {
  dataAgeFemme: Chart.AgeData[]
  dataAgeHomme: Chart.AgeData[]
  totalDeputes: number
}

export default function PyramideBar(props: BarStackProps) {
  const { width, height, dataAgeHomme, dataAgeFemme, totalDeputes } = props
  const maxAgeFemme = Math.max(...dataAgeFemme.map((d) => d.total))
  const maxAgeHomme = Math.max(...dataAgeHomme.map((d) => d.total))
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
          <XYContent
            width={width / 2}
            height={height}
            data={dataAgeHomme}
            dataKey={"hommes"}
            color={"#14ccae"}
            totalDeputes={totalDeputes}
            maxAge={maxAge}
            xMax={xMax}
            yMax={yMax}
            animationTrajectoire={animationTrajectoire}
            pyramideRight={false}
          />
        </Group>
      </svg>
      <svg height={height}>
        <Group top={marginTop / 2} left={marginLeft / 2}>
          <XYContent
            width={width / 2}
            height={height}
            data={dataAgeFemme}
            dataKey={"femmes"}
            color={"#00bbcc"}
            totalDeputes={totalDeputes}
            maxAge={maxAge}
            xMax={xMax}
            yMax={yMax}
            animationTrajectoire={animationTrajectoire}
            pyramideRight={true}
          />
        </Group>
      </svg>
    </div>
  )
}
