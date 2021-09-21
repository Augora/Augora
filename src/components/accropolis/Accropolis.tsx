import React, { useEffect, useState, useRef } from "react"
import DeputeCard from "./DeputeCard"
import DeputeBanner from "./DeputeBanner"
import IconChevron from "images/ui-kit/icon-chevron.svg"

import { gsap } from "gsap"
import _ from "lodash"

import mapStore from "src/stores/mapStore"
import styles from "./AccropolisStyles.module.scss"
import deputeBannerStyles from "./DeputeBannerStyles.module.scss"
import deputeCardStyles from "./DeputeCardStyles.module.scss"

export default function Accropolis({ accroDeputes }) {
  const { overview, setOverview } = mapStore()
  const [deputeCurrentCard, setDeputeCurrentCard] = useState(0);
  const [layoutType, setLayoutType] = useState('banner')
  const [currentAnimation, setCurrentAnimation] = useState({
    animation: null,
    type: null,
  })
  const [mapOpacity, setMapOpacity] = useState({value: 0})
  const refMapOpacity = {value: 1}

  // useEffect(() => {
  //   if (layoutType === 'card') {
  //     const newerTL = gsap.timeline()
  //     newerTL.set(`.${deputeCardStyles.deputeCard__inner}`, {
  //       autoAlpha: 1
  //     })
  //     newerTL.play();
  //   }
  // }, [deputeCurrentCard])

  const olderBannerAnimation = (setCurrentAnimation) => {
    // Timeline
    const olderTL = gsap.timeline({
      onComplete: () => {
        setCurrentAnimation({
          animation: null,
          type: null,
        })
      },
    })
    olderTL.call(() => {
      setCurrentAnimation({
        animation: olderTL,
        type: "older",
      })
    })

    // olderTL.fromTo(`.${deputeBannerStyles.deputeBanner__mapContainer}`, {
    //     x: 0,
    //   },
    //   {
    //     x: '-100%',
    //   }
    // )
    olderTL.to(refMapOpacity, {
      value: 0,
      duration: 0.2,
      onUpdate: () => {
        setMapOpacity({value: refMapOpacity.value})
      }
    })
    return olderTL
  }
  const olderCardAnimation = (setCurrentAnimation) => {
    // Timeline
    const olderTL = gsap.timeline({
      onComplete: () => {
        setCurrentAnimation({
          animation: null,
          type: null,
        })
      },
    })
    olderTL.call(() => {
      setCurrentAnimation({
        animation: olderTL,
        type: "older",
      })
    })
    olderTL.fromTo(
      `.${deputeCardStyles.deputeCard__geography}`,
      {
        y: 0,
        autoAlpha: 1,
      },
      {
        y: "-100%",
        autoAlpha: 0,
      }
    )
    olderTL.fromTo(
      `.${deputeCardStyles.deputeCard__mapinner}`,
      {
        x: "0%",
        autoAlpha: 1,
      },
      {
        x: "-100%",
        autoAlpha: 0,
        duration: 0.3,
      }
    )
    olderTL.fromTo(
      `.${deputeCardStyles.deputeCard__background}`,
      {
        width: "100%",
      },
      {
        width: "0%",
        ease: "power1.inOut",
        duration: 1,
      },
      "-=0.5"
    )
    olderTL.fromTo(
      `.${deputeCardStyles.deputeCard__background2}`,
      {
        width: "100%",
      },
      {
        width: "0%",
        ease: "power1.inOut",
        duration: 1,
      },
      "-=0.9"
    )
    olderTL.fromTo(
      `.${deputeCardStyles.deputeCard__question}`,
      {
        y: "0%",
        autoAlpha: 1,
      },
      {
        y: "100%",
        autoAlpha: 0,
        ease: "power1.inOut",
        duration: 0.5,
      },
      0
    )
    olderTL.fromTo(
      `.${deputeCardStyles.deputeCard__name}`,
      {
        x: "0%",
        autoAlpha: 1,
      },
      {
        x: "-120px",
        autoAlpha: 0,
        ease: "power1.in",
        duration: 0.5,
      },
      0
    )
    olderTL.fromTo(
      `.${deputeCardStyles.deputeCard__group}`,
      {
        x: "0%",
        autoAlpha: 1,
      },
      {
        x: "-120px",
        autoAlpha: 0,
        ease: "power1.in",
        duration: 0.5,
      },
      "-=1"
    )
    olderTL.fromTo(
      `.${deputeCardStyles.deputeCard__depute}`,
      {
        x: 0,
      },
      {
        x: -20,
        duration: 1,
      },
      "-=0.4"
    )
    olderTL.fromTo(
      `.${deputeCardStyles.deputeCard__image}`,
      {
        width: "110px",
      },
      {
        width: "0px",
        ease: "power4.in",
        duration: 1.1,
      },
      "-=1.5"
    )
    return olderTL
  }
  const cycleDeputeCard = (event, cardIndex) => {
    event.preventDefault()
    // event.preventDefault()
    if (layoutType === "card") {
      if (currentAnimation.animation) {
        currentAnimation.animation.kill();
        if (currentAnimation.type === 'older') {
          if (cardIndex > accroDeputes.length - 1) {
            setDeputeCurrentCard(0);
          } else if (cardIndex < 0) {
            setDeputeCurrentCard(accroDeputes.length - 1)
          } else {
            setDeputeCurrentCard(cardIndex)
          }
          return
        }
      }
      const olderTL = olderCardAnimation(setCurrentAnimation)
      // After timeline
      olderTL.call(() => {
        if (cardIndex > accroDeputes.length - 1) {
          setDeputeCurrentCard(0);
        } else if (cardIndex < 0) {
          setDeputeCurrentCard(accroDeputes.length - 1)
        } else {
          setDeputeCurrentCard(cardIndex)
        }
      }, [], '+=0.5')
  
      olderTL.set(`.${deputeCardStyles.deputeCard__inner}`, {
        autoAlpha: 0,
      })

      olderTL.play()
    } else if (layoutType === "banner") {
      if (currentAnimation.animation) {
        currentAnimation.animation.kill();
        if (currentAnimation.type === 'older') {
          if (cardIndex > accroDeputes.length - 1) {
            setDeputeCurrentCard(0);
          } else if (cardIndex < 0) {
            setDeputeCurrentCard(accroDeputes.length - 1)
          } else {
            setDeputeCurrentCard(cardIndex)
          }
          return
        }
      }
      const olderTL = olderBannerAnimation(setCurrentAnimation)
      // After timeline
      olderTL.call(() => {
        if (cardIndex > accroDeputes.length - 1) {
          setDeputeCurrentCard(0);
        } else if (cardIndex < 0) {
          setDeputeCurrentCard(accroDeputes.length - 1)
        } else {
          setDeputeCurrentCard(cardIndex)
        }
      }, [], '+=0.2')
  
      // olderTL.set(`.${deputeBannerStyles.deputeBanner}`, {
      //   autoAlpha: 0
      // })

      olderTL.play()
    }
  }

  return (
    <div className="accropolis__page">
      <div className={styles.accropolis__container}>
        { layoutType === 'card' ?
          <DeputeCard
            numberOfQuestions={accroDeputes.length}
            depute={accroDeputes[deputeCurrentCard].Depute}
            index={deputeCurrentCard}
            currentAnimation={currentAnimation}
            setCurrentAnimation={setCurrentAnimation}
          />
        : layoutType === 'banner' ?
          <DeputeBanner
            numberOfQuestions={accroDeputes.length}
            depute={accroDeputes[deputeCurrentCard].Depute}
            index={deputeCurrentCard}
            currentAnimation={currentAnimation}
            setCurrentAnimation={setCurrentAnimation}
            mapOpacity={mapOpacity}
            setMapOpacity={setMapOpacity}
          />
        : null }
      </div>
      <div className={styles.accropolis__controls}>
        <button className={styles.controls__prev} onClick={(e) => cycleDeputeCard(e, deputeCurrentCard - 1)}>
          <div className="icon-wrapper">
            <IconChevron />
          </div>
        </button>
        <button className={styles.controls__next} onClick={(e) => cycleDeputeCard(e, deputeCurrentCard + 1)}>
          <div className="icon-wrapper">
            <IconChevron />
          </div>
        </button>
        <br />
        <div className={styles.accropolis__navigation}>
          {accroDeputes.map((depute, index) => {
            depute = depute.Depute
            return (
              <button
                className={`${styles.navigation__btn} ${index === deputeCurrentCard ? styles.navigation__active : ""}`}
                key={`btn-accropolis-nav-${index}`}
                onClick={(e) => {
                  cycleDeputeCard(e, index)
                }}
                style={{
                  backgroundColor: depute.GroupeParlementaire.Couleur,
                }}
              >
                <p className={styles.navigation__number}>{index + 1}</p>
                <p className={styles.navigation__name}>
                  {depute.Nom.replace(
                    // Replace hyphens by non-line-breaking hyphen
                    "-",
                    String.fromCharCode(8209)
                  )}
                </p>
              </button>
            )
          })}
        </div>
        <button onClick={() => setOverview(!overview)}>Changer la vue</button>
      </div>
    </div>
  )
}
