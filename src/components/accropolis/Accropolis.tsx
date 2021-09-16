import React, { useEffect, useState } from "react"
import DeputeCard from "./DeputeCard"
import IconChevron from "images/ui-kit/icon-chevron.svg"

import { gsap } from "gsap"
import _ from 'lodash';

import styles from './accropolis.module.scss'

export default function Accropolis({ deputes, listed_deputes }) {
  const [filteredDeputes, setFilteredDeputes] = useState(deputes.data.DeputesEnMandat.data);
  const [deputeCards, setDeputeCards] = useState([])
  const [deputeCurrentCard, setDeputeCurrentCard] = useState(null);
  const [currentAnimation, setCurrentAnimation] = useState({
    animation: null,
    type: null,
  })

  useEffect(() => {
    setFilteredDeputes(listed_deputes.map(depute => {
      return filteredDeputes.find(d => {
        return d.Slug === depute.Depute_name
      })
    }))
  }, [])

  useEffect(()=> {
    setDeputeCards(filteredDeputes.map((depute, index) =>
      <DeputeCard
        numberOfQuestions={filteredDeputes.length}
        depute={depute}
        index={index}
        currentAnimation={currentAnimation}
        setCurrentAnimation={setCurrentAnimation}
      />
    ))
  }, [filteredDeputes])

  useEffect(() => {
    setDeputeCurrentCard(0);
  }, [deputeCards])

  useEffect(() => {
    const newerTL = gsap.timeline()
    newerTL.set(`.${styles.accropolis__inner}`, {
      autoAlpha: 1
    })
    newerTL.play();
  }, [deputeCurrentCard])

  const cycleDeputeCard = cardIndex => {
    if (currentAnimation.animation) {
      currentAnimation.animation.kill();
      if (currentAnimation.type === 'older') {
        if (cardIndex > deputeCards.length - 1) {
          setDeputeCurrentCard(0);
        } else if (cardIndex < 0) {
          setDeputeCurrentCard(deputeCards.length - 1)
        } else {
          setDeputeCurrentCard(cardIndex)
        }
        return
      }
    }
    // Timeline
    const olderTL = gsap.timeline({
      onComplete: () => {
        setCurrentAnimation({
          animation: null,
          type: null
        })
      }
    })
    olderTL.call(() => {
      setCurrentAnimation({
        animation: olderTL,
        type: 'older'}
      )
    })
    olderTL.fromTo(`.${styles.accropolis__geography}`, {
        y: 0,
        autoAlpha: 1,
      },
      {
        y: '-100%',
        autoAlpha: 0,
      }
    )
    olderTL.fromTo(`.${styles.accropolis__mapinner}`, {
        x: '0%',
        autoAlpha: 1,
      },
      {
        x: '-100%',
        autoAlpha: 0,
        duration: 0.3,
      }
    )
    olderTL.fromTo(`.${styles.accropolis__background}`, {
        width: "100%",
      }, {
        width: "0%",
        ease: "power1.inOut",
        duration: 1,
      }, '-=0.5'
    )
    olderTL.fromTo(`.${styles.accropolis__background2}`, {
        width: "100%",
      }, {
        width: "0%",
        ease: "power1.inOut",
        duration: 1,
      }, '-=0.9'
    )
    olderTL.fromTo(`.${styles.accropolis__question}`, {
        y: '0%',
        autoAlpha: 1,
      }, {
        y: '100%',
        autoAlpha: 0,
        ease: "power1.inOut",
        duration: 0.5,
      }, 0
    )
    olderTL.fromTo(`.${styles.accropolis__name}`, {
        x: "0%",
        autoAlpha: 1,
      }, {
        x: "-120px",
        autoAlpha: 0,
        ease: "power1.in",
        duration: 0.5,
      }, 0
    )
    olderTL.fromTo(`.${styles.accropolis__group}`, {
        x: "0%",
        autoAlpha: 1,
      }, {
        x: "-120px",
        autoAlpha: 0,
        ease: "power1.in",
        duration: 0.5,
      }, '-=1'
    )
    olderTL.fromTo(`.${styles.accropolis__depute}`, {
        x: 0,
      }, {
        x: -20,
        duration: 1,
      }, '-=0.4'
    )
    olderTL.fromTo(`.${styles.accropolis__image}`, {
        width: "110px",
      }, {
        width: "0px",
        ease: "power4.in",
        duration: 1.1,     
      }, '-=1.5'
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

    olderTL.set(`.${styles.accropolis__inner}`, {
      autoAlpha: 0
    })

    olderTL.play()
  }

  return (
    <div className="accropolis__page">
      <div className={styles.accropolis__container}>
        { deputeCards[deputeCurrentCard] }
      </div>
      <div className={styles.accropolis__controls}>
        <button className={styles.controls__prev} onClick={() => cycleDeputeCard(deputeCurrentCard - 1) }>
          <div className="icon-wrapper">
            <IconChevron />
          </div>
        </button>
        <button className={styles.controls__next} onClick={() => cycleDeputeCard(deputeCurrentCard + 1) }>
          <div className="icon-wrapper">
            <IconChevron />
          </div>
        </button>
        <br/>
        <div
          className={styles.accropolis__navigation}
        >
          {deputeCards.map((depute, index) => {
            if (index === deputeCurrentCard) {
              console.log(deputeCurrentCard)
            }
            return (
              <button
                className={`${styles.navigation__btn} ${index === deputeCurrentCard ? styles.navigation__active : ''}`}
                key={`btn-accropolis-nav-${index}`}
                onClick={() => { cycleDeputeCard(index) }}
                style={{
                  backgroundColor: depute.props.depute.GroupeParlementaire.Couleur
                }}
              >
                <p className={styles.navigation__number}>{ index + 1 }</p>
                <p className={styles.navigation__name}>
                  {depute.props.depute.Nom.replace('-', String.fromCharCode(8209))}
                </p>
              </button>
            )
          }
        )}
        </div>
      </div>
    </div>
  )
}