import React, { useState } from "react"
import DeputeBanner from "./DeputeBanner"

import _ from "lodash"

import styles from "./AccropolisStyles.module.scss"
// import accropolisStore from "src/stores/accropolisStore"

export default function Accropolis({
    accroDeputes,
    debug,
    question,
    activeDeputeIndex,
    depute
  }) {
  const [currentAnimation, setCurrentAnimation] = useState({
    animation: null,
    type: null,
  })
  const [mapOpacity, setMapOpacity] = useState({value: 0})
  // const {activeDepute} = accropolisStore();

  // Render
  /*----------------------------------------------------*/
  return accroDeputes.length ? (
    <div className={`accropolis__page ${debug ? 'debug' : ''}`}>
      <div className={styles.accropolis__container}>
        <DeputeBanner
          debug={debug}
          numberOfQuestions={accroDeputes.length}
          depute={depute ? depute : accroDeputes[0].Depute}
          // depute={activeDepute ? activeDepute : accroDeputes[deputeCurrentCard].Depute}
          index={activeDeputeIndex !== null ? activeDeputeIndex + 1 : null}
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
