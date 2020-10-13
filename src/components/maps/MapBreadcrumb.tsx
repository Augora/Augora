import React from "react"
import {
  ZoneCode,
  FranceZoneFeature,
  FranceZoneFeatureCollection,
  metroFranceFeature,
  getZoneCodeFromFeature,
  getZoneFeature,
  getOtherFeaturesInZone,
} from "components/maps/maps-utils"

interface IMapBreadcrumb {
  feature: FranceZoneFeature
  handleReset: Function
  handleClick: Function
}

interface IMapBreadcrumbItem {
  name: string
  handleClick: Function
}

/**
 * Renvoie l'historique des zones parcourues sous forme de feature collection
 * @param feature L'object feature à analyser
 */
const getHistory = (
  feature: FranceZoneFeature
): FranceZoneFeatureCollection => {
  const zoneCode = getZoneCodeFromFeature(feature)
  const featureArray =
    zoneCode === ZoneCode.Departements
      ? [
          metroFranceFeature,
          getZoneFeature(
            feature.properties[ZoneCode.Regions],
            ZoneCode.Regions
          ),
          feature,
        ]
      : zoneCode === ZoneCode.Regions
      ? [metroFranceFeature, feature]
      : [metroFranceFeature]

  return {
    type: "FeatureCollection",
    features: featureArray,
  }
}

function MapBreadcrumbItem(props: IMapBreadcrumbItem) {
  return (
    <button
      className="map__breadcrumb-item"
      onClick={() => props.handleClick()}
      title={`Revenir sur ${props.name}`}
    >
      {props.name}
    </button>
  )
}

export default function MapBreadcrumb(props: IMapBreadcrumb) {
  const featureCollection = getHistory(props.feature)

  return (
    <div className="map__breadcrumb">
      {featureCollection.features.map((item, index) => (
        <MapBreadcrumbItem
          key={`breadcrumb-${index}`}
          name={item.properties.nom}
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
