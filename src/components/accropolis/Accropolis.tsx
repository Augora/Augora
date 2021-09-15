import React, { useEffect, useState } from "react"
import DeputeCard from "./DeputeCard"

import { gsap } from "gsap"

import styles from './accropolis.module.scss'

export default function Accropolis({ deputes, listed_deputes }) {
  const [filteredDeputes, setFilteredDeputes] = useState(deputes.data.DeputesEnMandat.data);
  const [deputeCards, setDeputeCards] = useState([])
  const [deputeCurrentCard, setDeputeCurrentCard] = useState(null);

  useEffect(() => {
    setFilteredDeputes(filteredDeputes.filter(depute => {
      return listed_deputes.some(d => {
        return d.Depute_name === depute.Slug
      })
    }))
  }, [listed_deputes])

  useEffect(()=> {
    setDeputeCards(filteredDeputes.map((depute, index) =>
      <DeputeCard numberOfQuestions={filteredDeputes.length} depute={depute} index={index}/>
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
    // Timeline
    const olderTL = gsap.timeline()
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
      },
      {
        x: '-100%',
      }
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
      }, '-=0.4'
    )

    // Background
    olderTL.add('background')
    olderTL.fromTo(`.${styles.accropolis__background}`, {
        width: "100%",
      }, {
        width: "0%",
        ease: "power1.inOut",
        duration: 1,
      }, 'background'
    )
    olderTL.fromTo(`.${styles.accropolis__background2}`, {
        width: "100%",
      }, {
        width: "0%",
        ease: "power1.inOut",
        duration: 1,
      }, 'background+=0.1'
    )
    olderTL.fromTo(`.${styles.accropolis__depute}`, {
        x: 0,
      }, {
        x: -20,
        duration: 1,
      }, '-=0.4'
    )

    // Image
    olderTL.fromTo(`.${styles.accropolis__image}`, {
        width: "110px",
      }, {
        width: "0px",
        ease: "power4.in",
        duration: 1.1,     
      }, 'background-=0.1'
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
      <button className="previous" onClick={() => cycleDeputeCard(deputeCurrentCard - 1) }>
        Précédent
      </button>
      <button className="next" onClick={() => cycleDeputeCard(deputeCurrentCard + 1) }>
        Suivant
      </button>
    </div>
  )
}