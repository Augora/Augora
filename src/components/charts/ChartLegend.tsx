import React from "react"
import { Legend, LegendItem, LegendLabel } from "@visx/legend"
import useDeputiesFilters from "hooks/deputies-filters/useDeputiesFilters"
import { scaleOrdinal } from "@visx/scale"
import { GlyphSquare } from "@visx/glyph"

interface IChartLegend {
  groupList: Group.GroupsList
  glyphSize?: number
  glyphPosition?: number
}

export default function ChartLegend(props: IChartLegend) {
  const { groupList, glyphSize = 120, glyphPosition = 8 } = props
  const { state, handleGroupClick } = useDeputiesFilters()

  const shapes = scaleOrdinal<string, React.FC | React.ReactNode>({
    domain: groupList.map((g) => g.Sigle),
    range: groupList.map((g) => (
      <GlyphSquare key={g.Sigle} size={glyphSize} top={glyphPosition} left={glyphPosition} fill={g.Couleur} />
    )),
  })

  return (
    <Legend scale={shapes}>
      {(labels) => (
        <div className="chart__legend">
          {labels.map((label, i) => {
            const shape = shapes(label.datum)
            const isValidElement = React.isValidElement(shape)
            return (
              <LegendItem
                className="chart__legend-item item"
                key={`legend-quantile-${i}`}
                style={undefined}
                onClick={() => {
                  handleGroupClick(label.datum as string)
                }}
              >
                <svg className={`square__${label.datum}`}>
                  {isValidElement
                    ? React.cloneElement(shape as React.ReactElement)
                    : React.createElement(shape as React.ComponentType<{ fill: string }>)}
                </svg>
                <LegendLabel className={`item__label ${state.GroupeValue[label.datum as string] ? "" : "line"}`} style={{}}>
                  {label.text}
                </LegendLabel>
              </LegendItem>
            )
          })}
        </div>
      )}
    </Legend>
  )
}
