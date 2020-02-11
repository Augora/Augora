import React from "react"
import { ResponsiveBar } from "@nivo/bar"
import { getColorLuminosity, getTextColorContrast } from "Utils/utils"

export default function BarChart(props) {
  return (
    <ResponsiveBar
      data={props.data}
      indexBy="id"
      margin={{ top: 50, right: 50, bottom: 20, left: 50 }}
      padding={0.1}
      colors={groupe => {
        return groupe.data.color
      }}
      borderRadius={5}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={groupe =>
        getColorLuminosity(groupe.color) < 50
          ? getTextColorContrast("light")
          : getTextColorContrast("dark")
      }
    />
  )
}
