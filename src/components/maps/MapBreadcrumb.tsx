import React from "react"
import {
  ZoneCode,
  ZoneType,
  FranceZoneProperties,
  getZoneCodeFromFeatureProperties,
  getZoneFeatureProps,
} from "../maps/maps-utils"

interface IMapBreadcrumb {
  data: FranceZoneProperties
  onReset: Function
  onClick: Function
}

type BreadcrumbData = {
  zoneData: FranceZoneProperties
  zoneType: ZoneType
}[]

const formatData = (data: FranceZoneProperties): BreadcrumbData => {
  const zoneCode = getZoneCodeFromFeatureProperties(data)

  if (zoneCode === ZoneCode.Departements) {
    return [
      {
        zoneData: { nom: "France métropolitaine" },
        zoneType: ZoneType.Continent,
      },
      {
        zoneData: getZoneFeatureProps(data[ZoneCode.Regions], ZoneCode.Regions),
        zoneType: ZoneType.Region,
      },
      { zoneData: data, zoneType: ZoneType.Departement },
    ]
  } else if (zoneCode === ZoneCode.Regions) {
    return [
      {
        zoneData: { nom: "France métropolitaine" },
        zoneType: ZoneType.Continent,
      },
      { zoneData: data, zoneType: ZoneType.Region },
    ]
  } else return [{ zoneData: data, zoneType: ZoneType.Continent }]
}

function MapbreadcrumbItem(props) {
  return (
    <button className="map__breadcrumb-item" onClick={props.onClick}>
      {props.featureProps.nom}
    </button>
  )
}

export default function MapBreadcrumb(props: IMapBreadcrumb) {
  const breadcrumbArray = formatData(props.data)

  return (
    <div className="map__breadcrumb">
      {breadcrumbArray.map((item, index) => (
        <MapbreadcrumbItem
          key={`breadcrumb-${index}`}
          featureProps={item.zoneData}
          onClick={() =>
            item.zoneType === ZoneType.Continent
              ? props.onReset()
              : props.onClick(item.zoneData)
          }
        />
      ))}
    </div>
  )
}
