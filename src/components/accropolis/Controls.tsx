import React, { useState, useEffect, useCallback } from "react"
import styles from "./ControlsStyles.module.scss"
import { slugify } from "utils/utils"
import debounce from "lodash/debounce"
import mapStore from "src/stores/mapStore"
import supabaseClient from "lib/supabase/client"

export default function Controls({
  // socket,
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
  setBannerState,
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
        return slugify(people.Nom).includes(slugify(value))
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
            Député/Membre du gouvernement sélectionné :{" "}
            <span style={{ color: activeDepute.GroupeParlementaire.Couleur }}>{activeDepute.Nom}</span>
          </p>
        ) : (
          <p>Aucun député sélectionné</p>
        )}
      </div>
      {/* <div className={`${styles.controls__block} ${styles.controls__introutro}`}>
        <button className={`${styles.controls__intro}`} onClick={() => setBannerState("intro")}>
          Intro
        </button>
        <button className={`${styles.controls__outro}`} onClick={() => setBannerState("outro")}>
          Outro
        </button>
      </div> */}
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
                    onClick={(e) => loadSearchedResult(e, Object.assign({}, depute, { type: "dep" }))}
                    key={`search-depute-${depute.Slug}`}
                  >
                    {depute.Nom}
                  </button>
                ))}
              </div>
            ) : deputeSearch.length && !searchedDeputes.length ? (
              <div className={`${styles.navigation__searchResults}`}>Aucun résultat</div>
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
              supabaseClient
                .from("Session")
                .update({ Question: e.target.value })
                .match({ id: "1234" })
                .then((r) => console.log("Question sent", { r }))
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
                    onClick={(e) =>
                      loadSearchedResult(e, {
                        type: "gov",
                        GroupeParlementaire: deputes.filter((d) => {
                          return d.GroupeParlementaire.Sigle === "REN"
                        })[0].GroupeParlementaire,
                        Nom: gov.Nom,
                        NomDeFamille: gov.Nom,
                        NomRegion: "France",
                        Prenom: gov.Nom,
                        Slug: gov.Slug,
                        Office: gov.Fonction,
                        RattOffice: gov.Charge,
                      })
                    }
                    key={`search-government-${slugify(gov.Nom.toLowerCase())}`}
                  >
                    {gov.Nom}
                  </button>
                ))}
              </div>
            ) : governmentSearch.length && !searchedGovernments.length ? (
              <div className={`${styles.navigation__searchResults}`}>Aucun résultat</div>
            ) : null}
          </div>
        </div>
      </div>
      <div className={`${styles.controls__block} ${styles.controls__map}`}>
        <h2>Carte</h2>
        <button className={`${styles.btn}`} onClick={(f) => f /*socket.emit("overview", !overview)*/}>
          {overview ? "Zoomer" : "Dézoomer"}
        </button>
      </div>
    </div>
  )
}
