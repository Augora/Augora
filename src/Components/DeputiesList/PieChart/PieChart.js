import React from "react"
import { ResponsivePie } from "@nivo/pie"
import { getColorLuminosity } from "Utils/utils"

const PieChart = props => {
  return (
    <ResponsivePie
      data={props.data}
      startAngle={-90}
      endAngle={90}
      margin={{ top: 50, right: 50, bottom: 0, left: 50 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={5}
      colors={groupe => {
        // console.log(groupe.color)
        console.log(getColorLuminosity(groupe.color))
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
      slicesLabelsTextColor={groupe => {
        if (getColorLuminosity(groupe.color) < 50) {
          return "rgba(255,255,255,0.8)"
        } else {
          return "rgba(0,0,0,0.8)"
        }
      }}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
    />
  )
}

export default PieChart
