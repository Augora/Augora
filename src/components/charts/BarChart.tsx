import React from "react"
import { Bar } from "@visx/shape"
import { Group } from "@visx/group"
import { AxisLeft, AxisBottom } from "@visx/axis"
import { GridRows } from "@visx/grid"
import { scaleBand, scaleLinear } from "@visx/scale"
import { useTooltip } from "@visx/tooltip"
import { isMobile } from "react-device-detect"
import ChartTooltip from "components/charts/ChartTooltip"

export default function BarChart({ width, height, data }: Chart.BaseProps) {
  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } = useTooltip<Chart.Tooltip>()

  const totalDeputies = data.reduce((a, b) => a + b.value, 0)

  // bounds
  const marginTop = 30
  const marginLeft = 20
  const marginGraph = 30
  const xMax = width
  const yMax = height - marginTop

  // scales, memoize for performance
  const xScale = scaleBand<string>({
    range: [xMax, 0],
    round: true,
    domain: data.map((d) => d.id).reverse(),
    paddingInner: 0.2,
    paddingOuter: isMobile ? -0.5 : -0.1,
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
        <Group top={marginTop / 2} left={marginLeft / 2}>
          <AxisLeft
            axisClassName="chart__axislabel"
            scale={yScale.range([yMax, 0])}
            numTicks={6}
            hideAxisLine={true}
            hideTicks={true}
          />
          <GridRows
            className="chart__rows"
            scale={yScale.range([yMax, 0])}
            width={xMax}
            height={yMax}
            numTicks={6}
            strokeWidth={2}
          />
        </Group>
        <Group top={marginTop / 2} left={marginGraph / 2}>
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
                  rx="3" //border radius
                  ry="3"
                  width={barWidth}
                  height={barHeight}
                  fill={d.color}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={(event) => handleMouseMove(event, d)}
                />
                {!isMobile && barHeight >= 25 && (
                  <text
                    className="chart__number barchart__number"
                    x={barX + barWidth / 2}
                    y={yMax - barHeight / 2}
                    dx={d.value >= 100 ? "-.9em" : d.value >= 10 ? "-.6em" : "-.3em"}
                    dy={"+.33em"}
                  >
                    {d.value}
                  </text>
                )}
              </Group>
            )
          })}
        </Group>
        <Group top={marginTop / 2} left={marginGraph / 2}>
          <AxisBottom
            axisClassName="chart__axislabel axislabel__bottom"
            tickClassName="chart__axistick"
            scale={xScale.range([xMax, 0])}
            top={yMax}
            hideAxisLine={true}
            tickLength={6}
          />
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
