import React from "react"
import orderBy from "lodash/orderBy"
import { Group } from "@visx/group"
import { curveMonotoneX } from "@visx/curve"
import { getNbActivitesMax } from "components/deputies-list/deputies-list-utils"
import dayjs from "dayjs"
import "dayjs/locale/fr"
import { XYChart, AnimatedAreaSeries, AnimatedAxis, AnimatedBarSeries } from "@visx/xychart"
dayjs.locale("fr")

const getDates = (date: string) => {
  return {
    dateFin: dayjs(date).format("DD MM YY"),
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

  const orderedWeeks = orderBy(data, "DateDeDebut")
  const animationTrajectoire = "center"

  return width < 10 ? null : (
    <div className="presence">
      <svg width={width} height={height}>
        <Group top={marginTop / 2} left={marginLeft}>
          <XYChart
            width={width}
            height={height}
            xScale={{ type: "band", range: [0, xMax] }}
            yScale={{ type: "linear", range: [0, yMax], padding: 0.1, domain: [maxActivite, 0] }}
          >
            <>
              <AnimatedBarSeries
                dataKey={"Vacances"}
                data={orderedWeeks}
                xAccessor={(d) => getDates(d.DateDeFin.split("T")[0]).dateFin ?? 0}
                yAccessor={(d) => (d.Vacances ? maxActivite : 0)}
                colorAccessor={() => "#B7B7B7"}
              />
            </>
            <>
              <AnimatedAreaSeries
                dataKey={"Participation"}
                data={orderedWeeks}
                xAccessor={(d) => getDates(d.DateDeFin.split("T")[0]).dateFin}
                yAccessor={(d) => d.ParticipationEnHemicycle + d.ParticipationsEnCommission}
                fill={color}
                color={color}
                fillOpacity={0.4}
                curve={curveMonotoneX}
                renderLine={false}
              />
              <AnimatedAreaSeries
                dataKey={"Presence"}
                data={orderedWeeks}
                xAccessor={(d) => getDates(d.DateDeFin.split("T")[0]).dateFin}
                yAccessor={(d) => d.PresenceEnHemicycle + d.PresencesEnCommission}
                fill={color}
                color={color}
                fillOpacity={0.4}
                curve={curveMonotoneX}
                renderLine={false}
              />
            </>
            <AnimatedAxis
              orientation="left"
              hideAxisLine={true}
              left={5}
              tickStroke={"none"}
              tickLength={6}
              animationTrajectory={animationTrajectoire}
            />
          </XYChart>
          <XYChart
            width={width}
            height={height}
            xScale={{ type: "band", range: [0, xMax], padding: 1 }}
            yScale={{ type: "linear", range: [0, yMax], padding: 0.1, domain: [maxActivite, 0] }}
          >
            <AnimatedBarSeries
              dataKey={"Question"}
              data={orderedWeeks}
              xAccessor={(d) => getDates(d.DateDeFin.split("T")[0]).dateFin ?? 0}
              yAccessor={(d) => d.Question}
              colorAccessor={() => color}
            />
          </XYChart>
          <XYChart
            width={width}
            height={height}
            xScale={{
              type: "band",
              range: [0, xMax],
              domain: orderedWeeks.map((d) => getDates(d.DateDeFin.split("T")[0]).MonthData),
            }}
            yScale={{ type: "linear", range: [0, yMax], padding: 0.1, domain: [maxActivite, 0] }}
          >
            <AnimatedAxis orientation="bottom" hideAxisLine={true} tickLength={6} animationTrajectory={animationTrajectoire} />
          </XYChart>
        </Group>
      </svg>
    </div>
  )
}
