import React, { useState, useEffect, useCallback } from "react"
import styles from "./ControlsStyles.module.scss"
import { slugify } from "utils/utils"
import debounce from "lodash/debounce"
import mapStore from "src/stores/mapStore"

export default function Controls({
  socket,
  question,
  setQuestion,
  deputes,
  cycleBannerContent,
  activeDepute,
  currentAnimation,
  setCurrentAnimation,
  olderBannerAnimation,
  government,
  bannerState,
  setBannerState
}) {
  const [deputeSearch, setDeputeSearch] = useState("")
  const [governmentSearch, setGovernmentSearch] = useState("")
  const [searchedDeputes, setSearchedDeputes] = useState([])
  const [searchedGovernments, setSearchedGovernments] = useState([])
  const { overview, setOverview } = mapStore()

  // Search
  /*----------------------------------------------------*/
  useEffect(() => {
    if (deputeSearch.length > 0) {
      verifyDepute(deputeSearch, deputes)
    } else {
      setSearchedDeputes([])
    }
  }, [deputeSearch])
  useEffect(() => {
    if (governmentSearch.length > 0) {
      verifyGovernment(governmentSearch, government)
    } else {
      setSearchedGovernments([])
    }
  }, [governmentSearch])

  const verifyDepute = useCallback(
    debounce((value, data) => {
      const filteredResults = data.filter((people) => {
        return (
          slugify(people.NomDeFamille).includes(slugify(value)) ||
          slugify(people.Prenom).includes(slugify(value)) ||
          slugify(people.Nom).includes(slugify(value))
        )
      })
      setSearchedDeputes(filteredResults)
    }, 500),
    []
  )

  const verifyGovernment = useCallback(
    debounce((value, data) => {
      const filteredResults = data.filter((people) => {
        const fullname = slugify(people.firstname) + ' ' + slugify(people.lastname)
        return (
          slugify(people.firstname).includes(slugify(value)) ||
          slugify(people.lastname).includes(slugify(value)) ||
          slugify(fullname).includes(slugify(value))
        )
      })
      setSearchedGovernments(filteredResults)
    }, 500),
    []
  )

  const loadSearchedResult = (event, people) => {
    event.preventDefault()
    if (currentAnimation.animation) {
      currentAnimation.animation.kill()
      if (currentAnimation.type === "older") {
        cycleBannerContent(event, people)
      }
    }

    // After timeline
    const olderTL = olderBannerAnimation(setCurrentAnimation)
    olderTL.call(
      () => {
        cycleBannerContent(event, people)
        setDeputeSearch("")
        setGovernmentSearch("")
      },
      [],
      "+=0.2"
    )
    olderTL.play()
  }

  // Render
  /*----------------------------------------------------*/
  return (
    <div className={styles.accropolis__controls}>
      <div className={`${styles.controls__block} ${styles.controls__selected}`}>
        {activeDepute ? (
          <p className={`${styles.navigation__activeDepute}`}>
            Député/Membre du gouvernement sélectionné : <span style={{ color: activeDepute.newSource_GroupeParlementaire.Couleur }}>{activeDepute.Nom}</span>
          </p>
        ) : <p>Aucun député sélectionné</p>}
      </div>
      <div className={`${styles.controls__block} ${styles.controls__introutro}`}>
        <button className={`${styles.controls__intro}`} onClick={() => socket.emit('bannerState', 'intro')}>
          Intro
        </button>
        <button className={`${styles.controls__outro}`} onClick={() => socket.emit('bannerState', 'outro')}>
          Outro
        </button>
      </div>
      <div className={`${styles.controls__block} ${styles.controls__navigation}`}>
        <h2>Députés</h2>
        <div className={`${styles.controls__form}`}>
          <div className={`${styles.navigation__search}`}>
            <input
              className={`${styles.navigation__searchField}`}
              type="text"
              value={deputeSearch}
              onChange={(e) => setDeputeSearch(e.target.value)}
            />
            {searchedDeputes.length ? (
              <div className={`${styles.navigation__searchResults}`}>
                {searchedDeputes.map((depute) => (
                  <button
                    className={`${styles.search__depute}`}
                    style={{ backgroundColor: depute.GroupeParlementaire.Couleur }}
                    onClick={(e) => loadSearchedResult(e, Object.assign({}, depute, { type: 'dep' }))}
                    key={`search-depute-${depute.Slug}`}
                  >
                    {depute.Nom}
                  </button>
                ))}
              </div>
            ) : deputeSearch.length && !searchedDeputes.length ? (
              <div className={`${styles.navigation__searchResults}`}>
                Aucun résultat
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className={`${styles.controls__block} ${styles.controls__question}`}>
        <h2>Question</h2>
        <textarea
          value={question}
          rows={5}
          onChange={(e) => {
            if (e.target.value.length < 100) {
              setQuestion(e.target.value)
              socket.emit('question', e.target.value)
            }
          }}
        />
      </div>
      <div className={`${styles.controls__block} ${styles.controls__government}`}>
        <h2>Gouvernement</h2>
        <div className={`${styles.controls__form}`}>
          <div className={`${styles.navigation__search}`}>
            <input
              className={`${styles.navigation__searchField}`}
              type="text"
              value={governmentSearch}
              onChange={(e) => setGovernmentSearch(e.target.value)}
            />
            {searchedGovernments.length ? (
              <div className={`${styles.navigation__searchResults}`}>
                {searchedGovernments.map((gov) => (
                  <button
                    className={`${styles.search__depute}`}
                    style={{ backgroundColor: "rgb(58, 156, 217)" }}
                    onClick={(e) => loadSearchedResult(e, {
                      type: 'gov',
                      GroupeParlementaire: {
                        Couleur: "hsl(203, 68%, 54%)",
                        CouleurDetail: {
                          HSL: {
                            Full: "hsl(203, 68%, 54%)",
                            H: 203,
                            S: 68,
                            L: 54,
                          },
                          RGB: {
                            Full: "rgb(58, 156, 217)",
                            R: 58,
                            G: 156,
                            B: 217,
                          },
                        },
                        Sigle: "LREM",
                      },
                      Nom: `${gov.firstname} ${gov.lastname}`,
                      NomDeFamille: gov.lastname,
                      NomRegion: "France",
                      Prenom: gov.firstname,
                      Slug: "gouvernement",
                      Office: gov.main_office,
                      RattOffice: gov.ratt_offices
                    })}
                    key={`search-government-${slugify(gov.firstname.toLowerCase())} ${slugify(gov.lastname.toLowerCase())}`}
                  >
                    {gov.firstname} {gov.lastname}
                  </button>
                ))}
              </div>
            ) : governmentSearch.length && !searchedGovernments.length ? (
              <div className={`${styles.navigation__searchResults}`}>
                Aucun résultat
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className={`${styles.controls__block} ${styles.controls__map}`}>
        <h2>Carte</h2>
        <button className={`${styles.btn}`} onClick={() => socket.emit('overview', !overview)}>
          {overview ? "Zoomer" : "Dézoomer"}
        </button>
      </div>
    </div>
  )
}