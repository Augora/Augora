import React, { useState, useEffect } from "react"
import styles from "./DeputeBannerStyles.module.scss"
import { gsap } from "gsap"
import { getGroupLogo } from "components/deputies-list/deputies-list-utils"
import mapStore from "stores/mapStore"
import MapAugora from "components/maps/MapAugora"
import { createFeatureCollection, getFeature, getLayerPaint } from "components/maps/maps-utils"
import { getHSLLightVariation } from "utils/style/color"

const debug = true

export default function DeputeBanner({numberOfQuestions, depute, index, currentAnimation, setCurrentAnimation, mapOpacity, setMapOpacity}) {
  const { NumeroCirconscription, NumeroDepartement } = depute
  const feature = getFeature({
    code_circ: NumeroCirconscription,
    code_dpt: NumeroDepartement,
  })
  const { viewport, setViewport, overview } = mapStore()
  const refMapOpacity = {value: mapOpacity.value}

  useEffect(() => {
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
    renderTL.play()
  }, [index])

  const HSL = depute.GroupeParlementaire.CouleurDetail.HSL
  const RGB = depute.GroupeParlementaire.CouleurDetail.RGB
  const GroupeLogo = getGroupLogo(depute.GroupeParlementaire.Sigle)

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
            backgroundColor: `hsl(${HSL.H}, ${HSL.S}%, ${getHSLLightVariation(HSL, 15)}%)`,
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
          {/* Silence is golden... */}
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
