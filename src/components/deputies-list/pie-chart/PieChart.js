import React from "react"
import { ResponsivePie } from "@nivo/pie"
import { getColorLuminosity, getTextColorContrast } from "utils/style/color"
import { Tooltip } from "components/tooltip/BarPieChartTooltip"

const PieChart = (props) => {
  return (
    <ResponsivePie
      data={props.data}
      startAngle={-90}
      endAngle={90}
      margin={{ top: 50, right: 50, bottom: 0, left: 50 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={5}
      colors={(groupe) => {
        return groupe.color
      }}
      borderWidth={0}
      borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
      radialLabelsSkipAngle={1}
      radialLabelsTextXOffset={6}
      radialLabelsTextColor="#333333"
      radialLabelsLinkOffset={0}
      radialLabelsLinkDiagonalLength={5}
      radialLabelsLinkHorizontalLength={10}
      radialLabelsLinkStrokeWidth={1}
      radialLabelsLinkColor={{ from: "color" }}
      slicesLabelsSkipAngle={10}
      slicesLabelsTextColor={(groupe) =>
        getColorLuminosity(groupe.color) < 50
          ? getTextColorContrast("light")
          : getTextColorContrast("dark")
      }
      animate={true}
      motionStiffness={90}
      motionDamping={15}
      tooltip={(tooltipInfo) => {
        return Tooltip(tooltipInfo, props.totalNumberDeputies)
      }}
      theme={{
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

export default PieChart
