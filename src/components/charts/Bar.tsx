import React, { useMemo } from "react"
import { Bar } from "@visx/shape"
import { Group } from "@visx/group"
import { AxisLeft } from "@visx/axis"
import letterFrequency, { LetterFrequency } from "@visx/mock-data/lib/mocks/letterFrequency"
import { scaleBand, scaleLinear } from "@visx/scale"

//const data = letterFrequency.slice(5)
const verticalMargin = 120

// accessors
//const getLetter = (d: data) => d.letter
// const getLetterFrequency = (d: LetterFrequency) => Number(d.frequency) * 100

export type BarsProps = {
  width: number
  height: number
  margin: { [key: string]: string }
  events?: boolean
  data: { [key: string]: string }
}

export default function BarChart({ width, height, margin, events = false, data }: BarsProps) {
  // bounds
  const xMax = width
  const yMax = height - verticalMargin

  // accessors
  const sigle = (d) => d.id
  const nombreDeputes = (d) => d.value
  const colorGroupe = (d) => d.color

  // scales, memoize for performance
  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, xMax],
        round: true,
        domain: data.map(sigle),
        padding: 0.4,
      }),
    [xMax]
  )
  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [yMax, 0],
        round: true,
        domain: [0, Math.max(...data.map(nombreDeputes))],
      }),
    [yMax]
  )

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <rect width={width} height={height} fill="url(#teal)" rx={14} />
      <Group top={verticalMargin / 2}>
        {data.map((d) => {
          const sigleAccessor = sigle(d)
          const barWidth = xScale.bandwidth()
          const barHeight = yMax - (yScale(nombreDeputes(d)) ?? 0)
          const barX = xScale(sigleAccessor)
          const barY = yMax - barHeight
          return (
            <Group key={`bar-${sigleAccessor}`} left={margin.left} top={margin.top}>
              {/* <Group key={`bar-${letter}`}> */}
              <Bar
                key={`bar-${sigleAccessor}`}
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                //fill="rgba(23, 233, 217, .5)"
                fill={colorGroupe(d)}
                onClick={() => {
                  if (events) alert(`clicked: ${JSON.stringify(Object.values(d))}`)
                }}
              />
              {/* <AxisLeft scale={yScale.range([yMax, 0])} /> */}
              <text x={barX} y={barY} fill="black" fontSize={12} dx={"-.2em"} dy={"-.33em"} style={{ fontFamily: "arial" }}>
                {nombreDeputes(d)}
              </text>
              <text
                x={xScale(sigle(d))}
                y={yMax}
                fill="black"
                fontSize={12}
                dx={".32em"}
                dy={"1em"}
                style={{ fontFamily: "arial" }}
              >
                {sigleAccessor}
              </text>
            </Group>
          )
        })}
      </Group>
    </svg>
  )
}
