import React from "react"
import { BarStack } from "@visx/shape"
import { GridRows } from "@visx/grid"
import { AxisLeft, AxisBottom } from "@visx/axis"
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale"
import { Group } from "@visx/group"
import { SeriesPoint } from "@visx/shape/lib/types/barStack"
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

  // bounds
  const marginTop = 50
  const marginLeft = 20
  const xMax = width - marginLeft
  const yMax = height - marginTop

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

  const handleMouseMove = (
    event: React.MouseEvent<SVGRectElement, MouseEvent>,
    data: {
      bar: SeriesPoint<Chart.AgeData>
      key: string
      color: string
    }
  ) => {
    showTooltip({
      tooltipData: {
        key: groups.find((group) => group.Sigle === data.key).NomComplet,
        bar: data.bar.data.groups[data.key].length,
        color: data.color,
        age: data.bar.data.age,
      },
      tooltipTop: event.clientY,
      tooltipLeft: event.clientX,
    })
  }

  return (
    <div className="pyramidechart chart">
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
          <text x={xMax + 10} y={yMax} className="chart__description">
            Âge
          </text>
        </Group>
        <Group top={marginTop / 2} left={marginLeft / 2}>
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
        <Group top={marginTop / 2} left={marginLeft / 2}>
          {/* 250 sur smartphone ==> 4*/}
          {/* 812 sur PC ==> 10*/}
          {/*  */}
          <AxisBottom
            axisClassName="chart__axislabel axislabel__bottom"
            tickClassName="chart__axistick"
            scale={xScale.range([xMax, 0])}
            top={yMax}
            numTicks={width > 350 ? 10 : width > 250 ? 5 : 3}
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
          totalDeputes={totalDeputes}
          color={tooltipData.color}
          age={tooltipData.age}
        />
      )}
    </div>
  )
}
