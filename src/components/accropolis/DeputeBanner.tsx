import React, { useState, useEffect } from "react"
import styles from "./DeputeBannerStyles.module.scss"
import { gsap } from "gsap"
import { getGroupLogo } from "components/deputies-list/deputies-list-utils"
import mapStore from "stores/mapStore"
import MapAugora from "components/maps/MapAugora"
import { createFeatureCollection, getFeature, getLayerPaint } from "components/maps/maps-utils"
import _ from "lodash"

// Debug
const debug = true

// Rectangles
const numberOfRect = 40
const svgWidth = 1920
const svgHeight = 100
const rectSkew = 15
const getRandomArbitrary = (min, max, round = 0) => {
  if (round) {
    return Math.round((Math.random() * (max - min) + min) * round / round);
  } else {
    return Math.random() * (max - min) + min
  }
}

export default function DeputeBanner({numberOfQuestions, depute, index, currentAnimation, setCurrentAnimation, mapOpacity, setMapOpacity}) {
  const [rectangles, setRectangles] = useState([])
  const { NumeroCirconscription, NumeroDepartement } = depute
  const feature = getFeature({
    code_circ: NumeroCirconscription,
    code_dpt: NumeroDepartement,
  })
  const { viewport, setViewport, overview } = mapStore()
  const refMapOpacity = {value: mapOpacity.value}
  const HSL = depute.GroupeParlementaire.CouleurDetail.HSL
  const RGB = depute.GroupeParlementaire.CouleurDetail.RGB
  const GroupeLogo = getGroupLogo(depute.GroupeParlementaire.Sigle)

  // Creates Rectangles
  useEffect(() => {
    setRectangles(() => {
      const rects = []
      for (let i = 0; i < numberOfRect; i++) {
        const xPos = (svgWidth / numberOfRect) * i
        rects.push({
            xPos: xPos,
            width: getRandomArbitrary(100, 500, 100),
            height: svgHeight,
            opacity: getRandomArbitrary(0.05, 0.2),
            translate: getRandomArbitrary(20, 100, 100)
        })
      }
    
      return rects
    })
  }, [index])

  // Reveal animation
  const renderAnimation = (currentAnimation) => {
    if (currentAnimation.animation) {
      currentAnimation.animation.kill()
    }
    const renderTL = gsap.timeline({
      onComplete: () => {
        setCurrentAnimation(Object.assign(currentAnimation, {
          animation: null,
          type: null,
        }))
      }
    })
    renderTL.call(() => {
      setCurrentAnimation(Object.assign(currentAnimation, {
        animation: renderTL,
        type: 'render',
      }))
    })
    renderTL.to(refMapOpacity, {
      value: 1,
      duration: 0.5,
      onUpdate: () => {
        setMapOpacity({value: refMapOpacity.value})
      }
    }, 2)
    // renderTL.set(currentAnimation, {
    //   mapOpacity: 0,
    // })
    // renderTL.fromTo(currentAnimation, {
    //   mapOpacity: 0,
    // }, {
    //   mapOpacity: 1,
    // })
    // renderTL.set(`.${styles.deputeBanner}`, {
    //   autoAlpha: 0,
    // })
    // renderTL.set(`.${styles.deputeBanner__mapContainer}`, {
    //   x: '-100%',
    // })
    // renderTL.fromTo(`.${styles.deputeBanner}`, {
    //     autoAlpha: 0,
    //   }, {
    //     autoAlpha: 1,
    //     ease: "power1.out",
    //     duration: 0.8,
    //   }
    // )
    // renderTL.fromTo(`.${styles.deputeBanner__mapContainer}`, {
    //     x: '-100%',
    //   },
    //   {
    //     x: '0%',
    //   },
    // )

    return renderTL;
  }

  useEffect(() => {
    const renderTL = renderAnimation(currentAnimation)
    renderTL.play()
  }, [index])

  return (
    <div className={`${styles.deputeBanner} ${debug ? styles.deputeBannerDebug : ""}`}>
      {/* DEBUG ----------------------------------- */}
      <div className={styles.deputeBanner__debug}>
        {debug ? <img src="https://i.imgur.com/P499Dbs.jpeg" className={styles.debug__image} alt="" /> : null}
        {debug ? <img src="https://i.imgur.com/7Uqz9el.png" className={styles.debug__imageJean} alt="" /> : null}
      </div>
      {/* TOP PART -------------------------------- */}
      <section className={styles.deputeBanner__top}>
        <div
          className={styles.deputeBanner__topBackground}
          style={{
            backgroundColor: `hsl(${HSL.H}, ${_.clamp(HSL.S + 5, 0, 100)}%, ${_.clamp(HSL.L - 15, 0, 100)}%)`,
          }}
        >
          {/* Silence is golden... */}
        </div>
        <div className={styles.deputeBanner__question}>Bla bla bla...</div>
        <div className={styles.deputeBanner__questionNumber}>
          <span>
            Question {index + 1 < 10 ? "0" : null}
            {index + 1} / {numberOfQuestions}
          </span>
        </div>
      </section>

      {/* BOTTOM PART ------------------------------ */}
      <section className={styles.deputeBanner__bottom}>
        <div
          className={styles.deputeBanner__bottomBackground}
          style={{
            backgroundColor: depute.GroupeParlementaire.Couleur,
          }}
        >
         <svg
          version="1.1"
          className={styles.deputeBanner__recs}
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          preserveAspectRatio="xMinYMin slice"
        >
          <g>
            {rectangles.map((rec, index) => {
              return(
                <rect
                  key={`accro-rec-${index}`}
                  x={rec.xPos}
                  y={0}
                  width={rec.width}
                  height={rec.height}
                  style={{
                    fill: `rgba(255,255,255,${rec.opacity})`,
                    transform: `skew(-${rectSkew}deg) translate3d(${rec.translate}%, 0, 0)`,
                  }}
                />
              )
            })}
            </g>
          </svg>
          <div
            className={styles.deputeBanner__bottomBackgroundGradient}
            style={{ 
              backgroundImage: `linear-gradient(to right, rgba(${RGB.R}, ${RGB.G}, ${RGB.B}, 1) 25%, rgba(${RGB.R}, ${RGB.G}, ${RGB.B}, 0) 100%)`
             }}
          ></div>
        </div>
        <div className={styles.deputeBanner__logoGroup}>
          <div className={styles.deputeBanner__logoBackground}>{/* Silence is golden... */}</div>
          <GroupeLogo style={{ fill: depute.GroupeParlementaire.Couleur }} />
        </div>
        <div className={styles.deputeBanner__content}>
          <span className={styles.deputeBanner__firstname}>{depute.Prenom}</span>
          <br />
          <span className={styles.deputeBanner__lastname}>{depute.NomDeFamille}</span>
        </div>
      </section>

      {/* MAP PART --------------------------------- */}
      <section className={styles.deputeBanner__map}>
        <div className={styles.deputeBanner__mapHeader} style={{ backgroundColor: depute.GroupeParlementaire.Couleur }}>
          {depute.NomRegion}
          <br />
          {depute.NomRegion !== depute.NomDepartement ? depute.NomDepartement : null}
        </div>
        <div className={styles.deputeBanner__mapContainer}>
          <MapAugora
            overlay={false}
            // forceCenter={true}
            small={true}
            viewport={viewport}
            attribution={false}
            overview={overview}
            borders={true}
            setViewport={setViewport}
            mapView={{
              geoJSON: createFeatureCollection([feature]),
              feature: feature,
              paint: getLayerPaint(`rgba(${RGB.R}, ${RGB.G}, ${RGB.B}, ${mapOpacity.value})`),
            }}
          />
        </div>
      </section>
    </div>
  )
}