import React, { useState, useEffect, useCallback } from 'react'
import styles from "./ControlsStyles.module.scss"
import IconChevron from "images/ui-kit/icon-chevron.svg"
import { slugify } from "utils/utils"
import debounce from "lodash/debounce"
// import { getDeputeAccropolis } from "lib/deputes/Wrapper"

export default function Controls({
    question,
    setQuestion,
    overview,
    setOverview,
    accroDeputes,
    deputes,
    cycleDeputeCard,
    activeDepute,
    setActiveDepute,
    activeDeputeIndex,
    setActiveDeputeIndex,
    currentAnimation,
    setCurrentAnimation,
    olderBannerAnimation
  }) {
  
  const [search, setSearch] = useState('')
  const [searchedDeputes, setSearchedDeputes] = useState([])

  useEffect(() => {
    if (search.length > 0) {
      verify(search)
    } else {
      setSearchedDeputes([])
    }
  }, [search])

  const verify = useCallback(
    debounce(value => {
      const filteredDeputes = deputes.DeputesEnMandat.data.filter(depute => {
        return slugify(depute.NomDeFamille).includes(slugify(value)) || slugify(depute.Prenom).includes(slugify(value)) || slugify(depute.Nom).includes(slugify(value))
      })
      setSearchedDeputes(filteredDeputes)
    }, 500),
    []
  );

  const handleSearch = (event, depute) => {
    event.preventDefault()
    if (currentAnimation.animation) {
      currentAnimation.animation.kill();
      if (currentAnimation.type === 'older') {
        setActiveDepute(depute)
      }
    }

    // After timeline
    const olderTL = olderBannerAnimation(setCurrentAnimation)
    olderTL.call(() => {
      setQuestion('')
      setActiveDepute(depute)
      setSearch('')
    }, [], '+=0.2')
    olderTL.play()
  }

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
        <div className={`${styles.controls__form}`}>
          <button className={`${styles.navigation__prev} ${styles.btn}`} onClick={() => {
              setActiveDeputeIndex(activeDeputeIndex - 1)
              cycleDeputeCard(null, activeDepute)
            }}>
            <div className="icon-wrapper">
              <IconChevron />
            </div>
          </button>
          <button className={`${styles.navigation__next} ${styles.btn}`} onClick={() => {
              setActiveDeputeIndex(activeDeputeIndex + 1)
              cycleDeputeCard(null, activeDepute)
            }}>
            <div className="icon-wrapper">
              <IconChevron />
            </div>
          </button>
          <div className={`${styles.navigation__search}`}>
            <input className={`${styles.navigation__searchField}`} type="text" value={search} onChange={e => setSearch(e.target.value)}/>
            {searchedDeputes.length ? (
              <div className={`${styles.navigation__searchResults}`}>
                {searchedDeputes.map(d => (
                  <button
                    className={`${styles.search__depute}`}
                    style={{ backgroundColor: d.GroupeParlementaire.Couleur }}
                    onClick={e => handleSearch(e, d)}
                    key={`search-depute-${d.Slug}`}
                  >
                    { d.Nom }
                  </button>
                ))}
              </div>
            ) : null }
            {activeDepute ? (
              <p className={`${styles.navigation__activeDepute}`}>
                Député sélectionné : <span style={{ color: activeDepute.GroupeParlementaire.Couleur }}>{ activeDepute.Nom }</span>
              </p>
            ) : null}
          </div>
        </div>
        <div className={styles.accropolis__navigation}>
          {accroDeputes.map((depute, index) => {
            depute = depute.Depute
            return (
              <button
                className={`${styles.navigation__btn} ${depute.Slug === activeDepute.Slug ? styles.navigation__active : ""}`}
                key={`btn-accropolis-nav-${index}`}
                onClick={(e) => {
                  cycleDeputeCard(e, depute)
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