import React, { useRef, useState } from "react"

interface IGeocoder {
  token: string
  handleClick: (args: AugoraMap.Coordinates) => any
}

interface MapboxAPIFeature extends GeoJSON.Feature {
  center: AugoraMap.Coordinates
  place_name: string
  text: string
  context: {
    id: string
    wikidata: string
    text: string
    short_code?: string
  }[]
}

interface MapboxAPIFeatureCollection extends GeoJSON.FeatureCollection {
  attribution: string
  query: string[]
  features: MapboxAPIFeature[]
}

async function fetchMapboxAPI(search, token): Promise<MapboxAPIFeatureCollection> {
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${search}.json?language=fr&limit=10&proximity=2.2137,46.2276&access_token=${token}`
  )
  const data: MapboxAPIFeatureCollection = await response.json()

  return data
}

export default function Geocoder(props: IGeocoder) {
  const [value, setValue] = useState<string>("")
  const [results, setResults] = useState<MapboxAPIFeatureCollection>(null)

  const searchField = useRef<HTMLInputElement>()

  return (
    <form
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
      <input ref={searchField} type="text" placeholder="Lieu" value={value} onChange={(e) => setValue(e.target.value)} />
      <button>Search</button>
      {results && results.features.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {results.features.map((feature) => (
            <button
              key={`${feature.text}-${feature.center[0]}-${feature.center[1]}`}
              onClick={() => {
                setResults(null)
                setValue("")
                props.handleClick(feature.center)
              }}
            >
              {feature.place_name}
            </button>
          ))}
        </div>
      )}
    </form>
  )
}
