import React from "react"
import { Pie } from "@visx/shape"
import { Group } from "@visx/group"
import { useTooltip } from "@visx/tooltip"
import ChartTooltip from "components/charts/ChartTooltip"

export default function PieChart({ width, height, data }: Chart.BaseProps) {
  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } = useTooltip<Chart.Tooltip>()

  const totalDeputies = data.reduce((a, b) => a + b.value, 0)

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

  return (
    <div className="piechart chart">
      <svg width={width} height={height}>
        <Group top={height} left={width / 2}>
          <Pie
            data={data}
            pieValue={(d) => d.value}
            pieSort={null}
            outerRadius={200}
            innerRadius={100}
            padAngle={0.01}
            startAngle={-(Math.PI / 2)}
            endAngle={Math.PI / 2}
            cornerRadius={5}
          >
            {(pie) => {
              return pie.arcs.map((arc, index) => {
                const groupeArc = arc.data
                const [centroidX, centroidY] = pie.path.centroid(arc)
                const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.2
                return (
                  <g key={`arc-${groupeArc.id}-${index}`}>
                    <path
                      d={pie.path(arc)}
                      fill={groupeArc.color}
                      onMouseLeave={handleMouseLeave}
                      onMouseMove={(event) => handleMouseMove(event, arc.data)}
                    />
                    {hasSpaceForLabel && (
                      <text
                        x={centroidX}
                        y={centroidY}
                        dy=".33em"
                        fill="#ffffff"
                        fontSize={22}
                        textAnchor="middle"
                        pointerEvents="none"
                      >
                        {groupeArc.value}
                      </text>
                    )}
                  </g>
                )
              })
            }}
          </Pie>
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
