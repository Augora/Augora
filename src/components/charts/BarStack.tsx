import React, { useMemo } from "react"
import { BarStack } from "@visx/shape"
import { GridRows } from "@visx/grid"
import { AxisLeft, AxisBottom } from "@visx/axis"
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale"
import { Group } from "@visx/group"

interface BarStackProps {
  width: number
  height: number
  events?: boolean
  data: { id: string; label: string; value: number; color: string }[]
  dataAge: { age: any; [x: string]: number }[]
  maxAge: number
}

export default function BarStackChart({ width, height, events = false, data, dataAge, maxAge }: BarStackProps) {
  // bounds
  const verticalMargin = 120
  const xMax = width
  const yMax = height - verticalMargin

  // accessors
  const age = (d) => d.age
  const sigle = (d) => d.id
  const nombreDeputes = (d) => d.LFI
  const colorGroupe = (d) => d.color

  const sigleList = data.map(sigle)

  //const barX = xScale(sigleAccessor)

  // scales, memoize for performance

  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, xMax],
        round: true,
        domain: dataAge.reverse().map(age),
        padding: 0.4,
      }),
    [xMax]
  )

  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [yMax, 0],
        round: true,
        domain: [0, maxAge],
      }),
    [yMax]
  )

  const colorScale = (key, index) => {
    console.log("colorScale :", key, index)
    const foundValue = data.find((value) => {
      if (value.id === key) return true
    })
    console.log("colorScale", "foundValue", foundValue)
    if (foundValue) return foundValue.color
    else return ""
  }

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <rect width={width} height={height} fill="url(#teal)" rx={14} />
      <Group top={verticalMargin / 2}>
        <AxisLeft scale={yScale.range([yMax, 0])} numTicks={6} />
        <GridRows scale={yScale.range([yMax, 0])} width={xMax} height={yMax} stroke="#e0e0e0" numTicks={6} />
        <text x="-70" y="15" transform="rotate(-90)" fontSize={10}>
          Nombre de députés
        </text>
        <text x={xMax + 10} y={yMax} fontSize={10}>
          Âge
        </text>
      </Group>
      <Group top={verticalMargin / 2}>
        <BarStack<{ age: any; [x: string]: number }, string>
          data={dataAge}
          keys={sigleList}
          x={age}
          xScale={xScale}
          yScale={yScale}
          color={colorScale}
        >
          {(barStacks) =>
            barStacks.map((barStack) =>
              barStack.bars.map((bar) => (
                <rect
                  key={`bar-stack-${barStack.index}-${bar.index}`}
                  x={bar.x}
                  y={bar.y}
                  height={bar.height}
                  width={bar.width}
                  fill={bar.color}
                />
              ))
            )
          }
        </BarStack>
      </Group>
      <Group top={verticalMargin / 2}>
        <AxisBottom scale={xScale.range([xMax, 0])} top={yMax} numTicks={dataAge.reverse().map(age).length} />
      </Group>
    </svg>
  )
}
