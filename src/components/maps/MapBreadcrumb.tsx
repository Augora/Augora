import React from "react"
import {
  ZoneCode,
  getZoneCodeFromFeatureProperties,
  getZoneFeatureProps,
} from "../maps/maps-utils"

const formatData = (data) => {
  const zoneCode = getZoneCodeFromFeatureProperties(data)

  if (zoneCode === ZoneCode.Departements) {
    return [
      "France métropolitaine",
      getZoneFeatureProps(data[ZoneCode.Regions], ZoneCode.Regions).nom,
      data.nom,
    ]
  } else if (zoneCode === ZoneCode.Regions) {
    return ["France métropolitaine", data.nom]
  } else return [data.nom]
}

function MapbreadcrumbItem(props) {
  return <span>{props.title} / </span>
}

export default function MapBreadcrumb(props) {
  const breadcrumbArray = formatData(props.data)

  return (
    <div style={{ background: "white" }}>
      {breadcrumbArray.map((item, index) => (
        <MapbreadcrumbItem key={`breadcrumb-${index}`} title={item} />
      ))}
    </div>
  )
}
