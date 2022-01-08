import React from "react"
import { Legend, LegendItem, LegendLabel } from "@visx/legend"

const handleLegend = (state, legend: string) => {
  let newState = { ...state }
  const statesAsArray = Object.entries(newState)
  const allActive = statesAsArray.every(([key, value]) => value)
  const isClickedAloneActive =
    newState[legend] &&
    statesAsArray
      .filter(([key]) => {
        return key === legend
      })
      .every(([value]) => {
        return value
      })
  Object.keys(state).forEach((key) => {
    if (allActive) {
      newState[key] = key !== legend ? false : true
    } else if (isClickedAloneActive) {
      newState[key] = true
    } else {
      newState[key] = key !== legend ? false : true
    }
  })
  return newState
}

interface IPresenceFooter {
  color: string
  DisplayedGraph: {
    Présences: boolean
    Participations: boolean
    "Questions orales": boolean
    "Mediane des d\u00E9put\u00E9s": boolean
    Vacances: boolean
  }
  setDisplayedGraph: React.Dispatch<
    React.SetStateAction<{
      Présences: boolean
      Participations: boolean
      "Questions orales": boolean
      "Mediane des députés": boolean
      Vacances: boolean
    }>
  >
  shapeScale: any
}

export default function PresenceFooter(props: IPresenceFooter) {
  const { color, DisplayedGraph, setDisplayedGraph, shapeScale } = props
  return (
    <>
      <div className="presence__line" />
      <div className="presence__filtre">
        <div>Filtrer</div>
      </div>
      <Legend scale={shapeScale}>
        {(labels) => (
          <div className="presence__legend">
            {labels.map((label, i) => {
              const shape = shapeScale(label.datum)
              const isValidElement = React.isValidElement(shape)
              return (
                <LegendItem
                  className="presence__legend-item item"
                  key={`legend-quantile-${i}`}
                  style={undefined}
                  onClick={() => {
                    label.text !== "Mediane des députés" && label.text !== "Vacances"
                      ? setDisplayedGraph(handleLegend(DisplayedGraph, label.text))
                      : null
                  }}
                >
                  <svg>
                    {isValidElement
                      ? React.cloneElement(shape as React.ReactElement)
                      : React.createElement(shape as React.ComponentType<{ fill: string }>, {
                          fill: color,
                        })}
                  </svg>
                  <LegendLabel className={`item__label${!DisplayedGraph[label.text] ? " line" : ""}`} style={{}}>
                    {label.text}
                  </LegendLabel>
                </LegendItem>
              )
            })}
          </div>
        )}
      </Legend>
    </>
  )
}
