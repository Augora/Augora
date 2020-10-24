import React from "react"
import {
  Code,
  Cont,
  metroFranceFeature,
  OMFeature,
  getContinent,
  getZoneCode,
  getFeature,
  getSisterFeatures,
} from "components/maps/maps-utils"
import Tooltip from "components/tooltip/Tooltip"
import CustomControl from "components/maps/CustomControl"
import sortBy from "lodash/sortBy"

interface IMapBreadcrumb {
  feature: AugoraMap.Feature
  handleClick: (args?: any) => any
}

/**
 * Renvoie l'historique des zones parcourues sous forme de feature array
 * @param {AugoraMap.Feature} feature L'object feature à analyser
 */
const getHistory = (feature: AugoraMap.Feature): AugoraMap.Feature[] => {
  const zoneCode = getZoneCode(feature)
  const continentId = getContinent(feature)

  switch (zoneCode) {
    case Code.Cont:
      return [feature]
    case Code.Reg:
      return [metroFranceFeature, feature]
    case Code.Dpt:
      return continentId === Cont.France
        ? [
            metroFranceFeature,
            getFeature(feature.properties[Code.Reg], Code.Reg),
            feature,
          ]
        : [OMFeature, feature]
    default:
      return []
  }
}

function MapBreadcrumbItem({ feature, handleClick }: IMapBreadcrumb) {
  const sisterZones = sortBy(
    getSisterFeatures(feature),
    (o) => o.properties.nom
  )

  return (
    <div className="map__breadcrumb-item">
      <button
        className="map__breadcrumb-zone"
        onClick={() => handleClick(feature)}
        title={`Revenir sur ${feature.properties.nom}`}
      >
        {feature.properties.nom}
        {feature.properties.code_dpt
          ? ` (${feature.properties.code_dpt})`
          : null}
      </button>
      <Tooltip className="map__breadcrumb-tooltip">
        {sisterZones.map((feat, index) => (
          <button
            key={`${feature.properties.nom}-tooltip-button-${index}`}
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

/**
 * Renvoie le breadcrumb
 * @param {AugoraMap.Feature} feature La zone dans laquelle la map est
 * @param {Function} handleClick La fonction à exécuter au click de l'item breadcrumb
 */
export default function MapBreadcrumb(props: IMapBreadcrumb) {
  const history = getHistory(props.feature)

  return (
    <CustomControl>
      <div className="map__breadcrumb">
        {history.map((item, index) => (
          <MapBreadcrumbItem
            key={`breadcrumb-${index}`}
            feature={item}
            handleClick={props.handleClick}
          />
        ))}
      </div>
    </CustomControl>
  )
}
