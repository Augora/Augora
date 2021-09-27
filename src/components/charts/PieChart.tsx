import React from "react"
import { Pie } from "@visx/shape"
import { Group } from "@visx/group"
import { useTooltip } from "@visx/tooltip"
import ChartTooltip from "components/charts/ChartTooltip"
import { Annotation, Label, Connector } from "@visx/annotation"

export default function PieChart({ width, height, data }: Chart.BaseProps) {
  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } = useTooltip<Chart.Tooltip>()

  const totalDeputies = data.reduce((a, b) => a + b.value, 0)
  const ratio = width / height
  const conditionRatio = ratio > 3 ? 0.55 : ratio > 1.5 ? 0.65 : 0.45
  const rayon = ((width + height) * conditionRatio) / 2.5
  const inner = ((width + height) * conditionRatio) / 5
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
      <svg>
        <Group top={ratio < 1.5 ? height * 0.72 : ratio < 1.8 ? height * 0.9 : height * 0.95} left={width / 2}>
          <Pie
            data={data}
            pieValue={(d) => d.value}
            pieSort={null}
            outerRadius={rayon}
            innerRadius={inner}
            padAngle={0.01}
            startAngle={-Math.PI / 2}
            endAngle={Math.PI / 2}
            cornerRadius={5}
          >
            {(pie) => {
              return pie.arcs.map((arc, index, originArray) => {
                const groupeArc = arc.data
                const [centroidX, centroidY] = pie.path.centroid(arc)
                const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.2
                const justifiedMidAngle = (arc.endAngle - arc.startAngle) / 2 + arc.startAngle - Math.PI / 2
                return (
                  <g key={`arc-${groupeArc.id}-${index}`}>
                    {
                      <Annotation
                        x={rayon * Math.cos(justifiedMidAngle)}
                        y={rayon * Math.sin(justifiedMidAngle)}
                        dx={originArray.length == 1 ? 0 : centroidX < 0 ? (index < originArray.length / 2 ? -15 : -30) : 15}
                        dy={
                          originArray.length == 1 || originArray.length < 5
                            ? -10
                            : -4 * (centroidX < 0 ? index : originArray.length - 1 - index)
                        }
                      >
                        <Label
                          className="piechart__label"
                          horizontalAnchor={centroidX < 0 ? "middle" : "start"}
                          verticalAnchor={"middle"}
                          showAnchorLine={false}
                          showBackground={false}
                          title={arc.data.id}
                          // Permet de gérer les props du bloc de texte
                          titleProps={
                            centroidX < 0
                              ? {
                                  verticalAnchor: "start",
                                  textAnchor: "end",
                                  x: 25,
                                  y: 10,
                                }
                              : {
                                  x: 10,
                                  y: 10,
                                }
                          }
                          width={65}
                        />
                        <Connector stroke={arc.data.color} />
                      </Annotation>
                    }
                    <path
                      d={pie.path(arc)}
                      fill={groupeArc.color}
                      onMouseLeave={handleMouseLeave}
                      onMouseMove={(event) => handleMouseMove(event, arc.data)}
                    />

                    {hasSpaceForLabel && (
                      <text className="chart__number" x={centroidX} y={centroidY} dy=".33em" textAnchor="middle">
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
