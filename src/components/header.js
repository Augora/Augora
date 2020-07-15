import { Link } from "gatsby"
import PropTypes from "prop-types"
import React, { useState, useEffect } from "react"
import Logo from "../images/logos/projet/augora-logo.svg"

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
      <meta property="og:url" content="https://augora.fr" />
      <meta property="og:type" content="website">
      <meta property="og:title" content="Site web Augora" />
      <meta property="og:description" content="">
      <meta property="og:image" content="https://augora.fr/icons/icon-512x512.png" />
      <meta property="og:image:alt" content="Icône de l'association Augora" />
      <!-- Twitter Meta Tags -->
      <meta property="twitter:url" content="https://augora.fr">
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="Site web Augora">
      <meta name="twitter:description" content="">
      <meta name="twitter:image" content="https://augora.fr/icons/icon-512x512.png">
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
