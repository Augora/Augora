import React from "react"
import { Group } from "@visx/group"
import { scaleOrdinal } from "@visx/scale"
import { GlyphSquare } from "@visx/glyph"
import { Legend, LegendItem, LegendLabel } from "@visx/legend"
import XYBarStack from "src/components/charts/XYBarStack"
import useDeputiesFilters from "hooks/deputies-filters/useDeputiesFilters"
import { getGender } from "src/utils/augora-objects/deputy/gender"

interface BarStackProps extends Omit<Chart.BaseProps, "data"> {
  dataAgeFemme: Chart.AgeData[]
  dataAgeHomme: Chart.AgeData[]
  groups: Group.GroupsList
  totalDeputes: number
  maxAge: number
}

export default function PyramideBarStack(props: BarStackProps) {
  const { width, height, dataAgeFemme, dataAgeHomme, groups, totalDeputes, maxAge } = props
  const { state, handleGroupClick } = useDeputiesFilters()

  // bounds
  const marginTop = 20
  const marginLeft = 30

  const glyphSize = 120
  const glyphPosition = 8
  const shapeScale = scaleOrdinal<string, React.FC | React.ReactNode>({
    domain: groups.map((g) => g.Sigle),
    range: groups.map((g) => (
      <GlyphSquare key={g.Sigle} size={glyphSize} top={glyphPosition} left={glyphPosition} fill={g.Couleur} />
    )),
  })

  return (
    <div className="pyramidechart chart">
      <svg width={width / 2} height={height}>
        <Group top={marginTop}>
          <XYBarStack
            width={width / 2}
            height={height}
            dataAge={dataAgeHomme}
            groups={groups}
            totalDeputes={totalDeputes}
            maxAge={maxAge}
            axisLeft={false}
            renderVertically={false}
            marginTop={marginTop}
            marginLeft={marginLeft}
          />
        </Group>
      </svg>
      <svg width={width / 2} height={height}>
        <Group top={marginTop} left={marginLeft}>
          <XYBarStack
            width={width / 2}
            height={height}
            dataAge={dataAgeFemme}
            groups={groups}
            totalDeputes={totalDeputes}
            maxAge={maxAge}
            axisLeft={true}
            renderVertically={false}
            marginTop={marginTop}
            marginLeft={marginLeft}
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
                    handleGroupClick(label.datum)
                  }}
                >
                  <svg className={`square__${label.datum}`}>
                    {isValidElement
                      ? React.cloneElement(shape as React.ReactElement)
                      : React.createElement(shape as React.ComponentType<{ fill: string }>)}
                  </svg>
                  <LegendLabel className={`item__label ${state.GroupeValue[label.datum] ? "" : "line"}`} style={{}}>
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
