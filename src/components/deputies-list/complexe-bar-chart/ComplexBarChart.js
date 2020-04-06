import React from "react"
import { ResponsiveBar } from "@nivo/bar"
import { patternLinesDef } from "@nivo/core"
import { Tooltip } from "components/tooltip/Tooltip"
export default function ComplexBarChart(props) {
  const keys = Object.keys(props.data[0])
    .filter(key => key !== "age")
    .filter(key => !key.includes("Color"))
  return (
    <ResponsiveBar
      data={props.data}
      keys={keys}
      indexBy="age"
      defs={[
        // using helpers (cannot be used with http rendering API)
        // will use color from current element
        patternLinesDef("lines-pattern", {
          spacing: 5,
          rotation: -45,
          lineWidth: 2,
          background: "#ffffff",
          color: "inherit",
        }),
        // using plain object
        // { id: 'custom', type: 'patternLinesDef', size: 24 },
      ]}
      margin={{ top: 50, right: 50, bottom: 20, left: 50 }}
      padding={0.15}
      innerPadding={2}
      borderRadius={5}
      colors={data => {
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
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
      }}
      enableLabel={false}
      // labelSkipWidth={0}
      // labelSkipHeight={0}
      // labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
      tooltip={tooltip => Tooltip(tooltip)}
    />
  )
}
