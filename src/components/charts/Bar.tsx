import React, { useMemo } from "react"
import { Bar } from "@visx/shape"
import { Group } from "@visx/group"
import { AxisLeft } from "@visx/axis"
import letterFrequency, { LetterFrequency } from "@visx/mock-data/lib/mocks/letterFrequency"
import { scaleBand, scaleLinear } from "@visx/scale"

const data = letterFrequency.slice(5)
const verticalMargin = 120

// accessors
const getLetter = (d: LetterFrequency) => d.letter
const getLetterFrequency = (d: LetterFrequency) => Number(d.frequency) * 100

export type BarsProps = {
  width: number
  height: number
  margin: { [key: string]: string }
  events?: boolean
  //groupeParlementaire: toto
  //fréquenceGroupeParlementaire: tata
}

export default function BarChart({ width, height, margin, events = false }: BarsProps) {
  // bounds
  const xMax = width
  const yMax = height - verticalMargin

  // accessors
  const x = (d) => d.letter
  const y = (d) => +d.frequency * 100

  // scales, memoize for performance
  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, xMax],
        round: true,
        domain: data.map(getLetter),
        padding: 0.4,
      }),
    [xMax]
  )
  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [yMax, 0],
        round: true,
        domain: [0, Math.max(...data.map(getLetterFrequency))],
      }),
    [yMax]
  )

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <rect width={width} height={height} fill="url(#teal)" rx={14} />
      <Group top={verticalMargin / 2}>
        {data.map((d) => {
          const letter = getLetter(d)
          const barWidth = xScale.bandwidth()
          const barHeight = yMax - (yScale(getLetterFrequency(d)) ?? 0)
          const barX = xScale(letter)
          const barY = yMax - barHeight
          return (
            <Group key={`bar-${letter}`} left={margin.left} top={margin.top}>
              {/* <Group key={`bar-${letter}`}> */}
              <Bar
                key={`bar-${letter}`}
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill="rgba(23, 233, 217, .5)"
                onClick={() => {
                  if (events) alert(`clicked: ${JSON.stringify(Object.values(d))}`)
                }}
              />
              {/* <AxisLeft scale={yScale.range([yMax, 0])} /> */}
              <text x={barX} y={barY} fill="black" fontSize={12} dx={"-.2em"} dy={"-.33em"} style={{ fontFamily: "arial" }}>
                {`${Number(y(d)).toFixed(1)}%`}
              </text>
              <text x={xScale(x(d))} y={yMax} fill="black" fontSize={12} dx={".32em"} dy={"1em"} style={{ fontFamily: "arial" }}>
                {letter}
              </text>
            </Group>
          )
        })}
      </Group>
    </svg>
  )
}
