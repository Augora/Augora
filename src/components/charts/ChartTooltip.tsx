import React from "react"
import { useTooltipInPortal, defaultStyles } from "@visx/tooltip"
import Tooltip from "components/tooltip/Tooltip"

interface IChartTooltip {
  tooltipTop?: number
  tooltipLeft?: number
  tooltipData: Chart.Tooltip
  totalDeputes?: number
}

export default function ChartTooltip({ tooltipTop = 0, tooltipLeft = 0, tooltipData, totalDeputes = 0 }: IChartTooltip) {
  const { TooltipInPortal } = useTooltipInPortal()
  const tooltipStyles = {
    ...defaultStyles,
    background: "none",
    border: "none",
    boxShadow: "none",
  }

  return (
    <TooltipInPortal
      key={Math.random()} // update tooltip bounds each render
      top={tooltipTop}
      left={tooltipLeft}
      style={tooltipStyles}
    >
      <Tooltip title={tooltipData.key} nbDeputes={tooltipData.bar} totalDeputes={totalDeputes} color={tooltipData.color} />
    </TooltipInPortal>
  )
}
