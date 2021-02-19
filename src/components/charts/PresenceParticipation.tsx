import React from "react"
import orderBy from "lodash/orderBy"
import { Group } from "@visx/group"
import { curveMonotoneX } from "@visx/curve"
import { getNbActivitesMax } from "components/deputies-list/deputies-list-utils"
import dayjs from "dayjs"
import "dayjs/locale/fr"
import { XYChart, AnimatedAxis, AnimatedBarSeries, AnimatedGrid, AnimatedLineSeries, AnimatedAreaSeries } from "@visx/xychart"
import { Glyph as CustomGlyph, GlyphSquare } from "@visx/glyph"
import { Legend, LegendItem, LegendLabel } from "@visx/legend"
import { scaleOrdinal } from "@visx/scale"

dayjs.locale("fr")

const getDates = (date: string) => {
  return {
    dateDebut: dayjs(date).format("DD MM YY"),
    MonthData: dayjs(date).format("MMM YYYY"),
  }
}

export default function PresenceParticipation({ width, height, data, color }) {
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

  const getDate = (d) => getDates(d.DateDeDebut.split("T")[0])

  const glyphSize = 120
  const glyphPosition = marginTop / 6
  const shapeScale = scaleOrdinal<string, React.FC | React.ReactNode>({
    domain: ["Présences", "Participations", "Questions orales", "Médiane des députés", "Vacances"],
    range: [
      <CustomGlyph left={5} top={glyphPosition}>
        <line x1="0" y1="0" x2="12" y2="0" stroke={color} strokeWidth={4} />
      </CustomGlyph>,
      <CustomGlyph left={5} top={glyphPosition}>
        <line x1="0" y1="0" x2="12" y2="0" stroke={color} strokeWidth={4} opacity={opacityParticipation} />
      </CustomGlyph>,
      <GlyphSquare key="Questions orales" size={glyphSize} top={glyphPosition} left={glyphPosition} fill={color} />,
      <GlyphSquare key="Médiane des députés" size={glyphSize} top={glyphPosition} left={glyphPosition} fill={medianeDepute} />,
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
              xAccessor={(d) => getDate(d).dateDebut}
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
              xAccessor={(d) => getDate(d).dateDebut}
              yAccessor={(d) => d.ParticipationEnHemicycle + d.ParticipationsEnCommission}
              curve={curveType}
              stroke={color}
              strokeOpacity={opacityParticipation}
            />
            <AnimatedLineSeries
              dataKey={"Presence"}
              data={orderedWeeks}
              xAccessor={(d) => getDate(d).dateDebut}
              yAccessor={(d) => d.PresenceEnHemicycle + d.PresencesEnCommission}
              stroke={color}
              curve={curveType}
            />
            <AnimatedBarSeries
              dataKey={"Question"}
              data={orderedWeeks}
              xAccessor={(d) => getDate(d).dateDebut}
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
          </XYChart>
          <XYChart
            width={width}
            height={height}
            xScale={{
              type: "band",
              range: [0, xMax],
              domain: orderedWeeks.map((d) => getDate(d).MonthData),
            }}
            yScale={{ type: "linear", range: [0, yMax], padding: 0.1, domain: [maxActivite, 0] }}
          >
            <AnimatedAxis orientation="bottom" hideAxisLine={true} tickLength={6} animationTrajectory={animationTrajectoire} />
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
