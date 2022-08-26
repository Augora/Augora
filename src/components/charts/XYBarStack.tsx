import React from "react"
import AugoraTooltip from "components/tooltip/Tooltip"
import { Group } from "@visx/group"
import { XYChart, AnimatedGrid, AnimatedAxis, Tooltip, BarSeries, BarStack } from "@visx/xychart"
import useDeputiesFilters from "hooks/deputies-filters/useDeputiesFilters"
import { getAgeData, rangifyAgeData } from "./chart-utils"

interface BarStackProps extends Omit<Chart.BaseProps, "data"> {
  deputesData: { groupList: Group.GroupsList; deputes: Deputy.DeputiesList; ageDomain: Filter.AgeDomain }
  /** Add an axis on the left of the graph
   * @default true */
  axisLeft?: boolean
  /** Render vertically or horizontally a graph
   * @default true */
  renderVertically?: boolean
  margin?: { top: number; left: number }
  modulableHeight?: { normal: number; responsive: number }
}

const getGroupNomComplet = (sigle: string, groups: Group.GroupsList) => {
  return groups.find((group) => group.Sigle === sigle).NomComplet
}

const getGroupColor = (sigle: string, groups: Group.GroupsList): string => {
  return groups.find((group) => group.Sigle === sigle).Couleur
}
export default function XYBarStack(props: BarStackProps) {
  const {
    width,
    height,
    deputesData: { groupList, deputes, ageDomain },
    axisLeft,
    renderVertically,
    margin = { top: 30, left: 20 },
    modulableHeight = { normal: 15, responsive: 30 },
  } = props

  const isRange = width < 460
  const dataAge = getAgeData(groupList, deputes, ageDomain)
  const dataAgeRange = rangifyAgeData(getAgeData(groupList, deputes, ageDomain), 6)
  const maxAge = Math.max(...dataAge.map((d) => d.total))
  const isAxisRange = /^\d\d$/.test(dataAge[0].age as string)

  const marginRight = 30
  const listSigles = groupList.map((g) => g.Sigle)

  // bounds
  const xMax = width - margin.left
  const tickTwoOrOne = maxAge == 2 ? 2 : maxAge == 1 ? 1 : 4
  const ratio = renderVertically && isRange ? (width > 300 ? 1 : width > 176 ? 0.9 : 0.8) : 1
  const yMax = height * ratio - margin.top * 2 - (width > 368 ? modulableHeight.normal : modulableHeight.responsive)

  return (
    <svg width={width} height={height}>
      <Group top={renderVertically ? margin.top / 2 : 0} left={renderVertically ? margin.left : 0}>
        <XYChart
          margin={{ top: 0, right: 20, bottom: margin.top + (renderVertically ? 30 : 0), left: 0 }}
          width={width}
          height={
            height * ratio -
            margin.top * (!renderVertically && (width / height < 0.9 ? 1.5 : 2)) -
            (width > 368 ? modulableHeight.normal : modulableHeight.responsive)
          }
          yScale={
            renderVertically
              ? { type: "linear", domain: [0, maxAge] }
              : {
                  type: "band",
                  range: [yMax - (width / height < 0.9 ? 15 : width / height < 0.4 ? 10 : width / height > 0.6 ? 20 : 0), 0],
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
            numTicks={tickTwoOrOne}
            columns={renderVertically ? false : true}
            rows={renderVertically ? true : false}
          />
          {axisLeft && (
            <AnimatedAxis
              axisClassName={`chart__axislabel${renderVertically ? " axislabel__barstack" : " axislabel__verticalpyramide"}`}
              orientation="left"
              hideAxisLine={true}
              hideTicks={true}
              numTicks={renderVertically ? tickTwoOrOne : 10}
              left={isAxisRange ? -marginRight / 2 - 1 : -marginRight / 3 + 1}
              tickFormat={(d: string) => (renderVertically ? d.toString().replace("-", "") : d)}
            />
          )}
          <AnimatedAxis
            axisClassName={`chart__axislabel axislabel__bottom${renderVertically && isRange ? " vertical" : ""}`}
            orientation="bottom"
            tickLength={6}
            hideAxisLine={true}
            numTicks={renderVertically ? 10 : tickTwoOrOne}
            hideTicks={renderVertically ? false : true}
            tickFormat={(d: string) => (renderVertically ? d : d.toString().replace("-", ""))}
          />
          <BarStack>
            {listSigles.map((sigle, i) => {
              return (
                <BarSeries
                  key={`${sigle}-${i}`}
                  dataKey={sigle}
                  data={isRange && renderVertically ? dataAgeRange : dataAge}
                  xAccessor={(data) =>
                    renderVertically ? data.age : axisLeft ? data.groups[sigle].length : -data.groups[sigle].length
                  }
                  yAccessor={(data) => (renderVertically ? data.groups[sigle].length : data.age)}
                  colorAccessor={() => getGroupColor(sigle, groupList)}
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
              return (
                datum.groups[key].length > 0 && (
                  <AugoraTooltip
                    title={getGroupNomComplet(key, groupList)}
                    nbDeputes={datum.groups[key].length}
                    totalDeputes={deputes.length}
                    color={getGroupColor(key, groupList)}
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
