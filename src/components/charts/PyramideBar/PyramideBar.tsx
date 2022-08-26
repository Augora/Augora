import React from "react"
import { Group } from "@visx/group"
import XYBar from "src/components/charts/PyramideBar/XYBar"
import { scaleOrdinal } from "@visx/scale"
import { GlyphSquare } from "@visx/glyph"
import { Legend, LegendItem, LegendLabel } from "@visx/legend"
import useDeputiesFilters from "hooks/deputies-filters/useDeputiesFilters"
import { getAgeData, rangifyAgeData } from "../chart-utils"

interface BarStackProps extends Omit<Chart.BaseProps, "data"> {
  deputesData: { groupList: Group.GroupsList; deputes: Deputy.DeputiesList; ageDomain: Filter.AgeDomain }
}

export default function PyramideBar(props: BarStackProps) {
  const {
    width,
    height,
    deputesData: { groupList, deputes, ageDomain },
  } = props
  const {
    state: { SexValue },
    handleSexClick,
  } = useDeputiesFilters()

  // bounds
  const marginTop = 20
  const marginLeft = 30
  const delta = 10

  const xMax = width / 2 - marginLeft
  const yMax = height - marginTop - delta - 15

  const glyphSize = 120
  const glyphPosition = 8
  const domain = ["hommes", "femmes"]
  const shapeScale = scaleOrdinal<string, React.FC | React.ReactNode>({
    //domain: ["Présences", "Participations", "Questions orales", "Mediane des députés", "Vacances"],
    domain: domain,
    range: domain.map((d) => <GlyphSquare key={d} size={glyphSize} top={glyphPosition} left={glyphPosition} />),
  })
  const isRange = deputes.length < 30
  const dataAgeFemme = isRange
    ? getAgeData(groupList, deputes, ageDomain, "F")
    : rangifyAgeData(getAgeData(groupList, deputes, ageDomain, "F"), 6)

  const dataAgeHomme = isRange
    ? getAgeData(groupList, deputes, ageDomain, "H")
    : rangifyAgeData(getAgeData(groupList, deputes, ageDomain, "H"), 6)

  const maxAgeFemme = Math.max(...dataAgeFemme.map((d) => d.total))
  const maxAgeHomme = Math.max(...dataAgeHomme.map((d) => d.total))
  const maxAge = Math.max(maxAgeFemme, maxAgeHomme)

  return (
    <div className="pyramidechart chart">
      <svg width={width / 2} height={height}>
        <Group top={marginTop + 20}>
          <XYBar
            width={width / 2}
            height={height - delta}
            data={dataAgeHomme}
            dataKey={"hommes"}
            color={"#14ccae"}
            totalDeputes={deputes.length}
            maxAge={maxAge}
            xMax={xMax}
            yMax={yMax}
            pyramideRight={false}
          />
        </Group>
      </svg>
      <svg width={width / 2} height={height}>
        <Group top={marginTop + 20} left={marginLeft}>
          <XYBar
            width={width / 2}
            height={height - delta}
            data={dataAgeFemme}
            dataKey={"femmes"}
            color={"#00bbcc"}
            totalDeputes={deputes.length}
            maxAge={maxAge}
            xMax={xMax}
            yMax={yMax}
            pyramideRight={true}
          />
        </Group>
      </svg>
      <Legend scale={shapeScale}>
        {(labels) => (
          <div className={`chart__sexe`}>
            {labels.map((label, i) => {
              const shape = shapeScale(label.datum)
              const isValidElement = React.isValidElement(shape)
              return (
                <LegendItem
                  className="chart__sexe-item item"
                  key={`legend-quantile-${i}`}
                  style={undefined}
                  onClick={() => {
                    handleSexClick(label.datum == "hommes" ? "F" : "H")
                  }}
                >
                  <svg className={`square__${label.datum}`}>
                    {isValidElement
                      ? React.cloneElement(shape as React.ReactElement)
                      : React.createElement(shape as React.ComponentType<{ fill: string }>)}
                  </svg>
                  <LegendLabel
                    className={`item__label ${label.datum == "hommes" ? (SexValue.H ? "" : "line") : SexValue.F ? "" : "line"}`}
                    style={{}}
                  >
                    {label.text}
                  </LegendLabel>
                </LegendItem>
              )
            })}
          </div>
        )}
      </Legend>
    </div>
  )
}
