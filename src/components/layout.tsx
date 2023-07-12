import React, { useState, useEffect } from "react"
import Head from "next/head"
import { useSwipeable } from "react-swipeable"
import { NextRouter } from "next/router"
import { colors } from "utils/variables"
import Header from "./header"
import Footer from "./footer"
import PageTitle from "./titles/PageTitle"
import Popin from "./popin/Popin"
import Popup from "./popup/Popup"
import Contact from "./contact/Contact"
import usePopup from "hooks/popup/usePopup"
import Sidebar, { SidebarCategory, SidebarFooter, SidebarHeader, SidebarLinks } from "components/sidebar/Sidebar"
import useDeputiesFilters from "hooks/deputies-filters/useDeputiesFilters"
import { getPageTypeFromRoute, PageType } from "./seo/seo-utils"
import PageTransition from "components/animations/PageTransition"
import PageLoading from "components/animations/PageLoading"
import IconArrow from "images/ui-kit/icon-arrow.svg"

interface ILayout {
  children: React.ReactElement
  title?: string
  transparentHeader?: boolean
  location: NextRouter
}

const allColors = colors.map((color) => {
  return "--" + color.name + "-color :" + color.hex + ";\n"
})

/**
 * Renvoie le container des pages, comprenant le header, popin, etc
 * @param {NextRouter} location Objet du react router contenant les infos de route
 * @param {string} [title] Titre de la page
 */
const Layout = ({ children, location, title, transparentHeader }: ILayout) => {
  const {
    state: { IsInitialState, Keyword },
    handleReset,
    handleSearch,
  } = useDeputiesFilters()
  const [scrolled, setScrolled] = useState(false)
  const [homeScrolled, setHomeScrolled] = useState(false)
  const [hasSidebar, setHasSidebar] = useState(false)
  const [isPopinVisible, setisPopinVisible] = useState(false)
  const [hasLayout, setHasLayout] = useState(true)
  const { isPopupVisible, togglePopup } = usePopup()

  const { ref: documentRef } = useSwipeable({
    onSwiped: ({ dir }) => {
      if (dir === "Left") setHasSidebar(true)
      else if (dir === "Right") setHasSidebar(false)
    },
    trackMouse: true, //doesn't seem to work
  })

  function getScrollPercent() {
    const h = document.documentElement,
      b = document.body,
      st = "scrollTop",
      sh = "scrollHeight"
    return ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100
  }

  const pageColor: Color.HSL = children.props.depute ? children.props.depute.GroupeParlementaire.CouleurDetail.HSL : null

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setScrolled(true)
    } else {
      setScrolled(false)
    }

    if (location.route === "/") {
      if (getScrollPercent() >= 10) {
        setHomeScrolled(true)
      } else {
        setHomeScrolled(false)
      }
    }
  }

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  useEffect(() => {
    window.addEventListener("scroll", (e) => {
      handleScroll()
    })

    handleScroll()

    documentRef(document as any)

    return () => {
      window.removeEventListener("scroll", handleScroll, true)
    }
  }, [])

  useEffect(() => {
    const pageType = getPageTypeFromRoute(location.route)
    if (pageType === PageType.Deputes || pageType === PageType.Map) {
      setisPopinVisible(true)
    } else setisPopinVisible(false)

    if (location.route === "/accropolis") {
      setHasLayout(false)
    }

    setHasSidebar(false)
  }, [location.route])

  return (
    <div
      className={`page-body${title ? " with-title" : " no-title"}${scrolled ? " scrolled" : ""}${
        homeScrolled ? " scrolled--home" : ""
      }${!hasLayout ? " no-layout" : ""}${transparentHeader ? " transparent" : ""}`}
    >
      <Head>
        <style>{`:root {\n${allColors.join("")}}`}</style>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <div className="header__container">
        <Header siteTitle={"Augora"} location={location} color={pageColor} onBurgerClick={() => setHasSidebar(!hasSidebar)} />
        <PageTitle color={pageColor} title={title ? title : null} isScrolled={scrolled} isTransparent={transparentHeader} />
        <Popin displayed={isPopinVisible && !IsInitialState}>
          <p>Certains filtres sont actifs</p>
          <button className="popin__reset" onClick={() => handleReset()} title="Réinitialiser les filtres">
            Réinitialiser les filtres
          </button>
        </Popin>
      </div>
      <div className={`sidebar__overlay ${hasSidebar ? "visible" : ""}`} onClick={() => setHasSidebar(false)} />
      <Sidebar visible={hasSidebar} close={() => setHasSidebar(false)} open={() => setHasSidebar(true)}>
        <SidebarHeader search={handleSearch} keyword={Keyword} />
        <div className="sidebar__content">
          <SidebarLinks location={location} />
          {/* <SidebarCategory title="Filtres"></SidebarCategory> */}
        </div>
        <SidebarFooter />
      </Sidebar>
      <PageTransition paddingTop={title ? 175 : transparentHeader ? 0 : 60}>{children}</PageTransition>
      <PageLoading />
      <div className={`scroll-to-top ${scrolled ? "visible" : "hidden"}`} onClick={() => handleScrollTop()}>
        <IconArrow />
      </div>
      <Footer togglePopup={togglePopup} />
      <Popup className="popup--contact" visible={isPopupVisible} togglePopup={togglePopup}>
        <Contact />
      </Popup>
    </div>
  )
}

export default Layout
