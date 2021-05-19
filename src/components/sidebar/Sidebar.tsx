import React from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import IconClose from "images/ui-kit/icon-close.svg"
const GradientBanner = dynamic(() => import("components/graphics/GradientBanner"), {
  ssr: false,
})

interface ISideBar {
  className?: string
  close?: () => void
}

const SidebarLinkSeparator = () => {
  return <div className="content__separator" />
}

const SidebarLink = (props) => {
  return (
    <Link href={props.href}>
      <a className="content__link">{props.title}</a>
    </Link>
  )
}

export default function Sidebar(props: ISideBar) {
  return (
    <div className={`sidebar ${props.className ? props.className : ""}`}>
      <div className="sidebar__header">
        <GradientBanner />
        {/* <h2 className="header__title">Sidebar</h2> */}
        <button className="header__close" title="Fermer le menu" onClick={() => props.close()}>
          <div className="icon-wrapper">
            <IconClose />
          </div>
        </button>
      </div>
      <div className="sidebar__content">
        <SidebarLink title="Liste des députés" href="/" />
        <SidebarLink title="Carte" href="/carte" />
        <SidebarLinkSeparator />
        <SidebarLink title="FAQ" href="/faq" />
      </div>
    </div>
  )
}
