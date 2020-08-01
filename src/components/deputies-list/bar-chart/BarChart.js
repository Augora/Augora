import React from "react"
import { ResponsiveBar } from "@nivo/bar"
import { getColorLuminosity, getTextColorContrast } from "utils/style/color"
import { Tooltip } from "components/tooltip/ChartTooltip"

var nbTicks = [0, 50, 100, 150, 200, 250, 300]
/**
 * Return a barchart block in a ResponsiveBar component
 * @param {*} props
 */
export default function BarChart(props) {
  return (
    <ResponsiveBar
      data={props.data}
      indexBy="id"
      margin={{ top: 50, right: 50, bottom: 20, left: 50 }}
      padding={0.1}
      colors={(groupe) => {
        return groupe.data.color
      }}
      borderRadius={5}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
      }}
      axisLeft={{
        tickSize: 0,
        tickPadding: 10,
        tickRotation: 0,
        tickValues: nbTicks,
      }}
      gridYValues={nbTicks}
      labelSkipWidth={12}
      labelSkipHeight={12}
      // labelTextColor={(groupe) =>
      //   getColorLuminosity(groupe.color) < 50
      //     ? getTextColorContrast("light")
      //     : getTextColorContrast("dark")
      // }
      labelTextColor="white"
      tooltip={(tooltipInfo) => {
        tooltipInfo.id = tooltipInfo.indexValue
        return Tooltip(tooltipInfo, props.totalNumberDeputies)
      }}
      theme={{
        labels: {
          text: {
            fontSize: 14,
            fontFamily: "Open sans, sans-serif",
            fontWeight: "bold",
          },
        },
        tooltip: {
          container: {
            background: "transparent",
            padding: 0,
            boxShadow: "none",
          },
        },
      }}
    />
  )
}
