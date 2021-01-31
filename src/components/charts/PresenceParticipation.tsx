import React from "react"
import orderBy from "lodash/orderBy"
import { Bar } from "@visx/shape"
import { Group } from "@visx/group"
import { AxisLeft, AxisBottom } from "@visx/axis"
import { GridRows } from "@visx/grid"
import { scaleBand, scaleLinear } from "@visx/scale"
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

  const orderedWeeks = orderBy(data, "DateDeDebut")

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
            const barWidth = dateScale.bandwidth()
            // Vacances
            const vacHeight = yMax
            const dataX = dateScale(getDates(d.DateDeFin.split("T")[0]).dateDay)
            const vacY = yMax - vacHeight
            // Questions
            const questionHeight = yMax - (activiteScale(d.Question) ?? 0)
            const questionY = yMax - questionHeight
            // Presence Hémicycle
            const presenceHeight = yMax - activiteScale(d.PresenceEnHemicycle) ?? 0
            const presenceHemicycleY = yMax - presenceHeight

            return (
              <>
                <Group key={`key-${d.DateDeFin}-${index}`}>
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
                    <Group key={`PresenceHemicycle-${d.PresenceEnHemicycle}-${index}`}>
                      {/* A convertir en linePath */}
                      <Bar
                        x={dataX}
                        y={presenceHemicycleY}
                        rx="3" //border radius
                        ry="3"
                        width={barWidth}
                        height={presenceHeight}
                        fill={"green"}
                      />
                    </Group>
                  }
                  {
                    <Group key={`Question-${d.Question}-${index}`}>
                      <Bar
                        x={dataX}
                        y={questionY}
                        rx="3" //border radius
                        ry="3"
                        width={barWidth}
                        height={questionHeight}
                        fill={"red"}
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
