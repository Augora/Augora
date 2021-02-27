import React from "react"
import Link from "next/link"
import Logo from "images/logos/projet/augora-logo.svg"
import LogoText from "images/logos/projet/augora-text.svg"
import { getHSLAsArray } from "../utils/style/color"

const mainPages = {
  home: {
    path: "/",
    title: "Députés",
  },
  carte: {
    path: "/map",
    title: "Carte",
  },
}

const secondaryPages = {
  // about: {
  //   path: "/about",
  //   title: "A propos de nous",
  // },
  faq: {
    path: "/faq",
    title: "FAQ",
  },
}

const Header = ({ siteTitle, location, color }) => {
  let styles = {
    flat: {},
    gradient: {},
  }
  if (color) {
    const colorArray = getHSLAsArray(color)

    styles.link = { color: color }
    styles.svg = { fill: color }
    styles.underline = {
      background: `linear-gradient(to right, hsl(${colorArray[1]}, ${colorArray[2]}%, ${colorArray[3]}%), hsl(${colorArray[1]}, ${
        colorArray[2]
      }%, ${Math.max(colorArray[3] - 5, 0)}%)`,
    }
    styles.separator = {
      background: `linear-gradient(to bottom, hsl(${colorArray[1]}, ${colorArray[2]}%, ${colorArray[3]}%), hsl(${
        colorArray[1]
      }, ${colorArray[2]}%, ${Math.max(colorArray[3] - 5, 0)}%)`,
    }
  }
  function isActivePage(path) {
    return `menu__item ${location.pathname === path || location.pathname === path + "/" ? "menu__item--current" : ""}`
  }

  function setLinks(pageGroup) {
    return Object.keys(pageGroup).map((page, index) => (
      <div class="menu__link">
        <Link key={pageGroup[page].path} href={pageGroup[page].path}>
          <a className={isActivePage(pageGroup[page].path)}>
            <span>{pageGroup[page].title}</span>
            <div class="link__underline"></div>
          </a>
        </Link>
        <Link key={pageGroup[page].path} href={pageGroup[page].path}>
          <a className={isActivePage(pageGroup[page].path)} style={styles.link}>
            <span>{pageGroup[page].title}</span>
            <div class="link__underline" style={styles.underline}></div>
          </a>
        </Link>
      </div>
    ))
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
                <LogoText className="text" style={styles.svg} />
              </div>
            </div>
          </a>
        </Link>
        <div className="header__menu menu">
          {setLinks(mainPages)}
          <div className="menu__separator-container">
            <span className="menu__separator" />
            <span className="menu__separator" style={styles.separator} />
          </div>
          {setLinks(secondaryPages)}
        </div>
      </div>
    </header>
  )
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
