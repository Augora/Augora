import React, { useState } from "react"
import DeputeCard from "./DeputeCard"
import DeputeBanner from "./DeputeBanner"

import _ from "lodash"

import styles from "./AccropolisStyles.module.scss"

export default function Accropolis({
    accroDeputes,
    debug,
    question,
    deputeCurrentCard,
    depute
  }) {
  const [layoutType, setLayoutType] = useState('banner')
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
            debug={debug}
            numberOfQuestions={accroDeputes.length}
            depute={depute ? depute : accroDeputes[deputeCurrentCard].Depute}
            index={deputeCurrentCard}
            currentAnimation={currentAnimation}
            setCurrentAnimation={setCurrentAnimation}
            mapOpacity={mapOpacity}
            setMapOpacity={setMapOpacity}
            question={question}
          />
        : null }
      </div>
    </div>
  ) : (<>Aucun député choisi</>)
}
