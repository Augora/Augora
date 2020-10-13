import React from "react"
import {
  ZoneCode,
  FranceZoneProperties,
  metroFranceProperties,
  getGEOJsonFile,
  getZoneCodeFromFeatureProperties,
  getZoneFeatureProps,
  filterNewGEOJSonFeatureCollection,
} from "components/maps/maps-utils"

interface IMapBreadcrumb {
  data: FranceZoneProperties
  handleReset: Function
  handleClick: Function
}

interface IMapBreadcrumbItem {
  zoneData: FranceZoneProperties
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

const formatData = (data: FranceZoneProperties): FranceZoneProperties[] => {
  const zoneCode = getZoneCodeFromFeatureProperties(data)

  if (zoneCode === ZoneCode.Departements) {
    return [
      metroFranceProperties,
      getZoneFeatureProps(data[ZoneCode.Regions], ZoneCode.Regions),
      data,
    ]
  } else if (zoneCode === ZoneCode.Regions) {
    return [metroFranceProperties, data]
  } else return [metroFranceProperties]
}

function MapBreadcrumbItem(props: IMapBreadcrumbItem) {
  return (
    <button
      className="map__breadcrumb-item"
      onClick={() => props.handleClick()}
      title={`Revenir sur ${props.zoneData.nom}`}
    >
      {props.zoneData.nom}
    </button>
  )
}

export default function MapBreadcrumb(props: IMapBreadcrumb) {
  const featurePropsArray = formatData(props.data)

  return (
    <div className="map__breadcrumb">
      {featurePropsArray.map((item, index) => (
        <MapBreadcrumbItem
          key={`breadcrumb-${index}`}
          zoneData={item}
          handleClick={() =>
            !getZoneCodeFromFeatureProperties(item)
              ? props.handleReset()
              : props.handleClick(item)
          }
        />
      ))}
    </div>
  )
}
