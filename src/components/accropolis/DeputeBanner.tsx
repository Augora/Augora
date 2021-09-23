import React, { useState, useEffect } from "react"
import styles from "./DeputeBannerStyles.module.scss"
import { gsap } from "gsap"
import { getGroupLogo } from "components/deputies-list/deputies-list-utils"
import mapStore from "stores/mapStore"
import MapAugora from "components/maps/MapAugora"
import { createFeatureCollection, getFeature, getLayerPaint } from "components/maps/maps-utils"
import _ from "lodash"

// Rectangles
const numberOfRect = 30
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

export default function DeputeBanner({
  debug,
  numberOfQuestions,
  depute,
  index,
  currentAnimation,
  setCurrentAnimation,
  mapOpacity,
  setMapOpacity,
  question
}) {
  const [rectangles, setRectangles] = useState([])
  const { NumeroCirconscription, NumeroDepartement } = depute
  const feature = getFeature({
    code_circ: NumeroCirconscription,
    code_dpt: NumeroDepartement,
  })
  const { viewport, setViewport, overview } = mapStore()
  const refMapOpacity = { value: mapOpacity.value }
  const HSL = depute.GroupeParlementaire.CouleurDetail.HSL
  const RGB = depute.GroupeParlementaire.CouleurDetail.RGB
  const GroupeLogo = getGroupLogo(depute.GroupeParlementaire.Sigle)
  const [currentQuestionTL, setCurrentQuestionTL] = useState(null)
  const [oldDepute, setOldDepute] = useState(depute)
  const [oldHSL, setOldHSL] = useState(HSL)
  const [oldRGB, setOldRGB] = useState(RGB)

  // When we change the banner content
  /*----------------------------------------------------*/
  useEffect(() => {
    console.log('[useEffec index]')
    // Creates or modifies Rectangles
    setRectangles(() => {
      const rects = []
      for (let i = 0; i < numberOfRect; i++) {
        const xPos = 1600
        rects.push({
            xPos: xPos,
            width: getRandomArbitrary(svgWidth / 5, svgWidth / 30, 100),
            height: svgHeight,
            // opacity: getRandomArbitrary(0.05, 0.1),
            translate: getRandomArbitrary(-50, 25, 100),
        })
      }
      return rects
    })

    // Hide question
    if (currentQuestionTL) {
      if (!question) {
        currentQuestionTL.kill()
        setCurrentQuestionTL(null)
      }
      const hideQuestionTL = gsap.timeline({
        onComplete: () => {
          currentQuestionTL.kill()
          setCurrentQuestionTL(null)
          hideQuestionTL.kill()

          const renderTL = renderAnimation(currentAnimation)  
          renderTL.set(`.${styles.deputeBanner__bottomBackgroundTransition}`, {
            scaleX: 0,
          })
          renderTL.play()
        }
      })
      hideQuestionTL.addLabel('hideQuestionTL')
      hideQuestionTL.to(`.${styles.deputeBanner__questionInner}`, {
        x: '-100%',
        ease: 'power1.in',
        duration: 0.5,
      })
      hideQuestionTL.to(`.${styles.deputeBanner__topBackground}`, {
        scaleX: 0,
        ease: 'power1.in',
      })
      hideQuestionTL.play()
    } else {
      const renderTL = renderAnimation(currentAnimation)
      renderTL.set(`.${styles.deputeBanner__bottomBackgroundTransition}`, {
        scaleX: 0,
      })
      renderTL.play()
    }
  }, [index])

  // Reveal animation
  /*----------------------------------------------------*/
  const renderAnimation = (currentAnimation) => {
    // Resets
    if (currentAnimation.animation) {
      currentAnimation.animation.kill()
    }
    const renderTL = gsap.timeline({
      onComplete: () => {
        setOldDepute(depute)
        setCurrentAnimation(
          Object.assign(currentAnimation, {
            animation: null,
            type: null,
          })
        )
      },
    })
    renderTL.addLabel('renderTL')
    renderTL.call(() => {
      setCurrentAnimation(
        Object.assign(currentAnimation, {
          animation: renderTL,
          type: "render",
        })
      )
    })

    // If initial state (no anim) hide question background
    if (!currentQuestionTL) {
      renderTL.set(`.${styles.deputeBanner__topBackground}`, {
        scaleX: 0
      })
    }

    // Display component
    renderTL.to(`.${styles.deputeBanner__bottomBackgroundTransition}`, {
      scaleX: 1,
      ease: 'power1.in',
    })
    renderTL.fromTo(`.${styles.deputeBanner__logoGroup}`, {
        x: '-100px',
        autoAlpha: 0,
        ease: 'power1.in'
      }, {
        x: '0px',
        autoAlpha: 1,
        ease: 'power1.inOut'
    })
    renderTL.to(`.${styles.deputeBanner__content} > *`, {
      x: '0%',
      autoAlpha: 1,
      ease: 'power1.out'
    }, '-=0.2')
    renderTL.to(`.${styles.deputeBanner__questionNumber}`, {
      x: '0%',
      ease: 'power1.out',
      duration: 0.4
    }, '+=1')

    // Map opacity transition
    renderTL.to(
      refMapOpacity,
      {
        value: 1,
        duration: 0.5,
        onUpdate: () => {
          setMapOpacity({ value: refMapOpacity.value })
        },
      },
      2
    )
    renderTL.to(`.${styles.deputeBanner__mapHeader}`, {
      height: 60,
      ease: 'power1.out'
    }, '-=0.2')
    return renderTL;
  }

  // Question dynamique
  /*----------------------------------------------------*/
  useEffect(() => {
    if (!currentQuestionTL && question.length) {
      const questionTL = gsap.timeline()
      questionTL.addLabel('questionTL')

      questionTL.to(`.${styles.deputeBanner__topBackground}`, {
        scaleX: 1,
      })
      questionTL.to(`.${styles.deputeBanner__questionInner}`, {
        x: '0%'
      }, 1)

      setCurrentQuestionTL(questionTL)
      questionTL.play()
    }
  }, [question])

  return (
    <div
      className={`${styles.deputeBanner} ${debug ? styles.deputeBannerDebug : ""}`}
      style={{ 
        height: 
            debug === 'full'  ? 1080
          : debug === 'small' ? 500
          :                     300
       }}
    >
      {/* DEBUG ----------------------------------------------------------------------------------- */}
      <div className={styles.deputeBanner__debug}>
        {debug ? <img src="https://i.imgur.com/P499Dbs.jpeg" className={styles.debug__image} alt="" /> : null}
        {debug ? <img src="https://i.imgur.com/7Uqz9el.png" className={styles.debug__imageJean} alt="" /> : null}
      </div>

      {/* TOP PART -------------------------------------------------------------------------------- */}
      <section className={styles.deputeBanner__top}>
        <div
          className={styles.deputeBanner__topBackground}
          style={{
            backgroundImage: `linear-gradient(80deg, hsl(${HSL.H}, ${HSL.S}%, ${_.clamp(HSL.L + 5, 0, 100)}%) 0%, hsl(${HSL.H}, ${HSL.S}%, ${_.clamp(HSL.L - 5, 0, 100)}%) 100%)`,
            // backgroundColor: `hsl(${HSL.H}, ${_.clamp(HSL.S - 5, 0, 100)}%, ${_.clamp(HSL.L - 7, 0, 100)}%)`,
          }}
        >
          {/* Silence is golden... */}
        </div>
        <div className={styles.deputeBanner__question}>
          <div className={styles.deputeBanner__questionInner}>
            {question}
          </div>
        </div>
        <div className={styles.deputeBanner__questionNumber}>
          <span>
            Question {index + 1 < 10 ? "0" : null}
            {index + 1} / {numberOfQuestions}
          </span>
        </div>
      </section>

      {/* BOTTOM PART ------------------------------------------------------------------------------ */}
      <section className={styles.deputeBanner__bottom}>
        <div
          className={styles.deputeBanner__bottomBackground}
          style={{
            backgroundColor: oldDepute.GroupeParlementaire.Couleur,
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
                    // fill: `rgba(255,255,255,${rec.opacity})`,
                    fill: `rgba(255,255,255,0.05)`,
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
              backgroundImage: `linear-gradient(90deg, rgba(${oldRGB.R}, ${oldRGB.G}, ${oldRGB.B}, 1) 33%, rgba(${oldRGB.R}, ${oldRGB.G}, ${oldRGB.B}, 0) 100%)`
             }}
          ></div>
          <div
            className={styles.deputeBanner__bottomBackgroundTransition} 
            style={{
              backgroundColor: depute.GroupeParlementaire.Couleur,
            }}
          ></div>
        </div>
        <div className={styles.deputeBanner__logoGroup}>
          <GroupeLogo style={{ fill: depute.GroupeParlementaire.Couleur }} />
        </div>
        <div className={styles.deputeBanner__logoBackground}>
          {/* Silence is golden... */}
        </div>
        <div className={styles.deputeBanner__content}>
          <span className={styles.deputeBanner__firstname}>{depute.Prenom}</span>
          <br />
          <span className={styles.deputeBanner__lastname}>{depute.NomDeFamille}</span>
        </div>
      </section>

      {/* MAP PART --------------------------------------------------------------------------------- */}
      <section className={styles.deputeBanner__map}>
        <div className={styles.deputeBanner__mapHeader} style={{ backgroundColor: depute.GroupeParlementaire.Couleur }}>
          <p>
            {depute.NomRegion}
            <br />
            {depute.NomRegion !== depute.NomDepartement ? depute.NomDepartement : null}
          </p>
        </div>
        <div className={styles.deputeBanner__mapContainer}>
          <MapAugora
            overlay={false}
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
