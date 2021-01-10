import React, { useMemo } from "react"
import { BarStack } from "@visx/shape"
import { GridRows } from "@visx/grid"
import { AxisLeft, AxisBottom } from "@visx/axis"
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale"
import { Group } from "@visx/group"

interface BarStackProps {
  width: number
  height: number
  margin?: { top: number; right: number; bottom: number; left: number }
  events?: boolean
  data: { id: string; label: string; value: number; color: string }[]
  dataAge: { age: string; groupeValueByAge: Object; groupeColorByAge: Object }[]
}

export default function BarStackChart({ width, height, events = false, margin, data, dataAge }: BarStackProps) {
  // bounds
  const verticalMargin = 120
  const xMax = width
  const yMax = height - verticalMargin

  // accessors
  const age = (d) => d.age
  const nombreDeputes = (d) => d.groupeValueByAge
  const colorGroupe = (d) => d.color

  console.log(data)
  console.log(dataAge)

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
        domain: [0, Math.max(...dataAge.map(nombreDeputes))],
      }),
    [yMax]
  )

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <rect width={width} height={height} fill="url(#teal)" rx={14} />
      <Group top={verticalMargin / 2}>
        <AxisLeft scale={yScale.range([yMax, 0])} numTicks={6} />
        <GridRows scale={yScale.range([yMax, 0])} width={xMax} height={yMax} stroke="#e0e0e0" numTicks={6} />
        <AxisBottom scale={xScale.range([xMax, 0])} top={yMax} numTicks={dataAge.reverse().map(age).length} />
        <text x="-70" y="15" transform="rotate(-90)" fontSize={10}>
          Nombre de députés
        </text>
        <text x={xMax + 10} y={yMax} fontSize={10}>
          Âge
        </text>
      </Group>
    </svg>
  )
}
