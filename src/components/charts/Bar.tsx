import React from "react"
import { Bar } from "@visx/shape"
import { Group } from "@visx/group"
import { AxisLeft, AxisBottom } from "@visx/axis"
import { GridRows } from "@visx/grid"
import { scaleBand, scaleLinear } from "@visx/scale"
import { useTooltip } from "@visx/tooltip"
import ChartTooltip from "components/charts/ChartTooltip"

interface BarsProps {
  width: number
  height: number
  margin: { top: number; left: number; right: number; bottom: number }
  events?: boolean
  data: { id: string; label: string; value: number; color: string }[]
  totalDeputes: number
}

export default function BarChart({ width, height, margin, data, totalDeputes }: BarsProps) {
  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } = useTooltip<Chart.Tooltip>()

  // bounds
  const verticalMargin = 120
  const xMax = width
  const yMax = height - verticalMargin

  // accessors
  const sigle = (d) => d.id
  const nombreDeputes = (d) => d.value
  const colorGroupe = (d) => d.color
  const labelGroupe = (d) => d.label

  // scales, memoize for performance
  const xScale = scaleBand<string>({
    range: [xMax, 0],
    round: true,
    domain: data.map(sigle).reverse(),
    padding: 0.15,
  })

  const yScale = scaleLinear<number>({
    range: [yMax, 0],
    round: true,
    domain: [0, Math.max(...data.map(nombreDeputes))],
  })

  const handleMouseLeave = () => {
    hideTooltip()
  }

  const handleMouseMove = (event, data) => {
    const top = event.clientY
    const left = event.clientX
    showTooltip({
      tooltipData: {
        key: labelGroupe(data),
        bar: nombreDeputes(data),
        color: colorGroupe(data),
      },
      tooltipTop: top,
      tooltipLeft: left,
    })
  }

  return width < 10 ? null : (
    <div style={{ position: "relative" }}>
      <svg width={width} height={height}>
        <rect width={width} height={height} fill="url(#teal)" rx={14} />
        <Group top={verticalMargin / 2}>
          <AxisLeft scale={yScale.range([yMax, 0])} numTicks={6} />
          <GridRows scale={yScale.range([yMax, 0])} width={xMax} height={yMax} stroke="#e0e0e0" numTicks={6} />

          <text x="-70" y="15" transform="rotate(-90)" className="description_y">
            Nombre de députés
          </text>
        </Group>
        <Group top={verticalMargin / 2}>
          {data.map((d) => {
            const sigleAccessor = sigle(d)
            const barWidth = xScale.bandwidth()
            const barHeight = yMax - (yScale(nombreDeputes(d)) ?? 0)
            const hasSpaceForLabel = barHeight >= 25
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
                  fill={colorGroupe(d)}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={(event) => handleMouseMove(event, d)}
                />
                {hasSpaceForLabel &&
                  (nombreDeputes(d) < 100 ? (
                    <text x={barX} y={yMax - barHeight / 2} dx={"+.6em"} dy={"+.33em"} className="label">
                      {nombreDeputes(d)}
                    </text>
                  ) : (
                    <text x={barX} y={yMax - barHeight / 2} dx={"+.3em"} dy={"+.33em"} className="label">
                      {nombreDeputes(d)}
                    </text>
                  ))}
              </Group>
            )
          })}
        </Group>
        <Group top={verticalMargin / 2}>
          <AxisBottom scale={xScale.range([xMax, 0])} top={yMax} />
        </Group>
      </svg>
      {tooltipOpen && tooltipData && (
        <ChartTooltip tooltipTop={tooltipTop} tooltipLeft={tooltipLeft} totalDeputes={totalDeputes} tooltipData={tooltipData} />
      )}
    </div>
  )
}
