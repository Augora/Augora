import React, { useEffect, useState } from "react"
import DeputyImage from "components/deputy/general-information/deputy-image/DeputyImage"
import MapAugora from "components/maps/MapAugora"
import styles from "./DeputeCardStyles.module.scss"
import { gsap } from "gsap"
import mapStore from "stores/mapStore"
import { createFeatureCollection, getFeature, getLayerPaint } from "components/maps/maps-utils"

const mapDelay = 0.5

export default function DeputeCard({ numberOfQuestions, depute, index, currentAnimation, setCurrentAnimation }) {
  const { NumeroCirconscription, NumeroDepartement } = depute
  const feature = getFeature({
    code_circ: NumeroCirconscription,
    code_dpt: NumeroDepartement,
  })
  const { viewport, setViewport } = mapStore()
  // const [duration, setDuration] = useState(0)

  useEffect(() => {
    if (currentAnimation.animation) {
      currentAnimation.animation.kill()
    }
    const renderTL = gsap.timeline({
      onComplete: () => {
        setCurrentAnimation({
          animation: null,
          type: null,
        })
      },
    })
    renderTL.addLabel('renderTL')
    renderTL.call(() => {
      setCurrentAnimation({
        animation: renderTL,
        type: "render",
      })
    })
    renderTL.set(`.${styles.deputeCard__depute}`, {
      autoAlpha: 0,
    })
    renderTL.set(`.${styles.deputeCard__background}`, {
      width: "0%",
      autoAlpha: 0,
    })
    renderTL.set(`.${styles.deputeCard__background}`, {
      width: "0%",
      autoAlpha: 0,
    })
    renderTL.set(`.${styles.deputeCard__group}`, {
      autoAlpha: 0,
    })
    renderTL.set(`.${styles.deputeCard__name}`, {
      autoAlpha: 0,
    })
    renderTL.set(`.${styles.deputeCard__image}`, {
      autoAlpha: 0,
    })
    renderTL.set(`.${styles.deputeCard__question}`, {
      y: "100%",
    })
    renderTL.set(`.${styles.deputeCard__mapinner}`, {
      x: "-100%",
    })
    renderTL.set(`.${styles.deputeCard__geography}`, {
      y: "-100%",
      autoAlpha: 0,
    })

    // Reveal animations
    renderTL.fromTo(
      `.${styles.deputeCard__depute}`,
      {
        autoAlpha: 0,
      },
      {
        autoAlpha: 1,
        ease: "power1.out",
        duration: 0.8,
      }
    )
    renderTL.add("background", "-=0.7")
    renderTL.fromTo(
      `.${styles.deputeCard__background2}`,
      {
        width: "calc(0% + 10px)",
        autoAlpha: 0,
      },
      {
        width: "100%",
        autoAlpha: 1,
        ease: "power1.inOut",
        duration: 0.8,
      },
      "background"
    )
    renderTL.fromTo(
      `.${styles.deputeCard__background}`,
      {
        width: "calc(0% + 10px)",
        autoAlpha: 0,
      },
      {
        width: "100%",
        autoAlpha: 1,
        ease: "power1.inOut",
        duration: 0.75,
      },
      "background+=0.1"
    )
    renderTL.fromTo(
      `.${styles.deputeCard__question}`,
      {
        y: "100%",
        autoAlpha: 0,
      },
      {
        y: "0%",
        autoAlpha: 1,
        ease: "power1.inOut",
        duration: 1,
      }
    )
    renderTL.fromTo(
      `.${styles.deputeCard__name}`,
      {
        x: "-20%",
        autoAlpha: 0,
      },
      {
        x: "0%",
        autoAlpha: 1,
        ease: "power1.out",
        duration: 0.8,
      },
      "-=0.2"
    )
    renderTL.fromTo(
      `.${styles.deputeCard__group}`,
      {
        autoAlpha: 0,
      },
      {
        autoAlpha: 1,
        ease: "power1.out",
        duration: 1,
      },
      "-=0.5"
    )
    renderTL.fromTo(
      `.${styles.deputeCard__image}`,
      {
        x: "-50%",
        autoAlpha: 0,
      },
      {
        x: "0%",
        autoAlpha: 1,
        ease: "power1.inOut",
        duration: 0.4,
      },
      0
    )
    renderTL.fromTo(
      `.${styles.deputeCard__mapinner}`,
      {
        x: "-100%",
      },
      {
        x: "0%",
      },
      `-=${mapDelay}`
    )
    renderTL.fromTo(
      `.${styles.deputeCard__geography}`,
      {
        y: "-100%",
        autoAlpha: 0,
      },
      {
        y: 0,
        autoAlpha: 1,
      }
    )
    renderTL.play()
  }, [index])

  return (
    <div className={styles.deputeCard__inner}>
      <div className={styles.deputeCard__question}>
        Question {index + 1} / {numberOfQuestions}
      </div>
      <div className={styles.deputeCard__depute} key={`accropolis-mini-${depute.Slug}`}>
        <div className={styles.deputeCard__background} style={{ backgroundColor: depute.GroupeParlementaire.Couleur }}>
          {/* Silen is golden */}
        </div>
        <div className={styles.deputeCard__background2}>{/* Silen is golden */}</div>
        <div className={styles.deputeCard__image}>
          <DeputyImage src={depute.URLPhotoAugora} alt={`Photographie de ${depute.Nom}`} sex={depute.Sexe} />
        </div>
        <div className={styles.deputeCard__text}>
          <h2 className={styles.deputeCard__name}>{depute.Nom}</h2>
          <p className={styles.deputeCard__group}>{depute.GroupeParlementaire.NomComplet}</p>
        </div>
        <div className={styles.deputeCard__map}>
          <div className={styles.deputeCard__mapinner}>
            <MapAugora
              overlay={false}
              small={true}
              attribution={false}
              viewport={viewport}
              setViewport={setViewport}
              mapView={{
                geoJSON: createFeatureCollection([feature]),
                feature: feature,
                paint: getLayerPaint(depute.GroupeParlementaire.Couleur),
              }}
            />
          </div>
        </div>
      </div>
      <div className={styles.deputeCard__geography}>
        {depute.NomRegion}
        <br />
        {depute.NomRegion !== depute.NomDepartement ? depute.NomDepartement : null}
      </div>
    </div>
  )
}
