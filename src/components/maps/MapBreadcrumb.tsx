import React from "react"
import {
  ZoneCode,
  FranceZoneProperties,
  getZoneCodeFromFeatureProperties,
  getZoneFeatureProps,
} from "../maps/maps-utils"

interface IMapBreadcrumb {
  data: FranceZoneProperties
  onClickFunctions: Function[]
}

enum ZoneType {
  Continent = 0,
  Region = 1,
  Departement = 2,
  Circonscription = 3,
}

const formatData = (
  data: FranceZoneProperties
): {
  zoneName: string
  zoneType: ZoneType
}[] => {
  const zoneCode = getZoneCodeFromFeatureProperties(data)

  if (zoneCode === ZoneCode.Departements) {
    return [
      { zoneName: "France métropolitaine", zoneType: ZoneType.Continent },
      {
        zoneName: getZoneFeatureProps(data[ZoneCode.Regions], ZoneCode.Regions)
          .nom,
        zoneType: ZoneType.Region,
      },
      { zoneName: data.nom, zoneType: ZoneType.Departement },
    ]
  } else if (zoneCode === ZoneCode.Regions) {
    return [
      { zoneName: "France métropolitaine", zoneType: ZoneType.Continent },
      { zoneName: data.nom, zoneType: ZoneType.Region },
    ]
  } else return [{ zoneName: data.nom, zoneType: ZoneType.Continent }]
}

function MapbreadcrumbItem(props) {
  return (
    <button className="map__breadcrumb-item" onClick={props.onClick}>
      {props.title}
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
          title={item.zoneName}
          onClick={
            index < breadcrumbArray.length - 1
              ? props.onClickFunctions[index]
              : null
          }
        />
      ))}
    </div>
  )
}
