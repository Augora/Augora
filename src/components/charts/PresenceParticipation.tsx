import React from "react"
import _ from "lodash"
import { Bar } from "@visx/shape"
import { Group } from "@visx/group"
import { AxisLeft, AxisBottom } from "@visx/axis"
import { GridRows } from "@visx/grid"
import { scaleBand, scaleLinear, coerceNumber, scaleUtc } from "@visx/scale"
import { timeParse, timeFormat } from "d3-time-format"
import { getNbActivitesMax } from "components/deputies-list/deputies-list-utils"
import dayjs from "dayjs"
import "dayjs/locale/fr"
dayjs.locale("fr")

const getDates = (date: string) => {
  return {
    dateDay: dayjs(date).format("MMM YYYY"),
  }
}

export default function PresenceParticipation({ width, height, data }) {
  // bounds
  const marginTop = 50
  const marginLeft = 20
  const xMax = width
  const yMax = height - marginTop

  const activiteScale = scaleLinear({
    range: [yMax, 0],
    round: true,
    domain: [0, getNbActivitesMax(data)],
  })

  const orderedWeeks = _.orderBy(data, "NumeroDeSemaine")
  const dateScale = scaleBand({
    domain: orderedWeeks.map((d) => getDates(d.DateDeFin.split("T")[0]).dateDay),
    range: [xMax, 0],
    padding: 0.15,
  })
  return width < 10 ? null : (
    <div className="presence">
      <svg width={width} height={height}>
        <Group top={marginTop / 2} left={marginLeft / 2}>
          <AxisLeft
            axisClassName="chart__axislabel"
            scale={activiteScale.range([yMax, 0])}
            numTicks={6}
            hideAxisLine={true}
            hideTicks={true}
          />
          <GridRows className="chart__rows" scale={activiteScale} width={xMax} height={yMax} numTicks={6} strokeWidth={2} />
        </Group>
        <Group top={marginTop / 2} left={marginLeft / 2}>
          {orderedWeeks.map((d, index) => {
            // filter sur Vacances
            const barWidth = dateScale.bandwidth()
            const barHeight = yMax
            const barX = dateScale(getDates(d.DateDeFin.split("T")[0]).dateDay)
            const barY = yMax - barHeight

            if (d.Vacances !== 0) {
              return (
                <Group key={`bar-${d.DateDeFin}-${index}`}>
                  <Bar
                    x={barX}
                    y={barY}
                    rx="3" //border radius
                    ry="3"
                    width={barWidth}
                    height={barHeight}
                    fill={"grey"}
                  />
                </Group>
              )
            }
          })}
        </Group>
        <Group top={marginTop / 2} left={marginLeft / 2}>
          <AxisBottom
            axisClassName="chart__axislabel axislabel__bottom"
            tickClassName="chart__axistick"
            scale={dateScale.range([0, xMax])}
            numTicks={11}
            top={yMax}
            hideAxisLine={true}
            tickLength={6}
          />
        </Group>
      </svg>
    </div>
  )
}
