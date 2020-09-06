import { Link } from "gatsby"
import React, { useState, useEffect } from "react"
import Logo from "../images/logos/projet/augora-logo.svg"

const pages = {
  home: {
    path: "/",
    title: "Liste des Députés",
  },
  faq: {
    path: "/faq",
    title: "F.A.Q",
  },
  carte: {
    path: "/map",
    title: "Carte de France",
  },
  // about: {
  //   path: "/about",
  //   title: "A propos de nous"
  // }
}

const Header = ({ siteTitle, location }) => {
  const [Size, setSize] = useState("normal")

  function isActivePage(path) {
    return `menu__item ${
      location.pathname === path ? "menu__item--current" : ""
    }`
  }

  const handleScroll = (event) => {
    if (window.scrollY > 50) {
      setSize("small")
    } else {
      setSize("normal")
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", (e) => {
      handleScroll()
    })
    return () => {
      window.removeEventListener("scroll", handleScroll, true)
    }
  }, [])

  return (
    <header id="header" className={`header ${Size}`}>
      <div className="header__wrapper wrapper">
        <Link to="/" className="header__home-btn">
          <div className={`header__logo-wrapper `}>
            <div className="header__svg-wrapper">
              <Logo />
            </div>
            <span className="header__site-name">Augora</span>
          </div>
        </Link>
        <div className="header__menu menu">
          {Object.keys(pages).map((page) => (
            <Link
              to={pages[page].path}
              className={isActivePage(pages[page].path)}
            >
              {pages[page].title}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
