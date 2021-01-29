import React from "react"
import { Bar } from "@visx/shape"
import { Group } from "@visx/group"
import { AxisLeft, AxisBottom } from "@visx/axis"
import { GridRows } from "@visx/grid"
import { scaleBand, scaleLinear, coerceNumber, scaleUtc } from "@visx/scale"
import cityTemperature, { CityTemperature } from "@visx/mock-data/lib/mocks/cityTemperature"
import { timeParse, timeFormat } from "d3-time-format"
import { getNbActivitesMax } from "components/deputies-list/deputies-list-utils"
import dayjs from "dayjs"
import "dayjs/locale/fr"
dayjs.locale("fr")

const getDates = () => {
  const now = dayjs()
  const minusOneYear = now.subtract(1, "year")
  let scaleTime = []
  for (var i = 0; i < 13; i++) {
    scaleTime.push(minusOneYear.add(i, "month").format("MMMM YYYY"))
  }
  return {
    scaleTime: scaleTime,
  }
}
console.log(getDates().scaleTime)

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

  const dateScale = scaleBand({
    domain: getDates().scaleTime,
    range: [xMax, 0],
    padding: 0.15,
  })

  const parseDate = timeParse("%Y-%m-%d")

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
        {/* <Group top={marginTop / 2} left={marginLeft / 2}>
          Data
        </Group> */}
        <Group top={marginTop / 2} left={marginLeft / 2}>
          <AxisBottom
            axisClassName="chart__axislabel axislabel__bottom"
            tickClassName="chart__axistick"
            scale={dateScale.range([0, xMax])}
            top={yMax}
            hideAxisLine={true}
            tickLength={6}
            rangePadding={2}
          />
        </Group>
      </svg>
    </div>
  )
}
