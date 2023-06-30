import React, { useCallback, useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import IconClose from "images/ui-kit/icon-close.svg"
import IconRefresh from "images/ui-kit/icon-refresh.svg"
import IconSearch from "images/ui-kit/icon-loupe.svg"
import IconChevron from "images/ui-kit/icon-chevron.svg"
import { NextRouter } from "next/router"
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

type DebounceSearch = {
  (arg: string): void
  cancel(): void
  flush(): void
}

export const SidebarCategory = ({ title, className, children, opened }: ISidebarCat) => {
  const [visible, setVisible] = useState(opened ? opened : false)

  return (
    <div className="content__category">
      <div className="separator" />

      <button className="category__btn" onClick={() => setVisible(!visible)}>
        {title}
        <div className="icon-wrapper" style={{ transform: visible ? "rotate(-180deg)" : "" }}>
          <IconChevron />
        </div>
      </button>
      <div className={`category__content${className ? className : ""}${visible ? " visible" : ""}`}>{children}</div>
      <div className="separator" />
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

const SidebarLink = ({ href, title, isCurrent }: { href: string; title?: string; isCurrent?: boolean }) => {
  return (
    <Link href={href} className={`link ${isCurrent ? "link--current" : ""}`} title={`Aller sur la page ${title ? title : ""}`}>
      {title}
    </Link>
  )
}

/** Liens du site de la sidebar */
export const SidebarLinks = ({ location }: { location: NextRouter }) => {
  return (
    <div className="content__links">
      <SidebarLink title="Accueil" href="/" isCurrent={location.pathname === "/"} />
      <SidebarLink title="Députés" href="/deputes" isCurrent={location.pathname === "/deputes"} />
      <SidebarLink title="Statistiques" href="/statistiques" isCurrent={location.pathname === "/statistiques"} />
      <SidebarLink title="Carte" href="/carte/france" isCurrent={location.pathname.startsWith("/map")} />
      <SidebarLink title="FAQ" href="/faq" isCurrent={location.pathname === "/faq"} />
    </div>
  )
}

export const SidebarHeader = ({ search, keyword }: { search: DebounceSearch; keyword: string }) => {
  const [value, setValue] = useState("")

  useEffect(() => {
    setValue(keyword)
  }, [keyword])

  /**
   * Pour update les différents states de la recherche
   * @param {string} [value] Reset le state si la valeur manque
   */
  const handleTextInput = useCallback((value?: string) => {
    if (value && value.length > 0) {
      search(value)
      setValue(value)
    } else {
      search("")
      search.flush()
      setValue("")
    }
  }, [])

  return (
    <div className="sidebar__header">
      <GradientBanner />
      {/* <form
        className="header__search"
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <input
          className="search__input"
          type="text"
          placeholder="Filtrer les députés..."
          value={value}
          onChange={(e) => {
            handleTextInput(e.target.value)
          }}
        />
        {keyword.length > 0 ? (
          <div className="search__clear">
            <input
              type="reset"
              value=""
              title="Effacer"
              onClick={() => {
                handleTextInput()
              }}
            />
            <div className="icon-wrapper">
              <IconClose />
            </div>
          </div>
        ) : (
          <div className="icon-wrapper search__icon">
            <IconSearch />
          </div>
        )}
      </form> */}
    </div>
  )
}

/**
 * Renvoie une sidebar
 * @param {boolean} visible State de visibilité
 * @param {Function} [close] Callback pour fermer la sidebar
 * @param {Function} [open] Callback pour ouvrir la sidebar
 */
export default function Sidebar({ visible, children, close, open }: ISideBar) {
  return (
    <div className={`sidebar ${visible ? "visible" : ""}`}>
      <div className="sidebar__visuals">{children}</div>
      <div className="sidebar__close">
        <button className="close__btn" onClick={close}>
          <div className="icon-wrapper">
            <IconChevron style={{ transform: "rotate(-90deg)" }} />
          </div>
        </button>
      </div>
    </div>
  )
}
