import React from "react"
import { Grid, WindowScroller, AutoSizer } from "react-virtualized"

import OneDeputy from "../deputy/Deputy"

const Cell = (deputiesList, columnCount) => ({
  columnIndex, // Horizontal (column) index of cell
  isScrolling, // The Grid is currently being scrolled
  isVisible, // This cell is visible within the grid (eg it is not an overscanned cell)
  key, // Unique key within array of cells
  parent, // Reference to the parent Grid (instance)
  rowIndex, // Vertical (row) index of cell
  style, // Style object to be applied to cell (to position it);
  // This must be passed through to the rendered cell element.
}) => {
  const currIndex = rowIndex * columnCount + columnIndex
  const currDeputy = deputiesList[currIndex]
  // console.log(currDeputy, currIndex, columnIndex, rowIndex)
  return (
    <div style={style}>
      {currDeputy ? (
        <OneDeputy
          Slug={currDeputy.Slug}
          Nom={currDeputy.Nom}
          URLPhotoAugora={currDeputy.URLPhotoAugora}
          GroupeParlementaire={{
            Sigle: currDeputy.GroupeParlementaire.Sigle,
            Couleur: currDeputy.GroupeParlementaire.Couleur,
          }}
        />
      ) : null}
    </div>
  )
}

export default function DeputiesGrid(props) {
  const columnCount = 6
  console.log(Math.ceil(props.deputies.length / columnCount))
  return (
    <WindowScroller>
      {({ height, isScrolling, scrollTop, width }) => (
        <Grid
          style={{ overflow: "visible" }}
          containerStyle={{ overflow: "visible" }}
          columnCount={columnCount}
          columnWidth={width / columnCount}
          height={height}
          rowCount={Math.ceil(props.deputies.length / columnCount)}
          rowHeight={310}
          width={width}
          cellRenderer={Cell(props.deputies, columnCount)}
          isScrolling={isScrolling}
          scrollTop={scrollTop}
          autoWidth
          autoHeight
        />
      )}
    </WindowScroller>
  )
}
