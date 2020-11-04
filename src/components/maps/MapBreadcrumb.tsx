import React from "react"
import {
  Code,
  Cont,
  MetroFeature,
  getContinent,
  getZoneCode,
  getFeature,
  getSisterFeatures,
  WorldFeature,
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
  const contId = getContinent(feature)

  switch (zoneCode) {
    case Code.Cont:
      return contId === Cont.France ? [WorldFeature, MetroFeature] : [WorldFeature]
    case Code.Reg:
      return [WorldFeature, MetroFeature, feature]
    case Code.Dpt:
      return contId === Cont.France
        ? [WorldFeature, MetroFeature, getFeature(feature.properties[Code.Reg], Code.Reg), feature]
        : [WorldFeature, feature]
    default:
      console.error("Le breadcrumb n'a pas réussi à déduire le chemin de la zone")
      return []
  }
}

function MapBreadcrumbItem({ feature, handleClick }: IMapBreadcrumb) {
  const sisterZones = sortBy(getSisterFeatures(feature), (o) => o.properties.nom)

  return (
    <div className="map__breadcrumb-item">
      <button
        className="map__breadcrumb-zone"
        onClick={() => handleClick(feature)}
        title={`Revenir sur ${feature.properties.nom}`}
      >
        {feature.properties.nom}
        {feature.properties.code_dpt ? ` (${feature.properties.code_dpt})` : null}
      </button>
      {sisterZones.length > 0 ? (
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
      ) : null}
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
          <MapBreadcrumbItem key={`breadcrumb-${index}`} feature={item} handleClick={props.handleClick} />
        ))}
      </div>
    </CustomControl>
  )
}
