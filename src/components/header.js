import { Link } from "gatsby"
import React, { useState, useEffect } from "react"
import Logo from "../images/logos/projet/augora-logo.svg"

function isActivePage(path) {
  return `menu__item ${
    window.location.pathname === path ? "menu__item--current" : ""
  }`
}

const Header = ({ siteTitle }) => {
  const [Size, setSize] = useState("normal")

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
          {/* <Link to="/about" className="menu__item">
            A propos de nous
          </Link> */}
          <Link to="/" className={isActivePage("/")}>
            Liste des Députés
          </Link>
          <Link to="/faq" className={isActivePage("/faq")}>
            F.A.Q
          </Link>
        </div>
      </div>
    </header>
  )
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
