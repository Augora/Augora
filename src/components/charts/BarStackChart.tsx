import React from "react"
import { XYChart, AnimatedBarStack, AnimatedBarSeries, AnimatedGrid, AnimatedAxis } from "@visx/xychart"

interface BarStackProps extends Omit<Chart.BaseProps, "data"> {
  dataAge: Chart.AgeData[]
  groups: Group.GroupsList
  totalDeputes: number
}

export default function BarStackChart({ width, height, groups, dataAge, totalDeputes }: BarStackProps) {
  const maxAge = Math.max(...dataAge.map((d) => d.total))
  const numTicks = 6
  const listSigles = groups.map((g) => g.Sigle)
  const getGroupColor = (sigle: string): string => {
    return groups.find((group) => group.Sigle === sigle).Couleur
  }
  // bounds
  const marginTop = 30
  const marginLeft = 20
  const xMax = width - marginLeft
  const yMax = height - marginTop

  return (
    <div className="barstackchart chart">
      <svg width={width} height={height}>
        <XYChart
          margin={{ top: 0, right: 30, bottom: marginTop, left: 0 }}
          width={width}
          height={height}
          yScale={{ type: "linear", range: [yMax, 0], round: true, domain: [0, maxAge] }}
          xScale={{
            type: "band",
            range: [0, xMax],
            domain: dataAge.map((d) => d.age as number),
            padding: 0.15,
          }}
        >
          <AnimatedGrid className="chart__rows" numTicks={numTicks} columns={false} />
          <AnimatedAxis
            axisClassName="chart__axislabel axislabel__verticalpyramide"
            orientation="left"
            hideAxisLine={true}
            hideTicks={true}
            numTicks={numTicks}
          />
          <AnimatedAxis
            axisClassName="chart__axislabel axislabel__bottom"
            orientation="bottom"
            tickLength={6}
            hideAxisLine={true}
          />
          <AnimatedBarStack>
            {listSigles.map((sigle) => {
              return (
                <AnimatedBarSeries
                  dataKey={sigle}
                  data={dataAge}
                  xAccessor={(data) => data.age}
                  yAccessor={(data) => data.groups[sigle].length}
                  colorAccessor={() => getGroupColor(sigle)}
                />
              )
            })}
          </AnimatedBarStack>
        </XYChart>
      </svg>
    </div>
  )
}
