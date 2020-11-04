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
  getChildFeatures,
  getDeputies,
} from "components/maps/maps-utils"
import Tooltip from "components/tooltip/Tooltip"
import CustomControl from "components/maps/CustomControl"
import IconArrow from "images/ui-kit/icon-arrow.svg"
import sortBy from "lodash/sortBy"

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
 * Renvoie le nom d'une feature
 * @param {AugoraMap.Feature} feature
 */
const getZoneName = (feature: AugoraMap.Feature): string => {
  const code = getZoneCode(feature)

  switch (code) {
    case Code.Cont:
    case Code.Reg:
      return feature.properties.nom
    case Code.Dpt:
      return `${feature.properties.nom} (${feature.properties.code_dpt})`
    case Code.Circ:
      return `(Temporaire - ne fait rien)`
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
        onClick={() => {
          setIsTooltipVisible(!isTooltipVisible)
        }}
      >
        <div className="icon-wrapper">
          <IconArrow />
        </div>
      </button>
      {isTooltipVisible ? (
        <Tooltip className={`menu__tooltip ${props.className ? "menu__tooltip--" + props.className : ""}`}>
          {props.zones.map((feature, index) => {
            const zoneName = getZoneName(feature)
            return (
              <button
                key={`${feature.properties.nom}-tooltip-button-${index}`}
                onClick={() => {
                  props.onClick(feature)
                  setIsTooltipVisible(false)
                }}
                title={`Aller sur ${zoneName}`}
              >
                {zoneName}
              </button>
            )
          })}
        </Tooltip>
      ) : null}
    </div>
  )
}

/**
 * Renvoie un bouton de breadcrumb
 * @param {AugoraMap.Feature} feature La feature du bouton
 * @param {Function} handleClick La fonction au click du bouton
 * @param {boolean} [isLast] Si l'item est le dernier du breadcrumb
 */
function BreadcrumbItem({ feature, handleClick, isLast }: IBreadcrumbItem) {
  const sisterZones = sortBy(getSisterFeatures(feature), (o) => o.properties.nom)
  const childZones = isLast ? sortBy(getChildFeatures(feature).features, (o) => o.properties.nom) : []

  return (
    <div className="breadcrumb__item">
      <button className="breadcrumb__zone" onClick={() => handleClick(feature)} title={`Revenir sur ${getZoneName(feature)}`}>
        {getZoneName(feature)}
      </button>
      {sisterZones.length > 0 ? (
        <BreadcrumbMenu zones={sisterZones} onClick={handleClick} className="sisters" title="Voir les zones soeurs" />
      ) : null}
      {childZones.length > 0 ? (
        <BreadcrumbMenu zones={childZones} onClick={handleClick} className="children" title="Voir les zones enfants" />
      ) : null}
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
    <CustomControl>
      <div className="map__breadcrumb">
        {history.map((item, index) => (
          <BreadcrumbItem
            key={`breadcrumb-${index}`}
            feature={item}
            handleClick={handleClick}
            isLast={index + 1 === history.length}
          />
        ))}
      </div>
    </CustomControl>
  )
}
