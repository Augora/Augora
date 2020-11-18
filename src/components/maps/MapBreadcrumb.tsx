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
  WorldFeatures,
  getChildFeatures,
  getZoneName,
} from "components/maps/maps-utils"
import Tooltip from "components/tooltip/Tooltip"
import CustomControl from "components/maps/CustomControl"
import IconArrow from "images/ui-kit/icon-arrow.svg"
import sortBy from "lodash/sortBy"
import { slugify } from "utils/utils"

interface IMapBreadcrumb {
  feature: AugoraMap.Feature
  handleClick: (args?: any) => any
}

interface IBreadcrumbItem extends IMapBreadcrumb {
  isLast?: boolean
}

interface IBreadcrumbMenu {
  zones: AugoraMap.Feature[]
  onClick: (args?: any) => any
  className?: string
  title?: string
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

/**
 * Renvoie un bouton de menu déroulant pour des zones apparentées
 * @param {AugoraMap.Feature[]} zones La liste des zones apparentées
 * @param {Function} onClick La fonction au click des zones
 * @param {string} [className] Overload classname optionel
 * @param {string} [title] Title du bouton optionel
 */
function BreadcrumbMenu(props: IBreadcrumbMenu) {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)

  return (
    <div
      className={`breadcrumb__menu ${props.className ? "breadcrumb__menu--" + props.className : ""}`}
      onMouseLeave={() => setIsTooltipVisible(false)}
    >
      <button
        className="menu__btn"
        title={props.title}
        onClick={() => setIsTooltipVisible(!isTooltipVisible)}
        onMouseEnter={() => setIsTooltipVisible(true)}
      >
        <div className="icon-wrapper">
          <IconArrow />
        </div>
      </button>
      {isTooltipVisible && (
        <Tooltip className="menu__tooltip">
          {props.zones.map((feature, index) => {
            const zoneName = getZoneName(feature)
            const zoneCode = getZoneCode(feature)
            const isReal = feature.geometry.coordinates.length > 0

            return (
              <div className="tooltip__item" key={`tooltip-btn-${index}-${feature.properties[zoneCode]}-${zoneCode}`}>
                {isReal ? (
                  <button
                    className="tooltip__btn"
                    onClick={() => {
                      props.onClick(feature)
                      setIsTooltipVisible(false)
                    }}
                    title={`${feature.properties.nom ? "Aller sur" : "Voir le député de la"} ${zoneName}${
                      feature.properties.nom_dpt ? " de " + feature.properties.nom_dpt : ""
                    }`}
                  >
                    <div className="tooltip__name">{zoneName}</div>
                  </button>
                ) : (
                  <div className="tooltip__name tooltip__name--virtual">{zoneName}</div>
                )}
                {zoneCode !== Code.Dpt && zoneCode !== Code.Circ ? (
                  <BreadcrumbMenu
                    zones={getBreadcrumbChildren(feature)}
                    onClick={props.onClick}
                    className={`children ${!isReal ? "virtual" : ""}`}
                    title="Voir les zones enfants"
                  />
                ) : null}
              </div>
            )
          })}
        </Tooltip>
      )}
    </div>
  )
}

const getBreadcrumbChildren = (feature: AugoraMap.Feature): AugoraMap.Feature[] => {
  if (feature !== WorldFeature)
    return sortBy(getChildFeatures(feature).features, (o) => {
      return o.properties.nom ? o.properties.nom : o.properties.code_circ
    })
  else return WorldFeatures
}

/**
 * Renvoie un bouton de breadcrumb
 * @param {AugoraMap.Feature} feature La feature du bouton
 * @param {Function} handleClick La fonction au click du bouton
 * @param {boolean} [isLast] Si l'item est le dernier du breadcrumb
 */
function BreadcrumbItem({ feature, handleClick, isLast }: IBreadcrumbItem) {
  const sisterZones = sortBy(getSisterFeatures(feature), (o) => o.properties.nom)
  const childZones = isLast && getZoneCode(feature) !== Code.Dpt ? getBreadcrumbChildren(feature) : []

  return (
    <div className="breadcrumb__item">
      <button className="breadcrumb__zone" onClick={() => handleClick(feature)} title={`Revenir sur ${getZoneName(feature)}`}>
        {getZoneName(feature)}
      </button>
      {sisterZones.length > 0 && (
        <BreadcrumbMenu zones={sisterZones} onClick={handleClick} className="sisters" title="Voir les zones soeurs" />
      )}
      {childZones.length > 0 && (
        <BreadcrumbMenu zones={childZones} onClick={handleClick} className="children" title="Voir les zones enfants" />
      )}
    </div>
  )
}

/**
 * Renvoie le breadcrumb
 * @param {AugoraMap.Feature} feature La zone dans laquelle la map est
 * @param {Function} handleClick La fonction à exécuter au click de l'item breadcrumb
 */
export default function MapBreadcrumb({ feature, handleClick }: IMapBreadcrumb) {
  const history = getHistory(feature)

  return (
    <CustomControl className="map__breadcrumb">
      {history.map((item, index) => (
        <BreadcrumbItem
          key={`breadcrumb-${index}-${slugify(item.properties.nom)}`}
          feature={item}
          handleClick={handleClick}
          isLast={index + 1 === history.length}
        />
      ))}
    </CustomControl>
  )
}
