import React from "react"
import { Pie } from "@visx/shape"
import { Group } from "@visx/group"
import { scaleOrdinal } from "@visx/scale"
import { letterFrequency } from "@visx/mock-data"

interface PieProps {
  width: number
  height: number
  margin: { top: number; left: number; right: number; bottom: number }
  events?: boolean
  data: { id: string; label: string; value: number; color: string }[]
}

// accessors
const sigle = (d) => d.id
const nombreDeputes = (d) => d.value
const colorGroupe = (d) => d.color

const letters = letterFrequency.slice(0, 4)
const frequency = (d) => d.frequency

const defaultMargin = { top: 20, right: 20, bottom: 20, left: 20 }

export default function PieChart({ width, height, margin = defaultMargin, data }: PieProps) {
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom
  //const radius = Math.min(innerWidth, innerHeight) / 2
  const centerY = innerHeight / 2
  const centerX = innerWidth / 2
  const top = innerHeight + margin.top
  const left = centerX + margin.left
  const pieSortValues = (a, b) => b - a
  const HALF_PI = Math.PI / 2

  const getGroupeFrequencyColor = scaleOrdinal({
    domain: data.map(nombreDeputes),
    range: [data.map(colorGroupe)],
  })
  return (
    <svg width={width} height={height}>
      <Group top={top} left={left}>
        <Pie
          data={data}
          pieValue={nombreDeputes}
          pieSortValues={pieSortValues}
          outerRadius={200}
          innerRadius={70}
          padAngle={0.01}
          startAngle={-HALF_PI}
          endAngle={HALF_PI}
          cornerRadius={5}
        >
          {(pie) => {
            return pie.arcs.map((arc, index) => {
              const groupeArc = arc.data
              const [centroidX, centroidY] = pie.path.centroid(arc)
              const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1
              const arcPath = pie.path(arc)
              const arcFill = getGroupeFrequencyColor(groupeArc)
              return (
                <g key={`arc-${groupeArc}-${index}`}>
                  <path d={arcPath} fill={colorGroupe(groupeArc)} />
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
                      {nombreDeputes(groupeArc)}
                    </text>
                  )}
                </g>
              )
            })
          }}
        </Pie>
      </Group>
    </svg>
  )
}
