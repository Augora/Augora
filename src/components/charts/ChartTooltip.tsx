import React from "react"
import { useTooltipInPortal, defaultStyles } from "@visx/tooltip"
import Tooltip from "components/tooltip/Tooltip"

export default function ChartTooltip(props) {
  const { TooltipInPortal } = useTooltipInPortal()
  const tooltipStyles = {
    ...defaultStyles,
    minWidth: 60,
    background: "none",
    border: "none",
    boxShadow: "none",
  }

  return (
    <TooltipInPortal
      key={Math.random()} // update tooltip bounds each render
      top={props.tooltipTop}
      left={props.tooltipLeft}
      style={tooltipStyles}
    >
      <Tooltip
        title={props.tooltipData.key}
        nbDeputes={props.tooltipData.bar}
        totalDeputes={props.totalDeputes}
        color={props.tooltipData.color}
      />
    </TooltipInPortal>
  )
}
