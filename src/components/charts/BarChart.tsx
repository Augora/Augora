import React from "react"
import { Bar, Line } from "@visx/shape"
import { Group } from "@visx/group"
import { AxisLeft, AxisBottom } from "@visx/axis"
import { GridRows } from "@visx/grid"
import { scaleBand, scaleLinear } from "@visx/scale"
import { Text } from "@visx/text"
import { useTooltip } from "@visx/tooltip"
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
    paddingOuter: -0.1,
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
                {barHeight >= 25 && (
                  <Text
                    className="chart__number barchart__number"
                    x={barX + barWidth / 2}
                    y={yMax - barHeight / 2}
                    textAnchor={"middle"}
                    verticalAnchor={"middle"}
                    angle={barWidth < 29 ? -90 : 0}
                  >
                    {d.value}
                  </Text>
                )}
              </Group>
            )
          })}
        </Group>
        <Group top={marginTop / 2} left={marginGraph / 2}>
          {window.innerWidth < 420 || (window.innerWidth > 1200 && window.innerWidth < 1450) ? (
            <AxisBottom
              axisClassName="chart__axislabel axislabel__bottom"
              tickClassName="chart__axistick"
              scale={xScale.range([xMax, 0])}
              top={yMax}
              hideAxisLine={true}
              tickLength={6}
            >
              {(props) => {
                const tickLabelSize = 12
                const tickRotate = -45
                const tickColor = "#adb5bd"
                const axisCenter = (props.axisToPoint.x - props.axisFromPoint.x) / 2
                return (
                  <g className="my-custom-bottom-axis">
                    {props.ticks.map((tick, i) => {
                      const tickX = tick.to.x
                      const tickY = tick.to.y + tickLabelSize + props.tickLength
                      return (
                        <Group key={`vx-tick-${tick.value}-${i}`} className={"vx-axis-tick"}>
                          <Line from={tick.from} to={tick.to} stroke={tickColor} />
                          <text
                            transform={`translate(${tickX}, ${tickY}) rotate(${tickRotate})`}
                            fontSize={tickLabelSize}
                            textAnchor="middle"
                          >
                            {tick.formattedValue}
                          </text>
                        </Group>
                      )
                    })}
                    <text textAnchor="middle" transform={`translate(${axisCenter}, 50)`} fontSize="8" fontFamily={"Arial"}>
                      {props.label}
                    </text>
                  </g>
                )
              }}
            </AxisBottom>
          ) : (
            <AxisBottom
              axisClassName="chart__axislabel axislabel__bottom"
              tickClassName="chart__axistick"
              scale={xScale.range([xMax, 0])}
              top={yMax}
              hideAxisLine={true}
              tickLength={6}
            />
          )}
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
