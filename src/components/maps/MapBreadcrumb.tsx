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
import Tooltip from "components/tooltip/Tooltip"

interface IMapBreadcrumb {
  feature: FranceZoneFeature
  handleReset: Function
  handleClick: Function
}

interface IMapBreadcrumbItem {
  zoneFeature: FranceZoneFeature
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

function MapBreadcrumbItem({ zoneFeature, handleClick }: IMapBreadcrumbItem) {
  return (
    <div className="map__breadcrumb-item">
      <button
        className="map__breadcrumb-zone"
        onClick={() => handleClick(zoneFeature)}
        title={`Revenir sur ${zoneFeature.properties.nom}`}
      >
        {zoneFeature.properties.nom}
      </button>
      <Tooltip className="map__breadcrumb-tooltip">
        {getOtherFeaturesInZone(zoneFeature).features.map((feat, index) => (
          <button
            key={`${zoneFeature.properties.nom}-tooltip-button-${index}`}
            onClick={() => handleClick(feat)}
            title={`Aller sur ${feat.properties.nom}`}
          >
            {feat.properties.nom}
          </button>
        ))}
      </Tooltip>
    </div>
  )
}

export default function MapBreadcrumb(props: IMapBreadcrumb) {
  const featureCollection = getHistory(props.feature)

  return (
    <div className="map__breadcrumb">
      {featureCollection.features.map((item, index) => (
        <MapBreadcrumbItem
          key={`breadcrumb-${index}`}
          zoneFeature={item}
          handleClick={
            !getZoneCodeFromFeature(item)
              ? props.handleReset
              : props.handleClick
          }
        />
      ))}
    </div>
  )
}
