import React from "react"
import AugoraTooltip from "components/tooltip/Tooltip"
import { Group } from "@visx/group"
import {
  XYChart,
  AnimatedBarStack,
  AnimatedBarSeries,
  AnimatedGrid,
  AnimatedAxis,
  Tooltip,
  BarSeries,
  BarStack,
} from "@visx/xychart"

interface BarStackProps extends Omit<Chart.BaseProps, "data"> {
  dataAge: Chart.AgeData[]
  groups: Group.GroupsList
  totalDeputes: number
}

export default function BarStackChart({ width, height, groups, dataAge, totalDeputes }: BarStackProps) {
  const maxAge = Math.max(...dataAge.map((d) => d.total))
  const numTicks = 4
  const listSigles = groups.map((g) => g.Sigle)
  const getGroupColor = (sigle: string): string => {
    return groups.find((group) => group.Sigle === sigle).Couleur
  }
  const renderVertically = true

  // bounds
  const marginTop = 30
  const marginLeft = 20
  const xMax = width - marginLeft
  const yMax = height - marginTop

  return (
    <div className="barstackchart chart">
      <svg width={width} height={height}>
        <Group top={marginTop / 2} left={marginLeft / 2}>
          <XYChart
            margin={{ top: 0, right: 30, bottom: marginTop, left: 0 }}
            width={width}
            height={height}
            xScale={
              renderVertically
                ? {
                    type: "band",
                    range: [0, xMax],
                    padding: 0.15,
                  }
                : { type: "linear", range: [0, xMax], domain: [0, maxAge] }
            }
            yScale={
              renderVertically
                ? { type: "linear", range: [yMax, 0], domain: [0, maxAge] }
                : {
                    type: "band",
                    range: [yMax, 0],
                    padding: 0.15,
                  }
            }
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
            <BarStack>
              {listSigles.map((sigle) => {
                return (
                  <BarSeries
                    dataKey={sigle}
                    data={dataAge}
                    xAccessor={(data) => (renderVertically ? data.age : data.groups[sigle].length)}
                    yAccessor={(data) => (renderVertically ? data.groups[sigle].length : data.age)}
                    colorAccessor={() => getGroupColor(sigle)}
                  />
                )
              })}
            </BarStack>
            <Tooltip<Chart.AgeData>
              className="charttooltip__container"
              unstyled={true}
              renderTooltip={({ tooltipData }) => {
                const key = tooltipData.nearestDatum.key
                return (
                  <AugoraTooltip
                    title={key}
                    nbDeputes={tooltipData.nearestDatum.datum.total}
                    totalDeputes={totalDeputes}
                    color={getGroupColor(key)}
                    age={tooltipData.nearestDatum.datum.age}
                  />
                )
              }}
            />
          </XYChart>
        </Group>
      </svg>
    </div>
  )
}
