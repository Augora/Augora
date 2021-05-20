import React from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useSwipeable } from "react-swipeable"
import IconClose from "images/ui-kit/icon-close.svg"
const GradientBanner = dynamic(() => import("components/graphics/GradientBanner"), {
  ssr: false,
})

interface ISideBar {
  className?: string
  /** Ferme la sidebar */
  close?(): void
  /** Ouvre la sidebar */
  open?(): void
}

const SidebarLink = ({ href, title }: { href: string; title?: string }) => {
  return (
    <Link href={href}>
      <a className="content__link" title={`Aller sur la page ${title ? title : ""}`}>
        {title}
      </a>
    </Link>
  )
}

/**
 * Renvoie la sidebar
 * @param {string} className
 * @param {Function} [close] Callback pour fermer la sidebar
 * @param {Function} [open] Callback pour ouvrir la sidebar
 */
export default function Sidebar({ className, close, open }: ISideBar) {
  const handlers = useSwipeable({
    onSwipedLeft: () => open(),
    onSwipedRight: () => close(),
    trackMouse: true,
  })

  return (
    <div className={`sidebar ${className ? className : ""}`}>
      <div className="sidebar__swipe" {...handlers} />
      <div className="sidebar__visuals">
        <div className="sidebar__header">
          <GradientBanner />
          {/* <h2 className="header__title">Sidebar</h2> */}
          <button className="header__close" title="Fermer le menu" onClick={() => close()}>
            <div className="icon-wrapper">
              <IconClose />
            </div>
          </button>
        </div>
        <div className="sidebar__content">
          <SidebarLink title="Députés" href="/" />
          <SidebarLink title="Carte" href="/carte" />
          <div className="content__separator" />
          <SidebarLink title="FAQ" href="/faq" />
        </div>
        <div className="sidebar__footer">
          <span>Augora.fr</span>
        </div>
      </div>
    </div>
  )
}
