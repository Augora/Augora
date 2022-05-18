import React from "react"
import AugoraTooltip from "components/tooltip/Tooltip"
import { Group } from "@visx/group"
import { XYChart, AnimatedGrid, AnimatedAxis, Tooltip, BarSeries, BarStack } from "@visx/xychart"
import useDeputiesFilters from "hooks/deputies-filters/useDeputiesFilters"

interface BarStackProps extends Omit<Chart.BaseProps, "data"> {
  dataAge: Chart.AgeData[]
  dataAgeRange?: Chart.AgeData[]
  groups: Group.GroupsList
  totalDeputes: number
  axisLeft: boolean
  maxAge?: number
  renderVertically: boolean
  marginTop: number
  marginLeft: number
  normalHeight: number
  responsiveHeight: number
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
    groups,
    dataAge,
    dataAgeRange,
    maxAge,
    totalDeputes,
    axisLeft,
    renderVertically,
    marginTop,
    marginLeft,
    normalHeight,
    responsiveHeight,
  } = props
  const { handleGroupClick } = useDeputiesFilters()
  const isAxisRange = /^\d\d$/.test(dataAge[0].age as string)
  const isRange = width < 460
  const marginRight = 30
  const listSigles = groups.map((g) => g.Sigle)

  // bounds
  const xMax = width - marginLeft
  const tickTwoOrOne = maxAge == 2 ? 2 : maxAge == 1 ? 1 : 4
  const ratio = renderVertically && isRange ? (width > 300 ? 1 : width > 176 ? 0.9 : 0.8) : 1
  const yMax = height * ratio - marginTop * 2 - (width > 368 ? normalHeight : responsiveHeight)

  return (
    <svg width={width} height={height}>
      <Group top={renderVertically ? marginTop / 2 : 0} left={renderVertically ? marginLeft : 0}>
        <XYChart
          margin={{ top: 0, right: 20, bottom: marginTop + (renderVertically ? 30 : 0), left: 0 }}
          width={width}
          height={
            height * ratio -
            marginTop * (!renderVertically && (width / height < 0.9 ? 1.5 : 2)) -
            (width > 368 ? normalHeight : responsiveHeight)
          }
          yScale={
            renderVertically
              ? { type: "linear", range: [yMax, 0], domain: [0, maxAge] }
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
                  colorAccessor={() => getGroupColor(sigle, groups)}
                  onPointerUp={() => console.log("test")}
                  onPointerMove={() => console.log("test")}
                  onPointerOut={() => console.log("test")}
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
