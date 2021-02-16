import { XYChart, AnimatedAxis, Tooltip, AnimatedBarSeries } from "@visx/xychart"
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
  animationTrajectoire: any
  pyramideRight: boolean
}

export default function XYContent(props: IXYContent) {
  const { width, height, data, dataKey, color, totalDeputes, maxAge, xMax, yMax, animationTrajectoire, pyramideRight } = props

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
      <AnimatedBarSeries
        dataKey={dataKey}
        data={data}
        xAccessor={(data: Chart.AgeData) => data.total}
        yAccessor={(data: Chart.AgeData) => data.age}
        colorAccessor={() => color}
      />
      {pyramideRight && (
        <AnimatedAxis
          orientation="left"
          hideAxisLine={true}
          tickStroke={"none"}
          tickLength={6}
          animationTrajectory={animationTrajectoire}
        />
      )}
      <AnimatedAxis
        orientation="bottom"
        hideAxisLine={true}
        tickLength={6}
        tickFormat={(v: string) => v}
        numTicks={maxAge > 12 ? 12 : maxAge}
        animationTrajectory={animationTrajectoire}
      />

      <Tooltip<Chart.AgeData>
        snapTooltipToDatumY
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
