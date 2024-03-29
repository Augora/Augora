import React from "react"
import { Group } from "@visx/group"
import { curveLinear } from "@visx/curve"
import { getNbActivitesMax } from "components/deputies-list/deputies-list-utils"
import dayjs from "dayjs"
import "dayjs/locale/fr"
import {
  XYChart,
  AnimatedAxis,
  AnimatedBarSeries,
  AnimatedGrid,
  AnimatedLineSeries,
  Tooltip,
  AnimatedAreaSeries,
} from "@visx/xychart"

import { Legend, LegendItem, LegendLabel } from "@visx/legend"
import AugoraTooltip from "components/tooltip/Tooltip"

dayjs.locale("fr")

const getDates = (date: string) => {
  return {
    MonthData: dayjs(date).format("DD MMM YYYY"),
    MobileData: dayjs(date).format("DD/MM/YY"),
    DayData: dayjs(date).format("DD MMMM YYYY"),
  }
}

interface IPresence {
  width: number
  height: number
  data: Deputy.Activite[]
  slicedData: Deputy.Activite[]
  color: string
  opacityParticipation: number
  DisplayedGraph: {
    Présences: boolean
    Participations: boolean
    "Questions orales": boolean
    "Mediane des présences": boolean
    Vacances: boolean
  }
  medianeDeputeColor: string
  vacancesColor: string
  shapeScale: any
}

export default function PresenceParticipation(props: IPresence) {
  const {
    width,
    height,
    data,
    slicedData,
    color,
    opacityParticipation,
    DisplayedGraph,
    medianeDeputeColor,
    vacancesColor,
    shapeScale,
  } = props

  const changeDisplay = width < 750
  // bounds
  const margin = width < 500 ? 110 : width < 750 ? 90 : 50
  const marginLeft = 20
  const xMax = width - marginLeft

  const yMax = height - margin

  var maxActivite = getNbActivitesMax(data) < 10 ? 10 : getNbActivitesMax(data)

  return width < 10 ? null : (
    <div>
      <svg width={width} height={height}>
        <Group top={20} left={marginLeft}>
          <XYChart
            margin={{ top: 0, right: 10, bottom: 0, left: 0 }}
            width={width}
            height={height - margin}
            xScale={{ type: "band", range: [0, xMax] }}
            yScale={{ type: "linear", range: [0, yMax], padding: 0.1, domain: [maxActivite, 0] }}
          >
            <AnimatedGrid left={0} numTicks={maxActivite / 2} columns={false} />
            {DisplayedGraph.Vacances && (
              <AnimatedBarSeries
                dataKey={"Vacances"}
                data={slicedData}
                xAccessor={(d) => d.DateDeFin}
                yAccessor={(d) => (d.Vacances ? maxActivite : 0)}
                colorAccessor={() => vacancesColor}
              />
            )}
            {DisplayedGraph["Mediane des présences"] && (
              <AnimatedAreaSeries
                dataKey={"Mediane"}
                data={slicedData}
                xAccessor={(d) => d.DateDeFin}
                yAccessor={(d) => d.MedianeTotal}
                stroke={medianeDeputeColor}
                fill={medianeDeputeColor}
                renderLine={false}
                curve={curveLinear}
                opacity={opacityParticipation}
              />
            )}
            {DisplayedGraph.Participations && (
              <AnimatedLineSeries
                dataKey={"Participation"}
                data={slicedData}
                xAccessor={(d) => d.DateDeFin}
                yAccessor={(d) => d.ParticipationEnHemicycle + d.ParticipationsEnCommission}
                curve={curveLinear}
                stroke={color}
                strokeOpacity={opacityParticipation}
              />
            )}
            {DisplayedGraph.Présences && (
              <AnimatedLineSeries
                dataKey={"Presence"}
                data={slicedData}
                xAccessor={(d) => d.DateDeFin}
                yAccessor={(d) => d.PresenceEnHemicycle + d.PresencesEnCommission}
                stroke={color}
                curve={curveLinear}
              />
            )}
            {DisplayedGraph["Questions orales"] && (
              <AnimatedBarSeries
                dataKey={"Question"}
                data={slicedData}
                xAccessor={(d) => d.DateDeFin}
                yAccessor={(d) => d.Question}
                colorAccessor={() => color}
              />
            )}

            <AnimatedAxis
              axisClassName="presence__axisleft"
              orientation="left"
              top={2}
              left={-8}
              hideAxisLine={true}
              tickStroke={"none"}
              tickLength={6}
              numTicks={maxActivite / 2}
              animationTrajectory={"center"}
            />
            <AnimatedAxis
              axisClassName={width < 500 ? "presence__axisbottom rotate" : "presence__axisbottom"}
              orientation="bottom"
              hideAxisLine={true}
              top={yMax}
              left={11}
              tickLength={6}
              numTicks={changeDisplay ? 8 : 10}
              animationTrajectory={"center"}
              tickFormat={(date: string) =>
                width < 1000 ? getDates(date.split("T")[0]).MobileData : getDates(date.split("T")[0]).MonthData
              }
            />
            <Tooltip<Deputy.Activite>
              className="charttooltip__container"
              applyPositionStyle={true}
              unstyled={true}
              showVerticalCrosshair
              offsetTop={-100}
              offsetLeft={50}
              renderTooltip={({ tooltipData }) => {
                const key = tooltipData.nearestDatum.index
                const nearest = tooltipData.nearestDatum.datum
                return (
                  <AugoraTooltip
                    className="presence__tooltip"
                    title={`Semaine du ${getDates(nearest.DateDeDebut).DayData} au\n${getDates(nearest.DateDeFin).DayData}`}
                  >
                    {nearest.Vacances === 0 ? (
                      <Legend scale={shapeScale}>
                        {(labels) => (
                          <div className="item">
                            {labels.map((label, i) => {
                              const shape = shapeScale(label.datum)
                              const isValidElement = React.isValidElement(shape)
                              return i > 3 ? (
                                ""
                              ) : (
                                <LegendItem className="item__tooltip" key={`legend-quantile-${i}`} flexDirection="row">
                                  <div className="legend__col">
                                    <svg>
                                      {isValidElement
                                        ? React.cloneElement(shape as React.ReactElement)
                                        : React.createElement(shape as React.ComponentType<{ fill: string }>, {
                                            fill: color,
                                          })}
                                    </svg>
                                    <LegendLabel className="label">
                                      {label.datum === "Questions orales"
                                        ? "Questions"
                                        : label.datum === "Mediane des présences"
                                        ? "Mediane"
                                        : label.text}
                                    </LegendLabel>
                                  </div>
                                  <div className="legend__col">
                                    <LegendLabel className="labelValue" align={"flex-end"}>
                                      {label.datum === "Présences"
                                        ? nearest.PresenceEnHemicycle + nearest.PresencesEnCommission != 0
                                          ? nearest.PresenceEnHemicycle + nearest.PresencesEnCommission
                                          : "0"
                                        : null}
                                      {label.datum === "Questions orales"
                                        ? nearest.Question != 0
                                          ? nearest.Question
                                          : "0"
                                        : null}
                                      {label.datum === "Participations"
                                        ? nearest.ParticipationEnHemicycle + nearest.ParticipationsEnCommission != 0
                                          ? nearest.ParticipationEnHemicycle + nearest.ParticipationsEnCommission
                                          : "0"
                                        : null}
                                      {label.datum === "Mediane des présences"
                                        ? nearest.MedianeTotal != 0
                                          ? nearest.MedianeTotal
                                          : "0"
                                        : null}
                                    </LegendLabel>
                                  </div>
                                </LegendItem>
                              )
                            })}
                          </div>
                        )}
                      </Legend>
                    ) : (
                      <div className="legend__vacances">Vacances parlementaires</div>
                    )}
                  </AugoraTooltip>
                )
              }}
            />
          </XYChart>
        </Group>
      </svg>
    </div>
  )
}
