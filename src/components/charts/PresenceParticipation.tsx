import React from "react"
import orderBy from "lodash/orderBy"
import { Bar } from "@visx/shape"
import { Group } from "@visx/group"
import { AxisLeft, AxisBottom } from "@visx/axis"
import { LinePath } from "@visx/shape"
import { curveMonotoneY } from "@visx/curve"
import { GridRows } from "@visx/grid"
import { scaleBand, scaleLinear, scaleTime } from "@visx/scale"
import { getNbActivitesMax } from "components/deputies-list/deputies-list-utils"
import cityTemperature, { CityTemperature } from "@visx/mock-data/lib/mocks/cityTemperature"
import dayjs from "dayjs"
import "dayjs/locale/fr"
dayjs.locale("fr")

const getDates = (date: string) => {
  return {
    dateDay: dayjs(date).format("MMM YYYY"),
  }
}

export default function PresenceParticipation({ width, height, data, color }) {
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

  const orderedWeeks = orderBy(data, "DateDeDebut")
  console.log(orderedWeeks.map((d) => getDates(d.DateDeFin.split("T")[0]).dateDay))

  const dateScale = scaleBand({
    domain: orderedWeeks.map((d) => getDates(d.DateDeFin.split("T")[0]).dateDay),
    range: [0, xMax],
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
            const barWidth = dateScale.bandwidth()
            // Vacances
            const vacHeight = yMax
            const dataX = dateScale(getDates(d.DateDeFin.split("T")[0]).dateDay)
            const vacY = yMax - vacHeight
            // Questions
            const questionHeight = yMax - (activiteScale(d.Question) ?? 0)
            const questionY = yMax - questionHeight

            return (
              <>
                <Group key={`key-${d.DateDeFin}-${index}`}>
                  {
                    <Group key={`PresenceHemicycle-${d.PresenceEnHemicycle}-${index}`}>
                      <LinePath
                        data={orderedWeeks}
                        x={(d) => dateScale(getDates(d.DateDeFin.split("T")[0]).dateDay) ?? 0}
                        y={(d) => activiteScale(d.PresenceEnHemicycle + d.PresencesEnCommission) ?? 0}
                        curve={curveMonotoneY}
                        stroke={color}
                        strokeWidth={1.5}
                      />
                    </Group>
                  }
                  {console.log(d)}
                  {
                    <Group key={`Participations-${d.Participation}-${index}`}>
                      <LinePath
                        data={orderedWeeks}
                        x={(d) => dateScale(getDates(d.DateDeFin.split("T")[0]).dateDay) ?? 0}
                        y={(d) => activiteScale(d.ParticipationEnHemicycle + d.ParticipationsEnCommission) ?? 0}
                        curve={curveMonotoneY}
                        stroke={color}
                        strokeWidth={0.01}
                      />
                    </Group>
                  }
                  {d.Vacances !== 0 && (
                    <Group key={`Vacances-${d.Vacances}-${index}`}>
                      <Bar
                        x={dataX}
                        y={vacY}
                        rx="3" //border radius
                        ry="3"
                        width={barWidth}
                        height={vacHeight}
                        fill={"grey"}
                      />
                    </Group>
                  )}
                  {
                    <Group key={`Question-${d.Question}-${index}`}>
                      <Bar
                        x={dataX}
                        y={questionY}
                        rx="3" //border radius
                        ry="3"
                        width={barWidth}
                        height={questionHeight}
                        fill={color}
                      />
                    </Group>
                  }
                </Group>
              </>
            )
          })}
        </Group>
        <Group top={marginTop / 2} left={marginLeft / 2}>
          <AxisBottom
            axisClassName="chart__axislabel axislabel__bottom"
            tickClassName="chart__axistick"
            scale={dateScale}
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
