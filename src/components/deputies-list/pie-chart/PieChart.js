import React from "react"
import { ResponsivePie } from "@nivo/pie"
import Tooltip from "components/tooltip/Tooltip"

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
        return groupe.data.color
      }}
      borderWidth={0}
      borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
      radialLabelsSkipAngle={1}
      radialLabelsTextXOffset={6}
      radialLabelsTextColor="#333333"
      radialLabelsLinkDiagonalLength={5}
      radialLabelsLinkHorizontalLength={10}
      radialLabelsLinkColor={{ from: "color" }}
      sliceLabelsSkipAngle={10}
      sliceLabelsTextColor="white"
      animate={true}
      motionStiffness={90}
      motionDamping={15}
      tooltip={(tooltipInfo) => {
        const data = tooltipInfo.datum.data
        return Tooltip({
          title: props.groupesDetails.find((g) => g.Sigle === data.id).NomComplet,
          nbDeputes: data.value,
          totalDeputes: props.filteredDeputies,
          color: data.color,
        })
      }}
      theme={{
        labels: {
          text: {
            fontSize: 14,
            fontFamily: "Open sans, sans-serif",
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

export default PieChart
