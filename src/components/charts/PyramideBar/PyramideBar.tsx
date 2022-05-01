import React from "react"
import { Group } from "@visx/group"
import XYBar from "src/components/charts/PyramideBar/XYBar"
import { scaleOrdinal } from "@visx/scale"
import { GlyphSquare } from "@visx/glyph"
import { Legend, LegendItem, LegendLabel } from "@visx/legend"
import useDeputiesFilters from "hooks/deputies-filters/useDeputiesFilters"

interface BarStackProps extends Omit<Chart.BaseProps, "data"> {
  dataAgeFemme: Chart.AgeData[]
  dataAgeHomme: Chart.AgeData[]
  totalDeputes: number
  maxAge: number
}

export default function PyramideBar(props: BarStackProps) {
  const { width, height, dataAgeHomme, dataAgeFemme, totalDeputes, maxAge } = props
  const { state, handleSexClick } = useDeputiesFilters()

  // bounds
  const marginTop = 20
  const marginLeft = 30
  const xMax = width / 2 - marginLeft
  const yMax = height - marginTop * 2

  const glyphSize = 120
  const glyphPosition = 8
  const shapeScale = scaleOrdinal<string, React.FC | React.ReactNode>({
    //domain: ["Présences", "Participations", "Questions orales", "Mediane des députés", "Vacances"],
    domain: ["hommes", "femmes"],
    range: [
      <GlyphSquare key="hommes" size={glyphSize} top={glyphPosition} left={glyphPosition} />,
      <GlyphSquare key="femmes" size={glyphSize} top={glyphPosition} left={glyphPosition} />,
    ],
  })

  return (
    <div className="pyramidechart chart">
      <svg width={width / 2} height={height}>
        <Group top={marginTop}>
          <XYBar
            width={width / 2}
            height={height}
            data={dataAgeHomme}
            dataKey={"hommes"}
            color={"#14ccae"}
            totalDeputes={totalDeputes}
            maxAge={maxAge}
            xMax={xMax}
            yMax={yMax}
            pyramideRight={false}
          />
        </Group>
      </svg>
      <svg width={width / 2} height={height}>
        <Group top={marginTop} left={marginLeft}>
          <XYBar
            width={width / 2}
            height={height}
            data={dataAgeFemme}
            dataKey={"femmes"}
            color={"#00bbcc"}
            totalDeputes={totalDeputes}
            maxAge={maxAge}
            xMax={xMax}
            yMax={yMax}
            pyramideRight={true}
          />
        </Group>
      </svg>
      <Legend scale={shapeScale}>
        {(labels) => (
          <div className="chart__legend">
            {labels.map((label, i) => {
              const shape = shapeScale(label.datum)
              const isValidElement = React.isValidElement(shape)
              return (
                <LegendItem
                  className="chart__legend-item item"
                  key={`legend-quantile-${i}`}
                  style={undefined}
                  onClick={() => {
                    handleSexClick(label.datum == "hommes" ? "F" : "H")
                  }}
                >
                  <svg className={`square__${label.datum}`}>
                    {isValidElement
                      ? React.cloneElement(shape as React.ReactElement)
                      : React.createElement(shape as React.ComponentType<{ fill: string }>, {
                          fill: "blue",
                        })}
                  </svg>
                  <LegendLabel
                    className={`item__label ${
                      label.datum == "hommes" ? (state.SexValue.H ? "" : "line") : state.SexValue.F ? "" : "line"
                    }`}
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
