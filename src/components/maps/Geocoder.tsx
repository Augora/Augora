import React, { useRef, useState } from "react"
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

const splitAddress = (address: string): [string, string] => {
  return [address.match(/^.*?(?=\,)/)[0], address.match(/(?<=\,\s).*$/)[0]]
}

export default function Geocoder(props: IGeocoder) {
  const [value, setValue] = useState<string>("")
  const [results, setResults] = useState<AugoraMap.MapboxAPIFeatureCollection>(null)

  const searchField = useRef<HTMLInputElement>()

  return (
    <div className="map__geocoder">
      <form
        className="geocoder__form"
        onSubmit={(e) => {
          e.preventDefault()
          if (value.length >= 3) {
            fetchMapboxAPI(value, props.token).then(
              (value) => setResults(value),
              () => console.error("Erreur de la requête à l'API mapbox")
            )
          } else console.error("3 caractères ou plus requis")
        }}
      >
        <div className="form__icon icon-wrapper">
          <IconSearch />
        </div>
        <input
          className="form__input"
          ref={searchField}
          type="text"
          placeholder="Lieu"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {value.length > 0 && (
          <div className={`form__clear ${value.length > 0 ? "form__clear--visible" : ""}`}>
            <input
              className="form__clear-btn"
              type="reset"
              value=""
              title="Effacer"
              onClick={() => {
                setValue("")
                setResults(null)
                props.handleClick(null)
              }}
            />
            <div className="icon-wrapper">
              <IconClose />
            </div>
          </div>
        )}
        <button style={{ fontSize: "15px", border: "none", borderRadius: 5 }}>Chercher</button>
      </form>
      {results && results.features.length > 0 && (
        <Tooltip className="geocoder__results">
          {console.log(results)}
          <ul>
            {results.features.map(
              (feature) =>
                feature.relevance === 1 && (
                  <li key={`${feature.text}-${feature.center[0]}-${feature.center[1]}`} className="results__element">
                    <a
                      className="results__link"
                      onClick={() => {
                        setResults(null)
                        props.handleClick(feature.center)
                      }}
                    >
                      <div className="link__title">{splitAddress(feature.place_name)[0]}</div>
                      <div className="link__description">{splitAddress(feature.place_name)[1]}</div>
                    </a>
                  </li>
                )
            )}
          </ul>
        </Tooltip>
      )}
    </div>
  )
}
