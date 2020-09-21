import React from "react"
import { ResponsiveBar } from "@nivo/bar"
import Tooltip from "components/tooltip/Tooltip"

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
      margin={{ top: 50, right: 50, bottom: 25, left: 50 }}
      padding={0.1}
      colors={(groupe) => {
        return groupe.data.color
      }}
      borderRadius={3}
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
      labelSkipHeight={20}
      labelTextColor="white"
      tooltip={(tooltipInfo) => {
        return Tooltip({
          title: props.groupesDetails.find(
            (g) => g.Sigle === tooltipInfo.indexValue //iterate through groupedetails's acronym list until it find the correct one
          ).NomComplet, //retrieve the full name of that acronym
          nbDeputes: tooltipInfo.value,
          totalDeputes: props.filteredDeputies,
          color: tooltipInfo.color,
        })
      }}
      theme={{
        labels: {
          text: {
            fontSize: 18,
            fontFamily: "Open sans, sans-serif",
            fontWeight: "bold",
          },
        },
        axis: {
          ticks: {
            text: {
              fontSize: 14,
              fontFamily: "Open sans, sans-serif",
            },
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
