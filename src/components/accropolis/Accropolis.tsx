import React, { useEffect, useState } from "react"
import DeputyImage from "components/deputy/general-information/deputy-image/DeputyImage"

import { gsap } from "gsap"

import styles from './accropolis.module.scss'

export default function Accropolis(props) {
  const [deputes, setDeputes] = useState(props.deputes.data.DeputesEnMandat.data);
  const [deputeCards, setDeputeCards] = useState([])
  const [deputeCurrentCard, setDeputeCurrentCard] = useState(null);

  useEffect(() => {
    setDeputes(deputes.filter(depute => {
      return props.listed_deputes.some(d => {
        // console.log(d.Depute_name)
        return d.Depute_name === depute.Slug
      })
    }))
  }, [props.listed_deputes])

  useEffect(()=> {
    setDeputeCards(deputes.map(depute => {
      return (
        <div className={styles.accropolis__depute} key={`accropolis-mini-${depute.Slug}`}>
          <div className={styles.accropolis__background} style={{ backgroundColor: depute.GroupeParlementaire.Couleur }}>
            {/* Silen is golden */}
          </div>
          <div className={styles.accropolis__image}>
            <DeputyImage src={depute.URLPhotoAugora} alt={`Photographie de ${depute.Nom}`} sex={depute.Sexe} />
          </div>
          <div className={styles.accropolis__text}>
            <h2 className={styles.accropolis__name}>{depute.Nom}</h2>
            <p className={styles.accropolis__group}>
              {depute.GroupeParlementaire.NomComplet}
            </p>
          </div>
          {/* <div className={styles.accropolis__map}>
            <div className={styles.accropolis__geography}>
              {depute.NomRegion}<br/>
              {depute.NomDepartement} ({depute.NumeroDepartement})
            </div>
          </div> */}
        </div>
      )
    }))
  }, [deputes])

  useEffect(() => {
    setDeputeCurrentCard(0);
  }, [deputeCards])

  useEffect(() => {
    const newerTL = gsap.timeline()
    newerTL.set(`.${styles.accropolis__depute}`, {
      // x: "-100%",
      autoAlpha: 0,
    })
    newerTL.set(`.${styles.accropolis__background}`, {
      width: "0%",
      autoAlpha: 0,
    })
    newerTL.set(`.${styles.accropolis__group}`, {
      // x: "-20%",
      autoAlpha: 0,
    })
    newerTL.set(`.${styles.accropolis__name}`, {
      // x: "-20%",
      autoAlpha: 0,
    })
    newerTL.set(`.${styles.accropolis__image}`, {
      // x: "-50%",
      autoAlpha: 0,
    })
    newerTL.set(`.${styles.accropolis__container}`, {
      autoAlpha: 1
    })

    newerTL.fromTo(`.${styles.accropolis__depute}`, {
        // x: "-20%",
        autoAlpha: 0,
      }, {
        // x: "0",
        autoAlpha: 1,
        ease: "power1.out",
        duration: 0.8,
      }
    )
    newerTL.fromTo(`.${styles.accropolis__background}`, {
        width: "calc(0% + 10px)",
        autoAlpha: 0,
      }, {
        width: "100%",
        autoAlpha: 1,
        ease: "power1.out",
        duration: 0.8,
      }, '-=0.7'
    )
    newerTL.fromTo(`.${styles.accropolis__name}`, {
        x: "-20%",
        autoAlpha: 0,
      }, {
        x: "0%",
        autoAlpha: 1,
        ease: "power1.out",
        duration: 0.8,
      }, '-=0.2'
    )
    newerTL.fromTo(`.${styles.accropolis__group}`, {
        autoAlpha: 0,
      }, {
        autoAlpha: 1,
        ease: "power1.out",
        duration: 1,
      }, '-=0.5'
    )
    newerTL.fromTo( `.${styles.accropolis__image}`, {
        x: "-50%",
        autoAlpha: 0,
      }, {
        x: "0%",
        autoAlpha: 1,
        ease: "power1.inOut",
        duration: 0.4,
      }, '0'
    )
  }, [deputeCurrentCard])

  const cycleDeputeCard = cardIndex => {
    // Timeline
    const olderTL = gsap.timeline()
    olderTL.fromTo(`.${styles.accropolis__image}`, {
        x: "0",
        autoAlpha: 1,
      }, {
        x: "-150%",
        autoAlpha: 0,
        ease: "power1.in",
        duration: 0.5,
      }
    )
    olderTL.fromTo(`.${styles.accropolis__name}`, {
        x: "0%",
        autoAlpha: 1,
      }, {
        x: "-120px",
        autoAlpha: 0,
        ease: "power1.in",
        duration: 0.5,
      }, '-=0.5'
    )
    olderTL.fromTo(`.${styles.accropolis__group}`, {
        x: "0%",
        autoAlpha: 1,
      }, {
        x: "-120px",
        autoAlpha: 0,
        ease: "power1.in",
        duration: 0.5,
      }, '-=0.4'
    )
    olderTL.fromTo(`.${styles.accropolis__background}`, {
        width: "100%",
        autoAlpha: 1,
      }, {
        width: "0%",
        autoAlpha: 0,
        ease: "power1.in",
        duration: 1,
      }, '-=0.5'
    )
    // After timeline
    olderTL.call(() => {
      if (cardIndex > deputeCards.length - 1) {
        setDeputeCurrentCard(0);
      } else if (cardIndex < 0) {
        setDeputeCurrentCard(deputeCards.length - 1)
      } else {
        setDeputeCurrentCard(cardIndex)
      }
    }, [], '+=0.5')

    olderTL.set(`.${styles.accropolis__container}`, {
      autoAlpha: 0
    })

    olderTL.play()
  }

  return (
    <>
      <div className={styles.accropolis__container}>
        { deputeCards[deputeCurrentCard] }
      </div>
      <button className="previous" onClick={() => cycleDeputeCard(deputeCurrentCard - 1) }>
        Précédent
      </button>
      <button className="next" onClick={() => cycleDeputeCard(deputeCurrentCard + 1) }>
        Suivant
      </button>
    </>
  )
}