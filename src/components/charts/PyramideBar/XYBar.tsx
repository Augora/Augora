import { XYChart, AnimatedAxis, AnimatedGrid, Tooltip, AnimatedBarSeries } from "@visx/xychart"
import AugoraTooltip from "components/tooltip/Tooltip"
import useDeputiesFilters from "hooks/deputies-filters/useDeputiesFilters"
import { useRouter } from "next/router"
import { useState } from "react"
import { getAgeDomainGraph } from "src/components/deputies-list/deputies-list-utils"

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
  const { state, handleSexClick, handleAgeSlider } = useDeputiesFilters()
  const router = useRouter()
  const [AgeClicked, setAgeClicked] = useState("" as string | number)

  const numTicks = maxAge == 2 ? 2 : maxAge == 1 ? 1 : 4
  const marginRight = 38

  return (
    <XYChart
      margin={{ top: 0, right: marginRight, bottom: 35, left: 0 }}
      width={width}
      height={height - 20}
      yScale={{ type: "band", range: [yMax - 20, 0], padding: 0.1 }}
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
          left={maxAge > 57 ? Math.ceil(-marginRight / 4) : -16}
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
        onPointerUp={() => {
          handleAgeSlider(getAgeDomainGraph(AgeClicked as string))
          state.SexValue.F === false || state.SexValue.H ? handleSexClick(dataKey == "hommes" ? "H" : "F") : ""
          router.push("/")
        }}
      />
      <Tooltip<Chart.AgeData>
        className="charttooltip__container"
        unstyled={true}
        renderTooltip={({ tooltipData }) => {
          const key = tooltipData.nearestDatum.key
          const tooltipDeputeValue = tooltipData.nearestDatum.datum.total
          setAgeClicked(tooltipData.datumByKey[key].datum.age)
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
