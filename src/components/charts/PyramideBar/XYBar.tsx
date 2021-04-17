import { XYChart, AnimatedAxis, AnimatedGrid, Tooltip, AnimatedBarSeries } from "@visx/xychart"
import AugoraTooltip from "components/tooltip/Tooltip"

interface IXYBar {
  width: number
  height: number
  data: Chart.AgeData[]
  /** Le nom de la donnée */
  dataKey: string
  color: string
  totalDeputes: number
  maxAge: number
  xMax: number
  yMax: number
  pyramideRight: boolean
}

export default function XYBar(props: IXYBar) {
  const { width, height, data, dataKey, color, totalDeputes, maxAge, xMax, yMax, pyramideRight } = props
  const numTicks = 5
  const marginRight = 30
  const isRange = /^\d\d$/.test(data[0].age as string)

  return (
    <XYChart
      margin={{ top: 0, right: marginRight, bottom: 25, left: 0 }}
      width={width}
      height={height}
      yScale={{ type: "band", range: [yMax, 0], padding: 0.1 }}
      xScale={
        pyramideRight
          ? { type: "linear", range: [0, xMax], domain: [0, maxAge] }
          : { type: "linear", range: [0, xMax], domain: [maxAge, 0] }
      }
    >
      <AnimatedGrid className="chart__rows" numTicks={numTicks} rows={false} />
      {pyramideRight && (
        <AnimatedAxis
          axisClassName="chart__axislabel axislabel__verticalpyramide"
          orientation="left"
          hideAxisLine={true}
          hideTicks={true}
          left={isRange ? -marginRight / 2 : -marginRight / 4}
        />
      )}
      <AnimatedAxis
        axisClassName="chart__axislabel axislabel__bottom"
        orientation="bottom"
        hideAxisLine={true}
        hideTicks={true}
        tickFormat={(v: string) => v}
        numTicks={numTicks}
      />
      <AnimatedBarSeries
        dataKey={dataKey}
        data={data}
        xAccessor={(data: Chart.AgeData) => data.total}
        yAccessor={(data: Chart.AgeData) => data.age}
        colorAccessor={() => color}
      />
      <Tooltip<Chart.AgeData>
        className="charttooltip__container"
        unstyled={true}
        renderTooltip={({ tooltipData }) => {
          const key = tooltipData.nearestDatum.key
          const tooltipDeputeValue = tooltipData.nearestDatum.datum.total
          return (
            <>
              {tooltipDeputeValue == 0 ? (
                ""
              ) : (
                <AugoraTooltip
                  title={tooltipData.datumByKey[key].key}
                  nbDeputes={tooltipDeputeValue}
                  totalDeputes={totalDeputes}
                  color={color}
                  age={tooltipData.datumByKey[key].datum.age}
                />
              )}
            </>
          )
        }}
      />
    </XYChart>
  )
}
