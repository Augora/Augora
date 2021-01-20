import React, { useMemo } from "react"
import { Bar } from "@visx/shape"
import { Group } from "@visx/group"
import { AxisLeft, AxisBottom } from "@visx/axis"
import { GridRows } from "@visx/grid"
import { scaleBand, scaleLinear } from "@visx/scale"
import { SeriesPoint } from "@visx/shape/lib/types"
import { useTooltip, useTooltipInPortal, defaultStyles } from "@visx/tooltip"

interface BarsProps {
  width: number
  height: number
  margin: { top: number; left: number; right: number; bottom: number }
  events?: boolean
  data: { id: string; label: string; value: number; color: string }[]
}

type TooltipData = {
  key: string
  bar: string
  color: string
}[]

let tooltipTimeout: number

export default function BarChart({ width, height, margin, events = false, data }: BarsProps) {
  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } = useTooltip<TooltipData>()
  const { containerRef, TooltipInPortal } = useTooltipInPortal()

  // bounds
  const verticalMargin = 120
  const xMax = width
  const yMax = height - verticalMargin
  const tooltipStyles = {
    ...defaultStyles,
    minWidth: 60,
    backgroundColor: "black",
    color: "white",
  }

  // accessors
  const sigle = (d) => d.id
  const nombreDeputes = (d) => d.value
  const colorGroupe = (d) => d.color
  const labelGroupe = (d) => d.label

  // scales, memoize for performance
  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [xMax, 0],
        round: true,
        domain: data.map(sigle).reverse(),
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
    <div style={{ position: "relative" }}>
      <svg width={width} height={height}>
        <rect width={width} height={height} fill="url(#teal)" rx={14} />
        <Group top={verticalMargin / 2}>
          <AxisLeft scale={yScale.range([yMax, 0])} numTicks={6} />
          <GridRows scale={yScale.range([yMax, 0])} width={xMax} height={yMax} stroke="#e0e0e0" numTicks={6} />

          <text x="-70" y="15" transform="rotate(-90)" fontSize={10}>
            Nombre de députés
          </text>
        </Group>
        <Group top={verticalMargin / 2}>
          {data.map((d) => {
            const sigleAccessor = sigle(d)
            const barWidth = xScale.bandwidth()
            const barHeight = yMax - (yScale(nombreDeputes(d)) ?? 0)
            const barX = xScale(sigleAccessor)
            const barY = yMax - barHeight
            return (
              <Group key={`bar-${sigleAccessor}`} left={margin.left} top={margin.top}>
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
                  onMouseLeave={() => {
                    tooltipTimeout = window.setTimeout(() => {
                      hideTooltip()
                    }, 300)
                  }}
                  onMouseMove={(event) => {
                    if (tooltipTimeout) clearTimeout(tooltipTimeout)
                    const top = event.clientY - margin.top - height
                    const left = barX + width / 2
                    showTooltip({
                      tooltipData: [sigle(d), nombreDeputes(d), colorGroupe(d)],
                      tooltipTop: top,
                      tooltipLeft: left,
                    })
                  }}
                />
                return(
                {nombreDeputes(d) < 100 ? (
                  <text x={barX} y={barY} fill="black" fontSize={12} dx={"+.4em"} dy={"-.33em"} style={{ fontFamily: "arial" }}>
                    {nombreDeputes(d)}
                  </text>
                ) : (
                  <text x={barX} y={barY} fill="black" fontSize={12} dy={"-.33em"} style={{ fontFamily: "arial" }}>
                    {nombreDeputes(d)}
                  </text>
                )}
                )
              </Group>
            )
          })}
        </Group>
        <Group top={verticalMargin / 2}>
          <AxisBottom scale={xScale.range([xMax, 0])} top={yMax} />
        </Group>
      </svg>
      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          key={Math.random()} // update tooltip bounds each render
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
        >
          <div>{tooltipData[0]}</div>
          <div>{tooltipData[1]} députés x% </div>
          {/* <div>{tooltipData}</div> */}
        </TooltipInPortal>
      )}
    </div>
  )
}
