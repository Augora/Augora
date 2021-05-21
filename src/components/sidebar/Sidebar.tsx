import React, { useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useSwipeable } from "react-swipeable"
import IconClose from "images/ui-kit/icon-close.svg"
import IconRefresh from "images/ui-kit/icon-refresh.svg"
import IconSearch from "images/ui-kit/icon-loupe.svg"
import IconArrow from "images/ui-kit/icon-arrow.svg"
const GradientBanner = dynamic(() => import("components/graphics/GradientBanner"), {
  ssr: false,
})

interface ISideBar {
  /** Ferme la sidebar */
  close?(): void
  /** Ouvre la sidebar */
  open?(): void
  visible?: boolean
  children?: React.ReactNode
}

interface ISideBarHeader {
  /** Ferme la sidebar */
  close?(): void
  activeFilters?: boolean
  resetFilters?(): void
}

interface ISidebarCat {
  /** Si la catégorie est ouverte par défaut */
  opened?: boolean
  title?: string
  className?: string
  children?: React.ReactNode
}

const SidebarLink = ({ href, title }: { href: string; title?: string }) => {
  return (
    <Link href={href}>
      <a className="link" title={`Aller sur la page ${title ? title : ""}`}>
        {title}
      </a>
    </Link>
  )
}

const SidebarCat = ({ title, className, children, opened }: ISidebarCat) => {
  const [visible, setVisible] = useState(opened ? opened : false)

  return (
    <div className="content__category">
      <button className="category__btn" onClick={() => setVisible(!visible)}>
        <div className="icon-wrapper">
          <IconArrow />
        </div>
        {title}
      </button>
      <div className={`category__content ${className ? className : ""}${visible ? " visible" : ""}`}>{children}</div>
    </div>
  )
}

export const SidebarFooter = () => {
  return (
    <div className="sidebar__footer">
      <span>Augora.fr</span>
    </div>
  )
}

/** Contenu de la sidebar */
export const SidebarContent = () => {
  return (
    <div className="sidebar__content">
      <div className="content__links">
        <SidebarLink title="Députés" href="/" />
        <SidebarLink title="Carte" href="/carte" />
        <SidebarLink title="FAQ" href="/faq" />
      </div>
      <div className="separator" />
    </div>
  )
}

export const SidebarHeader = ({ search, keyword }: { search(arg: string): void; keyword: string }) => {
  return (
    <div className="sidebar__header">
      <GradientBanner />
      <form
        className="header__search"
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <input
          className="search__input"
          type="text"
          placeholder="Chercher un député..."
          value={keyword}
          onChange={(e) => {
            search(e.target.value)
          }}
        />
        <div className="icon-wrapper search__icon">
          <IconSearch />
        </div>
        {/* <div className={`search__clear ${state.Keyword.length > 0 ? "search__clear--visible" : ""}`}>
          <input
            className="search__clear-btn"
            type="reset"
            value=""
            title="Effacer"
            onClick={() => {
              handleSearch("")
            }}
          />
          <div className="icon-wrapper">
            <IconClose />
          </div>
        </div> */}
      </form>
    </div>
  )
}

/**
 * Renvoie une sidebar avec swipe controls
 * @param {boolean} visible State de visibilité
 * @param {Function} [close] Callback pour fermer la sidebar
 * @param {Function} [open] Callback pour ouvrir la sidebar
 */
export default function Sidebar({ visible, children, close, open }: ISideBar) {
  const handlers = useSwipeable({
    onSwipedLeft: open,
    onSwipedRight: close,
    trackMouse: true,
  })

  return (
    <div className={`sidebar ${visible ? "visible" : ""}`}>
      <div className="sidebar__swipe" {...handlers} />
      <div className="sidebar__visuals">{children}</div>
      <div className="sidebar__close">
        <button className="close__btn" onClick={close}>
          <div className="icon-wrapper">
            <IconClose />
          </div>
        </button>
      </div>
    </div>
  )
}
