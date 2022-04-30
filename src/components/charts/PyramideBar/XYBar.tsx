import { XYChart, AnimatedAxis, AnimatedGrid, Tooltip, AnimatedBarSeries } from "@visx/xychart"
import AugoraTooltip from "components/tooltip/Tooltip"
import useDeputiesFilters from "hooks/deputies-filters/useDeputiesFilters"

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
  const { handleSexClick } = useDeputiesFilters()
  const numTicks = 4
  const marginRight = 38

  return (
    <XYChart
      margin={{ top: 0, right: marginRight, bottom: 20, left: 0 }}
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
          left={Math.ceil(-marginRight / 4)}
          top={2}
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
        onPointerUp={() => handleSexClick(dataKey == "hommes" ? "H" : "F")}
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
