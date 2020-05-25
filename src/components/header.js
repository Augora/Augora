import { Link } from "gatsby"
import PropTypes from "prop-types"
import React, { useState, useEffect } from "react"
import Logo from "../images/logos/projet/augora-logo.svg"
import "../styles/app.scss"

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
      </div>
    </header>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
