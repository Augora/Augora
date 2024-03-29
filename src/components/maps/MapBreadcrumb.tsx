import React, { useEffect, useRef, useState } from "react"
import { getZoneName } from "components/maps/maps-utils"
import Tooltip from "components/tooltip/Tooltip"
import IconChevron from "images/ui-kit/icon-chevron.svg"
import sortBy from "lodash/sortBy"
import { slugify } from "utils/utils"

interface IMapBreadcrumb {
  breadcrumb: AugoraMap.Breadcrumb[]
  handleClick: (feature: AugoraMap.Feature) => void
}

interface IBreadcrumbItem {
  zone: AugoraMap.Breadcrumb
  handleClick: (feature: AugoraMap.Feature) => void
}

interface IBreadcrumbMenu {
  zones: AugoraMap.Breadcrumb[]
  onClick: (feature: AugoraMap.Feature) => void
  closeParent?: (args?: any) => any
  className?: string
}

/**
 * Renvoie un menu déroulant pour des zones enfant
 * @param {AugoraMap.Feature[]} zones La liste des zones enfant
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
        title="Voir les zones enfant"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="icon-wrapper">
          <IconChevron />
        </div>
      </button>
      {isOpen && (
        <Tooltip className="menu__tooltip">
          {props.zones.map((item, index) => {
            const zoneName = getZoneName(item.feature)
            return (
              <div className="tooltip__item" key={`tooltip-btn-${index}-${slugify(zoneName)}`}>
                <button
                  className="tooltip__btn"
                  onClick={() => {
                    props.onClick(item.feature)
                    closeAll()
                  }}
                  title={`Aller sur ${zoneName}`}
                >
                  <div className="tooltip__name">{zoneName}</div>
                </button>
                {item.children && item.children.length > 0 && (
                  <BreadcrumbMenu
                    className="list"
                    zones={sortBy(item.children, (o) => o.feature.properties.nom || o.feature.properties.code_circ)}
                    onClick={props.onClick}
                    closeParent={closeAll}
                  />
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
function BreadcrumbItem({ zone, handleClick }: IBreadcrumbItem) {
  return (
    <div className="breadcrumb__item">
      <button
        className={`breadcrumb__zone ${!zone.children || zone.children.length < 1 ? "breadcrumb__zone--solo" : ""}`}
        onClick={() => handleClick(zone.feature)}
        title={`Revenir sur ${getZoneName(zone.feature)}`}
      >
        {getZoneName(zone.feature)}
      </button>
      {zone.children && zone.children.length > 0 && (
        <BreadcrumbMenu
          className="zone"
          zones={sortBy(zone.children, (o) => o.feature.properties.nom || o.feature.properties.code_circ)}
          onClick={handleClick}
        />
      )}
    </div>
  )
}

/**
 * Renvoie le breadcrumb
 * @param {AugoraMap.Feature} feature La zone dans laquelle la map est
 * @param {Function} handleClick La fonction à exécuter au click de l'item breadcrumb
 */
export default function MapBreadcrumb({ breadcrumb, handleClick }: IMapBreadcrumb) {
  return (
    <div className="map__breadcrumb">
      {breadcrumb.map((item, index) => (
        <BreadcrumbItem key={`breadcrumb-${index}-${slugify(getZoneName(item.feature))}`} zone={item} handleClick={handleClick} />
      ))}
    </div>
  )
}
