import React, { useState } from "react"
import DeputeBanner from "./DeputeBanner"

import _ from "lodash"

import styles from "./AccropolisStyles.module.scss"

export default function Accropolis({
    accroDeputes,
    debug,
    question,
    deputeCurrentCard,
    activeDeputeIndex,
    depute
  }) {
  const [currentAnimation, setCurrentAnimation] = useState({
    animation: null,
    type: null,
  })
  const [mapOpacity, setMapOpacity] = useState({value: 0})


  // Render
  /*----------------------------------------------------*/
  return accroDeputes.length ? (
    <div className={`accropolis__page ${debug ? 'debug' : ''}`}>
      <div className={styles.accropolis__container}>
        <DeputeBanner
          debug={debug}
          numberOfQuestions={accroDeputes.length}
          depute={depute ? depute : accroDeputes[deputeCurrentCard].Depute}
          index={activeDeputeIndex}
          currentAnimation={currentAnimation}
          setCurrentAnimation={setCurrentAnimation}
          mapOpacity={mapOpacity}
          setMapOpacity={setMapOpacity}
          question={question}
        />
      </div>
    </div>
  ) : (<>Aucun député choisi</>)
}
