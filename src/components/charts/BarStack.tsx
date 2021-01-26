import React from "react"
import { BarStack } from "@visx/shape"
import { GridRows } from "@visx/grid"
import { AxisLeft, AxisBottom } from "@visx/axis"
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale"
import { Group } from "@visx/group"
import { useTooltip } from "@visx/tooltip"
import ChartTooltip from "components/charts/ChartTooltip"

interface BarStackProps extends Omit<Chart.BaseProps, "data"> {
  dataAge: Chart.AgeData[]
  groups: Group.GroupsList
  totalDeputes: number
}

export default function BarStackChart({ width, height, groups, dataAge, totalDeputes }: BarStackProps) {
  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } = useTooltip<Chart.Tooltip>()

  const maxAge = dataAge.reduce((acc, cur) => {
    const curSum = Object.values(cur.groups).reduce((a, b) => a + b.length, 0)
    return curSum > acc ? curSum : acc
  }, 0)

  const sumAge = dataAge.reduce((acc, cur) => {
    const curSum = Object.values(cur.groups).reduce((a, b) => a + b.length, 0)
    return acc + curSum * cur.age
  }, 0)

  const averageAge = Math.round((sumAge / totalDeputes) * 10) / 10

  // bounds
  const margin = 100
  const xMax = width - margin
  const yMax = height - margin

  // scales, memoize for performance
  const xScale = scaleBand<number>({
    range: [0, xMax],
    round: true,
    domain: dataAge.map((d) => d.age).reverse(),
    padding: 0.15,
  })

  const yScale = scaleLinear<number>({
    range: [yMax, 0],
    round: true,
    domain: [0, maxAge],
  })

  const getGroupColor = (sigle: string): string => {
    return groups.find((group) => group.Sigle === sigle).Couleur
  }

  const handleMouseLeave = () => {
    hideTooltip()
  }

  const handleMouseMove = (event, data) => {
    showTooltip({
      tooltipData: {
        key: data.key,
        bar: data.bar.data.groups[data.key].length,
        color: data.color,
        age: data.bar.data.age,
      },
      tooltipTop: event.clientY,
      tooltipLeft: event.clientX,
    })
  }

  return (
    <>
      <svg width={width} height={height}>
        <Group top={margin / 2} left={margin / 2}>
          <AxisLeft scale={yScale.range([yMax, 0])} numTicks={6} />
          <GridRows scale={yScale.range([yMax, 0])} width={xMax} height={yMax} stroke="#e0e0e0" numTicks={6} />
          <text x={-yMax + 50} y={-50} transform="rotate(-90)" className="description_y">
            Nombre de députés
          </text>
          <text x={xMax + 10} y={yMax} className="description_x">
            Âge
          </text>
        </Group>
        <Group top={margin / 2} left={margin / 2}>
          <BarStack<Chart.AgeData, string>
            data={dataAge}
            keys={groups.map((group) => group.Sigle)}
            value={(d, key) => d.groups[key].length}
            x={(d) => d.age}
            xScale={xScale}
            yScale={yScale}
            color={getGroupColor}
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
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={(event) => handleMouseMove(event, bar)}
                  />
                ))
              )
            }
          </BarStack>
        </Group>
        <Group top={margin / 2} left={margin / 2}>
          <AxisBottom scale={xScale.range([xMax, 0])} top={yMax} numTicks={15} />
        </Group>
        {/* Il faut enlever les 40 du padding sur ce groupe */}
        <Group className="age_moyen" left={width / 2 - 40} top={height}>
          <text>Âge moyen : {averageAge} ans</text>
        </Group>
      </svg>
      {tooltipOpen && tooltipData && (
        <ChartTooltip
          tooltipTop={tooltipTop}
          tooltipLeft={tooltipLeft}
          title={tooltipData.key}
          nbDeputes={tooltipData.bar}
          totalDeputes={totalDeputes}
          color={tooltipData.color}
          age={tooltipData.age}
        />
      )}
    </>
  )
}
