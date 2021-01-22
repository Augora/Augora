import React from "react"
import { useTooltipInPortal, defaultStyles } from "@visx/tooltip"
import Tooltip, { ITooltip } from "components/tooltip/Tooltip"

interface IChartTooltip extends Omit<ITooltip, "children"> {
  /**
   * Position Y sur l'écran
   */
  tooltipTop?: number
  /**
   * Position X sur l'écran
   */
  tooltipLeft?: number
  totalDeputes?: number
}

export default function ChartTooltip({ tooltipTop = 0, tooltipLeft = 0, ...props }: IChartTooltip) {
  const { TooltipInPortal } = useTooltipInPortal()

  const tooltipStyles = {
    ...defaultStyles,
    background: "none",
    border: "none",
    boxShadow: "none",
  }

  return (
    <TooltipInPortal top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
      <Tooltip {...props} />
    </TooltipInPortal>
  )
}
