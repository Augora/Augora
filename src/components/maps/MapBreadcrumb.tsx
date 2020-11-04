import React, { useState } from "react"
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
import IconArrow from "images/ui-kit/icon-arrow.svg"
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
  const [sistersVisible, setSistersVisible] = useState(false)
  const sisterZones = sortBy(getSisterFeatures(feature), (o) => o.properties.nom)

  return (
    <div className="map__breadcrumb-item" onMouseLeave={() => setSistersVisible(false)}>
      <button
        className="map__breadcrumb-zone"
        onClick={() => {
          handleClick(feature)
          setSistersVisible(false)
        }}
        title={`Revenir sur ${feature.properties.nom}`}
      >
        {feature.properties.nom}
        {feature.properties.code_dpt ? ` (${feature.properties.code_dpt})` : null}
      </button>
      {sisterZones.length > 0 ? (
        <div className="sisters">
          <button className="sisters__btn" title="Voir les zones associées" onClick={() => setSistersVisible(!sistersVisible)}>
            <div className="icon-wrapper">
              <IconArrow />
            </div>
          </button>
          <Tooltip className={`sisters__tooltip ${sistersVisible ? "visible" : ""}`}>
            {sisterZones.map((feat, index) => (
              <button
                key={`${feature.properties.nom}-tooltip-button-${index}`}
                onClick={() => {
                  handleClick(feat)
                  setSistersVisible(false)
                }}
                title={`Aller sur ${feat.properties.nom}`}
              >
                {feat.properties.nom}
                {feat.properties.code_dpt ? ` (${feat.properties.code_dpt})` : null}
              </button>
            ))}
          </Tooltip>
        </div>
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
