import React from "react"
import AugoraTooltip from "components/tooltip/Tooltip"
import { Group } from "@visx/group"
import { XYChart, AnimatedGrid, AnimatedAxis, Tooltip, BarSeries, BarStack } from "@visx/xychart"

interface BarStackProps extends Omit<Chart.BaseProps, "data"> {
  dataAge: Chart.AgeData[]
  groups: Group.GroupsList
  totalDeputes: number
  axisLeft: boolean
  maxAge?: number
  renderVertically: boolean
  marginTop: number
  marginLeft: number
}

const getGroupNomComplet = (sigle: string, groups: Group.GroupsList) => {
  return groups.find((group) => group.Sigle === sigle).NomComplet
}

const getGroupColor = (sigle: string, groups: Group.GroupsList): string => {
  return groups.find((group) => group.Sigle === sigle).Couleur
}

export default function XYBarStack(props: BarStackProps) {
  const { width, height, groups, dataAge, maxAge, totalDeputes, axisLeft, renderVertically, marginTop, marginLeft } = props
  const isRange = /^\d\d$/.test(dataAge[0].age as string)
  const marginRight = 30
  const listSigles = groups.map((g) => g.Sigle)

  // bounds
  const xMax = width - marginLeft
  const numTicks = renderVertically ? 4 : maxAge > 50 ? maxAge / 10 : maxAge > 15 ? maxAge / 2 : maxAge
  const yMax = height - marginTop

  return (
    <svg width={width} height={height}>
      <Group top={renderVertically ? marginTop / 2 : 0} left={renderVertically ? marginLeft / 2 : 0}>
        <XYChart
          margin={{ top: 0, right: 30, bottom: marginTop, left: 0 }}
          width={width}
          height={height}
          yScale={
            renderVertically
              ? { type: "linear", range: [yMax, 0], domain: [0, maxAge] }
              : {
                  type: "band",
                  range: [yMax, 0],
                  padding: 0.15,
                }
          }
          xScale={
            renderVertically
              ? {
                  type: "band",
                  range: [0, xMax],
                  padding: 0.15,
                }
              : axisLeft
              ? { type: "linear", range: [0, xMax], domain: [0, maxAge] }
              : { type: "linear", range: [0, xMax], domain: [-maxAge, 0] }
          }
        >
          <AnimatedGrid
            className="chart__rows"
            numTicks={numTicks}
            columns={renderVertically ? false : true}
            rows={renderVertically ? true : false}
          />
          {axisLeft && (
            <AnimatedAxis
              axisClassName="chart__axislabel axislabel__verticalpyramide"
              orientation="left"
              hideAxisLine={true}
              hideTicks={true}
              numTicks={numTicks}
              left={isRange ? -marginRight / 2 : -marginRight / 4}
            />
          )}
          <AnimatedAxis
            axisClassName="chart__axislabel axislabel__bottom"
            orientation="bottom"
            tickLength={6}
            hideAxisLine={true}
            hideTicks={renderVertically ? false : true}
            tickFormat={(d: string) => d.toString().replace("-", "")}
          />
          <BarStack>
            {listSigles.map((sigle) => {
              return (
                <BarSeries
                  dataKey={sigle}
                  data={dataAge}
                  xAccessor={(data) =>
                    renderVertically ? data.age : axisLeft ? data.groups[sigle].length : -data.groups[sigle].length
                  }
                  yAccessor={(data) => (renderVertically ? data.groups[sigle].length : data.age)}
                  colorAccessor={() => getGroupColor(sigle, groups)}
                />
              )
            })}
          </BarStack>
          <Tooltip<Chart.AgeData>
            className="charttooltip__container"
            unstyled={true}
            renderTooltip={({ tooltipData }) => {
              const key = tooltipData.nearestDatum.key
              const datum = tooltipData.nearestDatum.datum
              console.log(tooltipData)
              return (
                datum.groups[key].length > 0 && (
                  <AugoraTooltip
                    title={getGroupNomComplet(key, groups)}
                    nbDeputes={datum.groups[key].length}
                    totalDeputes={totalDeputes}
                    color={getGroupColor(key, groups)}
                    age={datum.age}
                  />
                )
              )
            }}
          />
        </XYChart>
      </Group>
    </svg>
  )
}
