import { XYChart, AnimatedAxis, AnimatedGrid, Tooltip, AnimatedBarSeries } from "@visx/xychart"
import AugoraTooltip from "components/tooltip/Tooltip"

interface IXYContent {
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

export default function XYContent(props: IXYContent) {
  const { width, height, data, dataKey, color, totalDeputes, maxAge, xMax, yMax, pyramideRight } = props
  const numTicks = maxAge > 50 ? maxAge / 10 : maxAge > 15 ? maxAge / 2 : maxAge

  return (
    <XYChart
      margin={{ top: 0, right: 30, bottom: 50, left: 0 }}
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
        renderTooltip={({ tooltipData }) => (
          <AugoraTooltip
            title={dataKey}
            nbDeputes={tooltipData.datumByKey[dataKey].datum.total}
            totalDeputes={totalDeputes}
            color={color}
            age={tooltipData.datumByKey[dataKey].datum.age}
          />
        )}
      />
    </XYChart>
  )
}
