import React, { useEffect, useRef, useState, useCallback } from "react"
import debounce from "lodash/debounce"
import IconSearch from "images/ui-kit/icon-loupe.svg"
import IconClose from "images/ui-kit/icon-close.svg"
import Tooltip from "components/tooltip/Tooltip"

interface IGeocoder {
  token: string
  handleClick: (args: AugoraMap.Coordinates) => any
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

export default function Geocoder(props: IGeocoder) {
  const [value, setValue] = useState<string>("")
  const [isExpanded, setIsExpanded] = useState(true)
  const [results, setResults] = useState<AugoraMap.MapboxAPIFeature[]>(null)
  const [resultsVisible, setResultsVisible] = useState(false)
  const [cursor, setCursor] = useState<number>(0)

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
      },
      () => console.error("Erreur de la requête à l'API mapbox")
    )
  }, 500)

  const handleTextInput = useCallback((input?: string) => {
    if (input && input.length > 0) {
      setValue(input)
      handleSearch(input)
    } else clearForm()
  }, [])

  const clearForm = () => {
    setValue("")
    setResults(null)
    setResultsVisible(false)
    setCursor(0)
    handleSearch.cancel()
    props.handleClick(null)
  }

  const handleSubmit = (feature: AugoraMap.MapboxAPIFeature) => {
    setValue(feature.place_name)
    setResults(null)
    setResultsVisible(false)
    setCursor(0)
    props.handleClick(feature.center)
  }

  const handleExpand = () => {
    if (isExpanded) {
      setIsExpanded(!isExpanded)
      clearForm()
    } else setIsExpanded(true)
  }

  return (
    <div className="map__geocoder" ref={node}>
      <button
        className="geocoder__expand"
        title={isExpanded ? "Femer la recherche" : "Ouvrir la recherche"}
        onClick={handleExpand}
      >
        <div className="expand__icon icon-wrapper">
          <IconSearch />
        </div>
      </button>
      <form
        className={`geocoder__form ${isExpanded ? "geocoder__form--visible" : ""}`}
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
          onFocus={() => results && setResultsVisible(true)}
          onKeyDown={handleKeyDown}
        />
        <div className={`form__clear ${value.length > 0 ? "form__clear--visible" : ""}`}>
          <input className="form__clear-btn" type="reset" value="" title="Effacer" onClick={() => clearForm()} />
          <div className="icon-wrapper">
            <IconClose />
          </div>
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
    </div>
  )
}
