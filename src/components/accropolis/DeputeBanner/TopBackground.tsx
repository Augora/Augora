import React, { useEffect, useState } from 'react'
import styles from "./TopBackground.module.scss"
import { gsap } from "gsap"
import _ from "lodash"

function TopBackground({color, visible}) {
  const [actualColor, setActualColor] = useState(color)
  // Animations
  /*----------------------------------------------------*/
  useEffect(() => {
    if (color !== actualColor) {
      setTimeout(() => {
        setActualColor(color)
      }, 1000)
    }
  }, [color])
  useEffect(() => {
    if (visible) {
      gsap.to(`.${styles.top__background}`, {
        scaleX: 1,
        ease: "power1.in",
      })
    } else {
      gsap.to(`.${styles.top__background}`, {
        scaleX: 0,
        ease: "power1.in",
      })
    }
  }, [visible])

  // Render
  /*----------------------------------------------------*/
  return (
    <div
      className={styles.top__background}
      style={{
        // transform: "scaleX(0)",
        backgroundImage: `linear-gradient(80deg, hsl(${actualColor.H}, ${actualColor.S}%, ${_.clamp(actualColor.L + 5, 0, 100)}%) 0%, hsl(${actualColor.H}, ${
          actualColor.S
        }%, ${_.clamp(actualColor.L - 5, 0, 100)}%) 100%)`,
      }}
    >
      {/* Silence is golden... */}
    </div>
  )
}

export default TopBackground
