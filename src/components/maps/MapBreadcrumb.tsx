import React, { useEffect, useRef, useState } from "react"
import {
  Code,
  Cont,
  MetroFeature,
  getContinent,
  getZoneCode,
  WorldFeature,
  getChildFeatures,
  getZoneName,
  getParentFeature,
} from "components/maps/maps-utils"
import Tooltip from "components/tooltip/Tooltip"
import CustomControl from "components/maps/CustomControl"
import IconChevron from "images/ui-kit/icon-chevron.svg"
import sortBy from "lodash/sortBy"
import { slugify } from "utils/utils"

interface IMapBreadcrumb {
  feature: AugoraMap.Feature
  handleClick: (args?: any) => any
}

interface IBreadcrumbItem extends IMapBreadcrumb {}

interface IBreadcrumbMenu {
  zones: AugoraMap.Feature[]
  onClick: (args?: any) => any
  closeParent?: (args?: any) => any
  className?: string
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
      return contId === Cont.France ? [WorldFeature, MetroFeature, getParentFeature(feature), feature] : [WorldFeature, feature]
    case Code.Circ:
      const dpt = getParentFeature(feature)
      switch (contId) {
        case Cont.France:
          return [WorldFeature, MetroFeature, getParentFeature(dpt), dpt, feature]
        case Cont.OM:
          return [WorldFeature, dpt, feature]
        case Cont.World:
          return [WorldFeature, feature]
      }
    default:
      return []
  }
}

/**
 * Renvoie les enfants de la feature pour le breadcrumb (rangé par ordre alphabétique)
 * @param {AugoraMap.Feature} feature
 */
const getBreadcrumbChildren = (feature: AugoraMap.Feature): AugoraMap.Feature[] => {
  const cont = getContinent(feature)
  const childFeatures =
    cont !== Cont.World
      ? getChildFeatures(feature).features
      : getChildFeatures(feature).features.filter((feat) => getZoneCode(feat) !== Code.Circ)

  return sortBy(childFeatures, (o) => {
    return o.properties.nom ? o.properties.nom : o.properties.code_circ
  })
}

/**
 * Renvoie un bouton de menu déroulant pour des zones apparentées
 * @param {AugoraMap.Feature[]} zones La liste des zones apparentées
 * @param {Function} onClick La fonction au click des zones
 * @param {string} [className] Overload classname optionel
 * @param {string} [title] Title du bouton optionel
 */
function BreadcrumbMenu(props: IBreadcrumbMenu) {
  const [isOpen, setIsOpen] = useState(false)

  const node = useRef<HTMLDivElement>()

  useEffect(() => {
    document.addEventListener("mousedown", handleClick)
    return () => {
      document.removeEventListener("mousedown", handleClick)
    }
  }, [])

  const closeAll = () => {
    if (props.closeParent) props.closeParent()
    setIsOpen(false)
  }

  const handleClick = (e) => {
    if (node?.current) {
      if (!node.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
  }

  return (
    <div className={`breadcrumb__menu ${props.className ? props.className : ""}`} ref={node}>
      <button
        className={`menu__btn ${isOpen ? "menu__btn--active" : ""}`}
        title="Voir les zones enfants"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="icon-wrapper">
          <IconChevron />
        </div>
      </button>
      {isOpen && (
        <Tooltip className="menu__tooltip">
          {props.zones.map((feature, index) => {
            const zoneName = getZoneName(feature)
            const zoneCode = getZoneCode(feature)
            const childZones = getBreadcrumbChildren(feature)

            return (
              <div className="tooltip__item" key={`tooltip-btn-${index}-${feature.properties[zoneCode]}-${zoneCode}`}>
                <button
                  className="tooltip__btn"
                  onClick={() => {
                    props.onClick(feature)
                    closeAll()
                  }}
                  title={`Aller sur ${zoneName}`}
                >
                  <div className="tooltip__name">{zoneName}</div>
                </button>
                {childZones.length > 0 && (
                  <BreadcrumbMenu className="list" zones={childZones} onClick={props.onClick} closeParent={closeAll} />
                )}
              </div>
            )
          })}
        </Tooltip>
      )}
    </div>
  )
}

/**
 * Renvoie un bouton de breadcrumb
 * @param {AugoraMap.Feature} feature La feature du bouton
 * @param {Function} handleClick La fonction au click du bouton
 * @param {boolean} [isLast] Si l'item est le dernier du breadcrumb
 */
function BreadcrumbItem({ feature, handleClick }: IBreadcrumbItem) {
  const childZones = getBreadcrumbChildren(feature)

  return (
    <div className="breadcrumb__item">
      <button
        className={`breadcrumb__zone ${!childZones.length ? "breadcrumb__zone--solo" : ""}`}
        onClick={() => handleClick(feature)}
        title={`Revenir sur ${getZoneName(feature)}`}
      >
        {getZoneName(feature)}
      </button>
      {childZones.length > 0 && <BreadcrumbMenu className="zone" zones={childZones} onClick={handleClick} />}
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
        <BreadcrumbItem key={`breadcrumb-${index}-${slugify(getZoneName(item))}`} feature={item} handleClick={handleClick} />
      ))}
    </CustomControl>
  )
}
