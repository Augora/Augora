import React from "react"
import { ResponsiveBar } from "@nivo/bar"
import { patternLinesDef } from "@nivo/core"
import Tooltip from "components/tooltip/Tooltip"

var nbTicks = [0, 5, 10, 15, 20, 25]

export default function ComplexBarChart(props) {
  const keys = Object.keys(props.data[0])
    .filter((key) => key !== "age")
    .filter((key) => !key.includes("Color"))
  return (
    <ResponsiveBar
      data={props.data}
      keys={keys}
      indexBy="age"
      defs={[
        patternLinesDef("lines-pattern", {
          spacing: 5,
          rotation: -45,
          lineWidth: 2,
          background: "#ffffff",
          color: "inherit",
        }),
      ]}
      margin={{ top: 0, right: 25, bottom: 7, left: 0 }}
      padding={0.15}
      innerPadding={0}
      borderRadius={0}
      colors={(data) => {
        if (
          data.indexValue < props.ageDomain[0] ||
          data.indexValue > props.ageDomain[1]
        ) {
          return "grey"
        } else {
          return data.data[data.id + "Color"]
        }
      }}
      colorBy="id"
      axisBottom={{
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
      }}
      axisRight={{
        tickSize: 0,
        tickPadding: 8,
        tickRotation: 0,
        tickValues: nbTicks,
      }}
      gridYValues={nbTicks}
      enableLabel={false}
      // labelSkipWidth={0}
      // labelSkipHeight={0}
      // labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
      tooltip={(tooltipInfo) => {
        let currentGroup = props.groupesDetails.find(
          (g) => g.Sigle === tooltipInfo.id
        )
        return Tooltip({
          title: currentGroup.NomComplet,
          nbDeputes: tooltipInfo.value,
          totalDeputes: props.totalNumberDeputies,
          color: tooltipInfo.color,
          age: parseInt(tooltipInfo.indexValue.toString())
            ? parseInt(tooltipInfo.indexValue.toString()) // bordel syntaxique pour être sur d'avoir un type number
            : null,
        })
      }}
      theme={{
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
