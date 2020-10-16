import React from "react"
import {
  ZoneCode,
  FranceZoneFeature,
  metroFranceFeature,
  getFeatureZoneCode,
  getZoneFeature,
  getSisterFeatures,
} from "components/maps/maps-utils"
import Tooltip from "components/tooltip/Tooltip"
import CustomControl from "components/maps/CustomControl"
import sortBy from "lodash/sortBy"

interface IMapBreadcrumb {
  feature: FranceZoneFeature
  handleClick: Function
}

interface IMapBreadcrumbItem {
  zoneFeature: FranceZoneFeature
  handleClick: Function
}

/**
 * Renvoie l'historique des zones parcourues sous forme de feature array
 * @param {FranceZoneFeature} feature L'object feature à analyser
 */
const getHistory = (feature: FranceZoneFeature): FranceZoneFeature[] => {
  const zoneCode = getFeatureZoneCode(feature)

  switch (zoneCode) {
    case ZoneCode.Continent:
      return [feature]
    case ZoneCode.Regions:
      return [metroFranceFeature, feature]
    case ZoneCode.Departements:
      return [
        metroFranceFeature,
        getZoneFeature(feature.properties[ZoneCode.Regions], ZoneCode.Regions),
        feature,
      ]
    default:
      return []
  }
}

function MapBreadcrumbItem({ zoneFeature, handleClick }: IMapBreadcrumbItem) {
  const sisterZones = sortBy(
    getSisterFeatures(zoneFeature),
    (o) => o.properties.nom
  )

  return (
    <div className="map__breadcrumb-item">
      <button
        className="map__breadcrumb-zone"
        onClick={() => handleClick(zoneFeature)}
        title={`Revenir sur ${zoneFeature.properties.nom}`}
      >
        {zoneFeature.properties.nom}
        {zoneFeature.properties.code_dpt
          ? ` (${zoneFeature.properties.code_dpt})`
          : null}
      </button>
      <Tooltip className="map__breadcrumb-tooltip">
        {sisterZones.map((feat, index) => (
          <button
            key={`${zoneFeature.properties.nom}-tooltip-button-${index}`}
            onClick={() => handleClick(feat)}
            title={`Aller sur ${feat.properties.nom}`}
          >
            {feat.properties.nom}
            {feat.properties.code_dpt ? ` (${feat.properties.code_dpt})` : null}
          </button>
        ))}
      </Tooltip>
    </div>
  )
}

export default function MapBreadcrumb(props: IMapBreadcrumb) {
  const history = getHistory(props.feature)

  return (
    <CustomControl>
      <div className="map__breadcrumb">
        {history.map((item, index) => (
          <MapBreadcrumbItem
            key={`breadcrumb-${index}`}
            zoneFeature={item}
            handleClick={props.handleClick}
          />
        ))}
      </div>
    </CustomControl>
  )
}
