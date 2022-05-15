import React, { useEffect, useRef, useState, useCallback } from "react"
import debounce from "lodash/debounce"
import IconSearch from "images/ui-kit/icon-loupe.svg"
import IconClose from "images/ui-kit/icon-close.svg"
import IconChevron from "images/ui-kit/icon-chevron.svg"
import Tooltip from "components/tooltip/Tooltip"
import LoadingSpinner from "components/spinners/loading-spinner/LoadingSpinner"

interface IGeocoder {
  token: string
  handleClick: (args: AugoraMap.Coordinates) => any
  isCollapsed?: boolean
}

async function fetchMapboxAPI(search, token): Promise<AugoraMap.MapboxAPIFeatureCollection> {
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${search}.json?language=fr&limit=10&proximity=2.2137,46.2276&access_token=${token}`
  )
  const data: AugoraMap.MapboxAPIFeatureCollection = await response.json()

  return data
}

/** A partir d'une string avec au moins une virgule, renvoie ["ce qui est avant la première virgule", "ce qui est après la première virgule"], si pas de virgule, renvoie ["string", ""] */
const splitAddress = (address: string): [string, string] => {
  const title = address.match(/^.*?(?=\,)/) // recupère tout ce qui est avant la première virgule
  const description = address.match(/(?<=\,\s).*$/) // recupère tout ce qui est après la première virgule

  return [title ? title[0] : address, description ? description[0] : ""]
}

/**
 * Renvoie le champ de recherche d'adresse, aka "geocoder"
 * @param {string} token Token mapbox, obligatoire pour la requete API
 * @param {(args: AugoraMap.Coordinates) => any} handleClick Callback à la selection d'un résultat de recherche
 * @param {boolean} [isCollapsed] Si le geocoder doit etre ouvert ou fermé initialement, default true
 */
export default function Geocoder(props: IGeocoder) {
  const { isCollapsed = false } = props

  const [value, setValue] = useState<string>("")
  const [isExpanded, setIsExpanded] = useState(!isCollapsed)
  const [results, setResults] = useState<AugoraMap.MapboxAPIFeature[]>(null)
  const [resultsVisible, setResultsVisible] = useState(false)
  const [choice, setChoice] = useState<AugoraMap.MapboxAPIFeature>(null)
  const [cursor, setCursor] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)

  const searchField = useRef<HTMLInputElement>()
  const node = useRef<HTMLDivElement>()

  useEffect(() => {
    document.addEventListener("mousedown", clickOutside)
    return () => {
      document.removeEventListener("mousedown", clickOutside)
    }
  }, [])

  const clickOutside = (e) => {
    if (node?.current) {
      if (!node.current.contains(e.target)) {
        setResultsVisible(false)
        setCursor(0)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (results && results.length > 0) {
      if (e.key === "ArrowUp" && cursor > 0) {
        e.preventDefault()
        setCursor(cursor - 1)
      } else if (e.key === "ArrowDown" && cursor < results.length - 1) setCursor(cursor + 1)
    }
  }

  const handleSearch = debounce((search: string) => {
    fetchMapboxAPI(search, props.token).then(
      (result) => {
        setResults(result.features.filter((feat) => feat.relevance === 1))
        setResultsVisible(true)
        setIsLoading(false)
      },
      () => console.error("Erreur de la requête à l'API mapbox")
    )
  }, 500)

  const handleTextInput = useCallback((input?: string) => {
    if (input && input.length > 0) {
      setValue(input)
      handleSearch(input)
      setIsLoading(true)
    } else clearForm()
  }, [])

  const clearForm = () => {
    setChoice(null)
    setValue("")
    setResults(null)
    setResultsVisible(false)
    setCursor(0)
    handleSearch.cancel()
    props.handleClick(null)
  }

  const handleSubmit = (feature: AugoraMap.MapboxAPIFeature) => {
    setChoice(feature)
    setValue(feature.place_name)
    setResults(null)
    setResultsVisible(false)
    setCursor(0)
    setIsExpanded(false)
    props.handleClick(feature.center)
  }

  const handleExpand = (val: boolean) => {
    if (val) {
      setIsExpanded(true)
      searchField.current.focus()
    } else {
      setIsExpanded(false)
      setResultsVisible(false)
    }
  }

  const handleFocus = () => {
    if (results) {
      setIsLoading(true)
      setTimeout(() => {
        setResultsVisible(true)
        setIsLoading(false)
      }, 400)
    }
  }

  return (
    <>
      <div
        className={`geocoder__overlay ${isExpanded ? "geocoder__overlay--visible" : ""}`}
        onClick={() => handleExpand(false)}
      />
      <div className={`map__geocoder ${isExpanded ? "map__geocoder--visible" : ""}`} ref={node}>
        <button
          className="geocoder__expand"
          type="button"
          title={isExpanded ? "Femer la recherche" : "Ouvrir la recherche"}
          onClick={() => handleExpand(!isExpanded)}
        >
          <div className="expand__icon icon-wrapper">
            <IconSearch />
          </div>
          <div className="expand__arrow icon-wrapper">
            <IconChevron />
          </div>
        </button>
        <form
          className={"geocoder__form"}
          onSubmit={(e) => {
            e.preventDefault()
            if (results?.length > 0) handleSubmit(results[cursor])
          }}
        >
          <input
            className="form__input"
            ref={searchField}
            type="text"
            placeholder="Trouver une circonscription..."
            value={value}
            onChange={(e) => handleTextInput(e.target.value)}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
          />
          <div className={`form__clear ${value.length > 0 ? "form__clear--visible" : ""}`}>
            {!isLoading ? (
              <>
                <input className="form__clear-btn" type="reset" value="" title="Effacer" onClick={() => clearForm()} />
                <div className="icon-wrapper">
                  <IconClose />
                </div>
              </>
            ) : (
              <LoadingSpinner />
            )}
          </div>
        </form>
        {resultsVisible && results && (
          <Tooltip className="geocoder__results">
            {results.length > 0 ? (
              <ul className="results__list">
                {results.map((feature, index) => (
                  <li
                    key={`${feature.text}-${feature.center[0]}-${feature.center[1]}`}
                    className={`results__item ${cursor === index ? "results__item--selected" : ""}`}
                  >
                    <a className="results__link" onClick={() => handleSubmit(feature)} onMouseOver={() => setCursor(index)}>
                      <div className="link__title">{splitAddress(feature.place_name)[0]}</div>
                      <div className="link__description">{splitAddress(feature.place_name)[1]}</div>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="results__link results__notfound">Aucun résultat trouvé</div>
            )}
          </Tooltip>
        )}
        <div className={`geocoder__dot icon-wrapper ${choice ? "geocoder__dot--visible" : ""}`}>
          <svg xmlns="http://www.w3.org/2000/svg">
            <circle cx="6" cy="6" r="3" fill="red" />
          </svg>
        </div>
      </div>
    </>
  )
}
