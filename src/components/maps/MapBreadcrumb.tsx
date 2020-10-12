import React from "react"

function MapbreadcrumbItem(props) {
  return <span>{props.title} / </span>
}

export default function MapBreadcrumb(props) {
  return (
    <div style={{ background: "white" }}>
      {props.data.map((entry, index) => {
        return <MapbreadcrumbItem key={`breadcrumb ${index}`} title={entry} />
      })}
    </div>
  )
}
