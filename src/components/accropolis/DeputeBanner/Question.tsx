import React, { useEffect } from 'react'
import styles from "./Question.module.scss"
import { gsap } from "gsap"

function Question({question, visible}) {
  // Animations
  /*----------------------------------------------------*/
  useEffect(() => {
    if (visible) {
      gsap.to(
        `.${styles.question__inner}`,
        {
          x: "0%",
          delay: 1,
        }
      )
    } else {
      gsap.to(
        `.${styles.question__inner}`,
        {
          x: "-100%",
        }
      )
    }
  }, [visible])

  // Render
  /*----------------------------------------------------*/
  return (
    <div className={styles.question}>
      <div className={styles.question__inner}>{question}</div>
    </div>
  )
}

export default Question
