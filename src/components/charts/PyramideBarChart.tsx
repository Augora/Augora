import React, { useState } from "react"
import { GridRows } from "@visx/grid"
import { AxisLeft, AxisBottom } from "@visx/axis"
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale"
import { Group } from "@visx/group"
import { useTooltip } from "@visx/tooltip"
import ChartTooltip from "components/charts/ChartTooltip"
import { XYChart, BarSeries, AnimatedAxis, AnimatedGrid } from "@visx/xychart"

interface BarStackProps extends Omit<Chart.BaseProps, "data"> {
  dataAgeFemme: Chart.AgeData[]
  dataAgeHomme: Chart.AgeData[]
  groups: Group.GroupsList
  totalDeputes: number
}

export default function PyramideChart({ width, height, groups, dataAgeFemme, dataAgeHomme, totalDeputes }: BarStackProps) {
  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } = useTooltip<Chart.Tooltip>()
  const [isGroupColor, setIsGroupColor] = useState(false)

  const maxAgeFemme = Math.max(...dataAgeFemme.map((d) => d.deputyCount))
  const maxAgeHomme = Math.max(...dataAgeHomme.map((d) => d.deputyCount))

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

  return (
    <div className="pyramidebarchart chart">
      {/* <svg height={height}>
        <Group top={marginTop / 2} left={xMax}>
          Bar Horizontal Homme
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
            scale={yScaleHomme.range([yMax, 0])}
            width={xMax}
            height={yMax}
            left={-marginLeft / 2}
            numTicks={ageMoyen / 2}
            strokeWidth={2}
          />
        </Group>
      </svg> */}
      <svg height={height} width={width}>
        <Group top={marginTop / 2} left={marginLeft / 2}>
          <XYChart
            margin={{ top: 50, right: 250, bottom: 50, left: 0 }}
            width={width}
            height={height}
            yScale={{ type: "band", paddingInner: 0.5 }}
            xScale={{ type: "linear" }}
          >
            <AnimatedGrid numTicks={3} columns={false} />
            <BarSeries
              dataKey={"line"}
              data={dataAgeFemme}
              xAccessor={(dataAgeFemme) => dataAgeFemme.deputyCount}
              yAccessor={(dataAgeFemme) => dataAgeFemme.age}
            />
            <AnimatedAxis orientation="bottom" numTicks={3} />
          </XYChart>
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
