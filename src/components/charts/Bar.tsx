import React from "react"
import { Bar } from "@visx/shape"
import { Group } from "@visx/group"
import { AxisLeft, AxisBottom } from "@visx/axis"
import { GridRows } from "@visx/grid"
import { scaleBand, scaleLinear } from "@visx/scale"
import { useTooltip } from "@visx/tooltip"
import ChartTooltip from "components/charts/ChartTooltip"

export default function BarChart({ width, height, data }: Chart.BaseProps) {
  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } = useTooltip<Chart.Tooltip>()

  const totalDeputies = data.reduce((a, b) => a + b.value, 0)

  // bounds
  const margin = 50
  const xMax = width - margin
  const yMax = height - margin

  // scales, memoize for performance
  const xScale = scaleBand<string>({
    range: [xMax, 0],
    round: true,
    domain: data.map((d) => d.id).reverse(),
    padding: 0.15,
  })

  const yScale = scaleLinear<number>({
    range: [yMax, 0],
    round: true,
    domain: [0, Math.max(...data.map((d) => d.value))],
  })

  const handleMouseLeave = () => {
    hideTooltip()
  }

  const handleMouseMove = (event, data: Chart.Data) => {
    showTooltip({
      tooltipData: {
        key: data.label,
        bar: data.value,
        color: data.color,
      },
      tooltipTop: event.clientY,
      tooltipLeft: event.clientX,
    })
  }

  return width < 10 ? null : (
    <div className="barchart chart">
      <svg width={width} height={height}>
        <Group top={margin / 2} left={margin / 2}>
          <AxisLeft scale={yScale.range([yMax, 0])} numTicks={6} />
          <GridRows scale={yScale.range([yMax, 0])} width={xMax} height={yMax} stroke="#e0e0e0" numTicks={6} />

          <text x={-yMax + 50} y={-50} transform="rotate(-90)" className="description_y">
            Nombre de députés
          </text>
        </Group>
        <Group top={margin / 2} left={margin / 2}>
          {data.map((d, index) => {
            const barWidth = xScale.bandwidth()
            const barHeight = yMax - (yScale(d.value) ?? 0)
            const barX = xScale(d.id)
            const barY = yMax - barHeight
            return (
              <Group key={`bar-${d.id}-${index}`}>
                <Bar
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  fill={d.color}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={(event) => handleMouseMove(event, d)}
                />
                {barHeight >= 25 && (
                  <text
                    x={barX + barWidth / 2}
                    y={yMax - barHeight / 2}
                    dx={d.value < 100 ? "-.6em" : "-.9em"}
                    dy={"+.33em"}
                    className="label"
                    style={{ pointerEvents: "none" }}
                  >
                    {d.value}
                  </text>
                )}
              </Group>
            )
          })}
        </Group>
        <Group top={margin / 2} left={margin / 2}>
          <AxisBottom scale={xScale.range([xMax, 0])} top={yMax} />
        </Group>
      </svg>
      {tooltipOpen && tooltipData && (
        <ChartTooltip
          tooltipTop={tooltipTop}
          tooltipLeft={tooltipLeft}
          title={tooltipData.key}
          nbDeputes={tooltipData.bar}
          totalDeputes={totalDeputies}
          color={tooltipData.color}
        />
      )}
    </div>
  )
}
