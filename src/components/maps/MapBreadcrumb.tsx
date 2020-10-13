import React from "react"
import {
  ZoneCode,
  FranceZoneFeature,
  metroFranceFeature,
  getGEOJsonFile,
  getZoneCodeFromFeature,
  getZoneFeature,
  filterNewGEOJSonFeatureCollection,
} from "components/maps/maps-utils"

interface IMapBreadcrumb {
  feature: FranceZoneFeature
  handleReset: Function
  handleClick: Function
}

interface IMapBreadcrumbItem {
  zoneData: FranceZoneFeature
  handleClick: Function
}

// const formatGeoJSONFeatureCollection = (
//   zoneCode: ZoneCode
// ): FranceZoneProperties[] => {
//   return getGEOJsonFile(zoneCode).features.map((entry) => {
//     return entry.properties
//   })
// }

// const listRegions = formatGeoJSONFeatureCollection(ZoneCode.Regions)

// const listDepartements = formatGeoJSONFeatureCollection(ZoneCode.Departements)

const formatData = (data: FranceZoneFeature): FranceZoneFeature[] => {
  const zoneCode = getZoneCodeFromFeature(data)

  if (zoneCode === ZoneCode.Departements) {
    return [
      metroFranceFeature,
      getZoneFeature(data.properties[ZoneCode.Regions], ZoneCode.Regions),
      data,
    ]
  } else if (zoneCode === ZoneCode.Regions) {
    return [metroFranceFeature, data]
  } else return [metroFranceFeature]
}

function MapBreadcrumbItem(props: IMapBreadcrumbItem) {
  return (
    <button
      className="map__breadcrumb-item"
      onClick={() => props.handleClick()}
      title={`Revenir sur ${props.zoneData.properties.nom}`}
    >
      {props.zoneData.properties.nom}
    </button>
  )
}

export default function MapBreadcrumb(props: IMapBreadcrumb) {
  const featureArray = formatData(props.feature)

  return (
    <div className="map__breadcrumb">
      {featureArray.map((item, index) => (
        <MapBreadcrumbItem
          key={`breadcrumb-${index}`}
          zoneData={item}
          handleClick={() =>
            !getZoneCodeFromFeature(item)
              ? props.handleReset()
              : props.handleClick(item)
          }
        />
      ))}
    </div>
  )
}
