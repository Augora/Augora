import React from "react"
import { Legend, LegendItem, LegendLabel } from "@visx/legend"
import useDeputiesFilters from "hooks/deputies-filters/useDeputiesFilters"

interface IChartLegend {
  shapeScale: any
}

export default function ChartLegend(props: IChartLegend) {
  const { shapeScale } = props
  const {
    state: { GroupeValue },
    filterGroup,
  } = useDeputiesFilters()

  const isCrossed = (sigle: string): boolean => {
    if (!Object.values(GroupeValue).every((value) => !value)) return !GroupeValue[sigle]
    else return false
  }

  return (
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
                  filterGroup(label.datum as string)
                }}
              >
                <svg className={`square__${label.datum}`}>
                  {isValidElement
                    ? React.cloneElement(shape as React.ReactElement)
                    : React.createElement(shape as React.ComponentType<{ fill: string }>)}
                </svg>
                <LegendLabel className={`item__label ${isCrossed(label.datum as string) ? "line" : ""}`} style={{}}>
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
