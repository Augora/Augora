import React, { useState } from "react"
import { BarStackHorizontal } from "@visx/shape"
import { GridRows } from "@visx/grid"
import { AxisLeft, AxisBottom } from "@visx/axis"
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale"
import { Group } from "@visx/group"
import { SeriesPoint } from "@visx/shape/lib/types/barStack"
import { useTooltip } from "@visx/tooltip"
import ChartTooltip from "components/charts/ChartTooltip"

interface BarStackProps extends Omit<Chart.BaseProps, "data"> {
  dataAgeFemme: Chart.AgeData[]
  dataAgeHomme: Chart.AgeData[]
  groups: Group.GroupsList
  totalDeputes: number
}

export default function PyramideChart({ width, height, groups, dataAgeFemme, dataAgeHomme, totalDeputes }: BarStackProps) {
  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } = useTooltip<Chart.Tooltip>()
  const [isGroupColor, setIsGroupColor] = useState(false)

  const maxAgeFemme = dataAgeFemme.reduce((acc, cur) => {
    const curSum = Object.values(cur.groups).reduce((a, b) => a + b.length, 0)
    return curSum > acc ? curSum : acc
  }, 0)
  const maxAgeHomme = dataAgeHomme.reduce((acc, cur) => {
    const curSum = Object.values(cur.groups).reduce((a, b) => a + b.length, 0)
    return curSum > acc ? curSum : acc
  }, 0)

  const maxAge = Math.max(maxAgeFemme, maxAgeHomme)
  const ageMoyen = dataAgeFemme[dataAgeFemme.length - 1].age - dataAgeFemme[0].age

  // bounds
  const marginTop = 50
  const marginLeft = 30
  const xMax = width / 2 - marginLeft
  const yMax = height - marginTop

  // scales, memoize for performance
  const xScaleFemme = scaleLinear<number>({
    range: [0, xMax],
    round: true,
    domain: [maxAge, 0],
  })

  const yScaleFemme = scaleBand<number>({
    range: [0, yMax],
    round: true,
    domain: dataAgeFemme.map((d) => d.age),
    padding: 0.1,
  })

  const xScaleReverse = scaleLinear<number>({
    range: [0, xMax],
    domain: [maxAge, 0],
  })

  const xScaleHomme = scaleLinear<number>({
    range: [0, xMax],
    domain: [-maxAge, 0],
  })

  const yScaleHomme = scaleBand<number>({
    range: [yMax, 0],
    round: true,
    domain: dataAgeHomme.map((d) => d.age),
    padding: 0.1,
  })

  const getGroupColor = (sigle: string, defaultColor: string): string => {
    return isGroupColor ? groups.find((group) => group.Sigle === sigle).Couleur : defaultColor
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
    <div className="pyramidebarchart chart">
      <svg height={height}>
        <Group top={marginTop / 2} left={xMax}>
          <BarStackHorizontal<Chart.AgeData, string>
            data={dataAgeHomme}
            keys={groups.map((group) => group.Sigle)}
            value={(d, key) => d.groups[key].length}
            y={(d) => d.age}
            xScale={xScaleHomme}
            yScale={yScaleHomme}
            color={(key) => getGroupColor(key, "#14ccae")}
          >
            {(barStacks) =>
              barStacks.map((barStack) =>
                barStack.bars.map((bar) => (
                  <rect
                    key={`bar-stack-${barStack.index}-${bar.index}`}
                    x={bar.x - xMax}
                    y={bar.y}
                    height={bar.height}
                    width={bar.width}
                    fill={bar.color}
                    transform="scale(-1,1)"
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={(event) => handleMouseMove(event, bar)}
                  />
                ))
              )
            }
          </BarStackHorizontal>
        </Group>
        <Group top={marginTop / 2} left={marginLeft / 2}>
          <AxisBottom
            axisClassName="chart__axislabel axislabel__bottom"
            tickClassName="chart__axistick"
            scale={xScaleReverse.range([0, xMax])}
            top={yMax}
            left={-marginLeft / 2}
            hideAxisLine={true}
            tickLength={6}
          />
          <GridRows
            className="chart__rows"
            scale={yScaleFemme.range([yMax, 0])}
            width={xMax}
            height={yMax}
            left={-marginLeft / 2}
            numTicks={ageMoyen / 2}
            strokeWidth={2}
          />
        </Group>
      </svg>
      <svg height={height}>
        <Group top={marginTop / 2} left={marginLeft / 2}>
          <GridRows
            className="chart__rows"
            scale={yScaleFemme.range([yMax, 0])}
            width={xMax}
            height={yMax}
            numTicks={ageMoyen / 2}
            strokeWidth={2}
          />
          <BarStackHorizontal<Chart.AgeData, string>
            data={dataAgeFemme}
            keys={groups.map((group) => group.Sigle)}
            value={(d, key) => d.groups[key].length}
            y={(d) => d.age}
            xScale={xScaleFemme}
            yScale={yScaleFemme}
            color={(key) => getGroupColor(key, "#00bbcc")}
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
          </BarStackHorizontal>
        </Group>
        <Group top={marginTop / 2} left={marginLeft / 2}>
          <AxisLeft
            axisClassName="chart__axislabel"
            scale={yScaleFemme.range([yMax, 0])}
            hideAxisLine={true}
            hideTicks={true}
            numTicks={ageMoyen / 2}
          />
        </Group>
        <Group top={marginTop / 2} left={marginLeft / 2}>
          <AxisBottom
            axisClassName="chart__axislabel axislabel__bottom"
            tickClassName="chart__axistick"
            scale={xScaleFemme.range([xMax, 0])}
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
          totalDeputes={totalDeputes}
          color={tooltipData.color}
          age={tooltipData.age}
        />
      )}
    </div>
  )
}
