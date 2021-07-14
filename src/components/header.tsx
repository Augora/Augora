import React from "react"
import Link from "next/link"
import { NextRouter } from "next/router"
import Logo from "images/logos/projet/augora-logo.svg"
import LogoText from "images/logos/projet/augora-text.svg"
import LogoTextThin from "images/logos/projet/augora-text-thin.svg"
import IconBurger from "images/ui-kit/icon-burger.svg"
import { getHSLLightVariation } from "../utils/style/color"

interface IHeader {
  siteTitle?: string
  color?: Group.HSLDetail
  onBurgerClick?(): void
  location: NextRouter
}

type Pages = {
  [key: string]: {
    path: string
    title: string
  }
}

type Styles = {
  flat: {}
  gradient: {}
  link?: { color: string }
  svg?: { fill: string }
  underline?: { background: string }
  separator?: { background: string }
}

const mainPages: Pages = {
  home: {
    path: "/",
    title: "Députés",
  },
  statistiques: {
    path: "/statistiques",
    title: "Statistiques",
  },
  map: {
    path: "/map",
    title: "Carte",
  },
}

const secondaryPages: Pages = {
  // about: {
  //   path: "/about",
  //   title: "A propos de nous",
  // },
  faq: {
    path: "/faq",
    title: "FAQ",
  },
}

function HeaderLinks({ pageGroup, location, styles }: { pageGroup: Pages; location: NextRouter; styles: Styles }) {
  return (
    <>
      {Object.keys(pageGroup).map((page, index) => {
        const className = `menu__item ${location.pathname === pageGroup[page].path ? "menu__item--current" : ""}`

        return (
          <div className="menu__link" key={pageGroup[page].path}>
            <Link href={pageGroup[page].path}>
              <a className={className}>
                <span>{pageGroup[page].title}</span>
                <div className="link__underline"></div>
              </a>
            </Link>
            <Link href={pageGroup[page].path}>
              <a className={className} style={styles.link}>
                <span>{pageGroup[page].title}</span>
                <div className="link__underline" style={styles.underline}></div>
              </a>
            </Link>
          </div>
        )
      })}
    </>
  )
}

/**
 * Renvoie le header
 * @param {RouteProps} location Objet du react router contenant les infos de route
 * @param {Group.HSLDetail} [color] Couleur du header optionnelle
 */
const Header = ({ siteTitle, location, color, onBurgerClick }: IHeader) => {
  let styles: Styles = {
    flat: {},
    gradient: {},
  }

  if (color) {
    const gradientStart = getHSLLightVariation(color, -20)
    const gradientEnd = getHSLLightVariation(color, -30)
    const decorationOpacity = 1
    styles.link = { color: `hsla(${color.H}, ${color.S}%, ${color.L}%)` }
    styles.svg = { fill: `hsla(${color.H}, ${color.S}%, ${color.L}%)` }
    styles.underline = {
      background: `linear-gradient(to right, hsla(${color.H}, ${color.S}%, ${gradientStart}%, ${decorationOpacity}), hsla(${color.H}, ${color.S}%, ${gradientEnd}%, ${decorationOpacity}))`,
    }
    styles.separator = {
      background: `linear-gradient(to bottom, hsla(${color.H}, ${color.S}%, ${gradientStart}%, ${decorationOpacity}), hsla(${color.H}, ${color.S}%, ${gradientEnd}%, ${decorationOpacity}))`,
    }
  }

  return (
    <header id="header" className="header">
      <div className="header__wrapper wrapper">
        <Link href="/">
          <a className="header__home-btn">
            <div className="header__logo-wrapper">
              <div className="header__logo">
                <Logo className="logo" />
                <Logo className="logo" style={styles.svg} />
              </div>
              <div className="header__text">
                <LogoText className="text" />
                <LogoTextThin className="text" style={styles.svg} />
              </div>
            </div>
          </a>
        </Link>
        <div className="header__menu menu">
          <HeaderLinks pageGroup={mainPages} location={location} styles={styles} />
          <div className="menu__separator-container">
            <span className="menu__separator" />
            <span className="menu__separator" style={styles.separator} />
          </div>
          <HeaderLinks pageGroup={secondaryPages} location={location} styles={styles} />
          <button className="menu__burger-btn" onClick={() => onBurgerClick()}>
            <div className="menu__burger-icon">
              <IconBurger className="icon" />
              <IconBurger className="icon" style={styles.svg} />
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
