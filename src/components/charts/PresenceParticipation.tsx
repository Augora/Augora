import React from "react"
import orderBy from "lodash/orderBy"
import { Group } from "@visx/group"
import { curveMonotoneX } from "@visx/curve"
import { getNbActivitesMax } from "components/deputies-list/deputies-list-utils"
import dayjs from "dayjs"
import "dayjs/locale/fr"
import {
  XYChart,
  AnimatedAxis,
  AnimatedBarSeries,
  AnimatedGrid,
  AnimatedLineSeries,
  AnimatedAreaSeries,
  Tooltip,
} from "@visx/xychart"
import { Glyph as CustomGlyph, GlyphSquare } from "@visx/glyph"
import { Legend, LegendItem, LegendLabel } from "@visx/legend"
import { scaleOrdinal } from "@visx/scale"
import AugoraTooltip from "components/tooltip/Tooltip"

dayjs.locale("fr")

const getDates = (date: string) => {
  return {
    MonthData: dayjs(date).format("MMM YYYY"),
    DayData: dayjs(date).format("DD MMMM YYYY"),
  }
}

interface IPresence {
  width: number
  height: number
  data: Chart.Activites[]
  color: string
}

export default function PresenceParticipation(props: IPresence) {
  const { width, height, data, color } = props
  // bounds
  const marginTop = 50
  const marginLeft = 20
  const xMax = width
  const yMax = height - marginTop
  var maxActivite = getNbActivitesMax(data) < 14 ? 14 : getNbActivitesMax(data)

  //const medianeArray = orderBy(mediane, "DateDeDebut")
  const orderedWeeks = orderBy(data, "DateDeDebut")
  const animationTrajectoire = "center"
  const curveType = curveMonotoneX

  const vacancesColor = "#696969"
  const medianeDepute = "#B7B7B7"
  const opacityParticipation = 0.5

  const glyphSize = 120
  const glyphPosition = marginTop / 6
  const shapeScale = scaleOrdinal<string, React.FC | React.ReactNode>({
    domain: ["Présences", "Participations", "Questions orales", "Mediane des députés", "Vacances"],
    range: [
      <CustomGlyph left={5} top={glyphPosition}>
        <line x1="0" y1="0" x2="12" y2="0" stroke={color} strokeWidth={4} />
      </CustomGlyph>,
      <CustomGlyph left={5} top={glyphPosition}>
        <line x1="0" y1="0" x2="12" y2="0" stroke={color} strokeWidth={4} opacity={opacityParticipation} />
      </CustomGlyph>,
      <GlyphSquare key="Questions orales" size={glyphSize} top={glyphPosition} left={glyphPosition} fill={color} />,
      <GlyphSquare key="Mediane des députés" size={glyphSize} top={glyphPosition} left={glyphPosition} fill={medianeDepute} />,
      <GlyphSquare key="Vacances" size={glyphSize} top={glyphPosition} left={glyphPosition} fill={vacancesColor} />,
    ],
  })

  return width < 10 ? null : (
    <div className="presence">
      <svg width={width} height={height}>
        <Group top={marginTop / 2} left={marginLeft}>
          <XYChart
            width={width + marginLeft * 5}
            height={height}
            xScale={{ type: "band", range: [0, xMax] }}
            yScale={{ type: "linear", range: [0, yMax], padding: 0.1, domain: [maxActivite, 0] }}
          >
            <AnimatedGrid left={5} numTicks={maxActivite / 2} columns={false} />
            <AnimatedBarSeries
              dataKey={"Vacances"}
              data={orderedWeeks}
              xAccessor={(d) => d.DateDeDebut}
              yAccessor={(d) => (d.Vacances ? maxActivite : 0)}
              colorAccessor={() => vacancesColor}
            />
            {/* <AnimatedAreaSeries
              dataKey={"Mediane"}
              data={medianeArray}
              xAccessor={(d) => getDate(d).dateDebut}
              yAccessor={(d) => d.PresenceEnHemicycle + d.PresencesEnCommission}
              stroke={medianeDepute}
              fill={medianeDepute}
              renderLine={false}
              curve={curveType}
              opacity={opacityParticipation}
            /> */}
            <AnimatedLineSeries
              dataKey={"Participation"}
              data={orderedWeeks}
              xAccessor={(d) => d.DateDeDebut}
              yAccessor={(d) => d.ParticipationEnHemicycle + d.ParticipationsEnCommission}
              curve={curveType}
              stroke={color}
              strokeOpacity={opacityParticipation}
            />
            <AnimatedLineSeries
              dataKey={"Presence"}
              data={orderedWeeks}
              xAccessor={(d) => d.DateDeDebut}
              yAccessor={(d) => d.PresenceEnHemicycle + d.PresencesEnCommission}
              stroke={color}
              curve={curveType}
            />
            <AnimatedBarSeries
              dataKey={"Question"}
              data={orderedWeeks}
              xAccessor={(d) => d.DateDeDebut}
              yAccessor={(d) => d.Question}
              colorAccessor={() => color}
            />
            <AnimatedAxis
              orientation="left"
              hideAxisLine={true}
              left={5}
              tickStroke={"none"}
              tickLength={6}
              numTicks={maxActivite / 2}
              animationTrajectory={animationTrajectoire}
            />
            <AnimatedAxis
              orientation="bottom"
              hideAxisLine={true}
              tickLength={6}
              animationTrajectory={animationTrajectoire}
              tickFormat={(date: string) => getDates(date.split("T")[0]).MonthData}
            />
            <Tooltip<Chart.Activites>
              className="charttooltip__container"
              unstyled={true}
              renderTooltip={({ tooltipData }) => {
                const key = tooltipData.nearestDatum.index
                const nearest = tooltipData.nearestDatum.datum
                console.log("Présences", nearest.PresenceEnHemicycle + nearest.PresencesEnCommission)
                console.log("Participations", nearest.ParticipationEnHemicycle + nearest.ParticipationsEnCommission)
                console.log("Questions orales", nearest.Question)
                return (
                  <AugoraTooltip title={`Semaine du ${getDates(nearest.DateDeDebut).DayData}`}>
                    <Legend scale={shapeScale}>
                      {(labels) => (
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                          {labels.map((label, i) => {
                            const shape = shapeScale(label.datum)
                            const isValidElement = React.isValidElement(shape)
                            // Passer à 3 pour intégrer la mediane
                            return i > 2 ? (
                              ""
                            ) : (
                              <LegendItem key={`legend-quantile-${i}`} flexDirection="row">
                                <div className="legend__col">
                                  <svg width={25} height={25}>
                                    {isValidElement
                                      ? React.cloneElement(shape as React.ReactElement)
                                      : React.createElement(shape as React.ComponentType<{ fill: string }>, {
                                          fill: color,
                                        })}
                                  </svg>
                                  <LegendLabel className="label">
                                    {label.datum === "Questions orales"
                                      ? "Questions"
                                      : label.datum === "Mediane des députés"
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
                                    {label.datum === "Questions orales" ? (nearest.Question != 0 ? nearest.Question : "0") : null}
                                    {label.datum === "Participations"
                                      ? nearest.ParticipationEnHemicycle + nearest.ParticipationsEnCommission != 0
                                        ? nearest.ParticipationEnHemicycle + nearest.ParticipationsEnCommission
                                        : "0"
                                      : null}
                                    {label.datum === "Mediane" ? "0" : null}
                                  </LegendLabel>
                                </div>
                              </LegendItem>
                            )
                          })}
                        </div>
                      )}
                    </Legend>
                  </AugoraTooltip>
                )
              }}
            />
          </XYChart>
        </Group>
      </svg>
      <Legend scale={shapeScale}>
        {(labels) => (
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
            {labels.map((label, i) => {
              const shape = shapeScale(label.datum)
              const isValidElement = React.isValidElement(shape)
              return (
                <LegendItem key={`legend-quantile-${i}`} flexDirection="row" margin="0 10px">
                  <svg width={25} height={25}>
                    {isValidElement
                      ? React.cloneElement(shape as React.ReactElement)
                      : React.createElement(shape as React.ComponentType<{ fill: string }>, {
                          fill: color,
                        })}
                  </svg>
                  <LegendLabel align="left" margin="0 0 12px 0">
                    {label.text}
                  </LegendLabel>
                </LegendItem>
              )
            })}
          </div>
        )}
      </Legend>
    </div>
  )
}
