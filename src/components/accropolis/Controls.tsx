import React from 'react'
import styles from "./ControlsStyles.module.scss"
import IconChevron from "images/ui-kit/icon-chevron.svg"

export default function Controls({question, setQuestion, overview, setOverview, accroDeputes, cycleDeputeCard, deputeCurrentCard}) {
  return (
    <div className={styles.accropolis__controls}>
      <div className="controls__question">
        <h2>Question</h2>
        <textarea value={question} rows={5} onChange={e => {
          if (e.target.value.length < 100)
          setQuestion(e.target.value)
        }}/>
      </div>
      <div className="controls__map">
        <h2>Carte</h2>
        <button className={`${styles.btn}`} onClick={() => setOverview(!overview)}>
          {overview ? 'Zoomer' : 'Dézoomer'}
        </button>
      </div>
      <div className="controls__navigation">
        <h2>Navigation</h2>
        <button className={`${styles.navigation__prev} ${styles.btn}`} onClick={(e) => cycleDeputeCard(e, deputeCurrentCard - 1)}>
          <div className="icon-wrapper">
            <IconChevron />
          </div>
        </button>
        <button className={`${styles.navigation__next} ${styles.btn}`} onClick={(e) => cycleDeputeCard(e, deputeCurrentCard + 1)}>
          <div className="icon-wrapper">
            <IconChevron />
          </div>
        </button>
        {/* <p className={`${styles.navigation__load} ${currentAnimation.type === 'older' ? styles.navigation__loading : ''}`}>
          <span>Chargement du nouveau député</span>
        </p> */}
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
      </div>
    </div>
  )
}
