import React from "react"
import {
  ZoneCode,
  FranceZoneProperties,
  getZoneCodeFromFeatureProperties,
  getZoneFeatureProps,
} from "../maps/maps-utils"

interface IMapBreadcrumb {
  data: FranceZoneProperties
  handleReset: Function
  handleClick: Function
}

interface IMapBreadcrumbItem {
  zoneData: FranceZoneProperties
  handleClick: Function
}

type BreadcrumbData = {
  zoneData: FranceZoneProperties
  zoneCode: ZoneCode
}[]

const formatData = (data: FranceZoneProperties): BreadcrumbData => {
  const zoneCode = getZoneCodeFromFeatureProperties(data)

  if (zoneCode === ZoneCode.Departements) {
    return [
      {
        zoneData: { nom: "France métropolitaine" },
        zoneCode: ZoneCode.Regions,
      },
      {
        zoneData: getZoneFeatureProps(data[ZoneCode.Regions], ZoneCode.Regions),
        zoneCode: ZoneCode.Departements,
      },
      { zoneData: data, zoneCode: ZoneCode.Circonscriptions },
    ]
  } else if (zoneCode === ZoneCode.Regions) {
    return [
      {
        zoneData: { nom: "France métropolitaine" },
        zoneCode: ZoneCode.Regions,
      },
      { zoneData: data, zoneCode: ZoneCode.Departements },
    ]
  } else return [{ zoneData: data, zoneCode: ZoneCode.Regions }]
}

function MapBreadcrumbItem(props: IMapBreadcrumbItem) {
  return (
    <button
      className="map__breadcrumb-item"
      onClick={() => props.handleClick()}
    >
      {props.zoneData.nom}
    </button>
  )
}

export default function MapBreadcrumb(props: IMapBreadcrumb) {
  const breadcrumbArray = formatData(props.data)

  return (
    <div className="map__breadcrumb">
      {breadcrumbArray.map((item, index) => (
        <MapBreadcrumbItem
          key={`breadcrumb-${index}`}
          zoneData={item.zoneData}
          handleClick={() =>
            item.zoneCode === ZoneCode.Regions
              ? props.handleReset()
              : props.handleClick(item.zoneData)
          }
        />
      ))}
    </div>
  )
}
