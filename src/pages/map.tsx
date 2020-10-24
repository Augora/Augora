import React, { useState } from "react"
import { Helmet } from "react-helmet"
import MapAugora from "components/maps/MapAugora"
import queryString from "query-string"

function convertArrayOfStringToString(arr: string | string[]) {
  if (arr instanceof Array) {
    return arr[0]
  }
  return arr
}

function stringToInt(n: string) {
  const parsedString = parseInt(n)
  if (isNaN(parsedString)) {
    return undefined
  }
  return parsedString
}

export default function MapPage({
  location,
}: {
  location: {
    search: string
    state?: { feature?: AugoraMap.Feature }
  }
}) {
  const [pageTitle, setPageTitle] = useState<string>("Carte")
  const parsedQueryString = queryString.parse(location.search)

  return (
    <>
      <Helmet>
        {process.env.GATSBY_TARGET_ENV !== "production" ? (
          <meta name="robots" content="noindex,nofollow" />
        ) : null}
        <title>{`${pageTitle} | Augora`}</title>
      </Helmet>
      <div className="page page__map">
        <div className="map__container">
          <MapAugora
            codeCont={stringToInt(
              convertArrayOfStringToString(parsedQueryString.codeCont)
            )}
            codeDpt={convertArrayOfStringToString(parsedQueryString.codeDpt)}
            codeReg={convertArrayOfStringToString(parsedQueryString.codeReg)}
            featureToDisplay={location.state?.feature}
            setPageTitle={setPageTitle}
          />
        </div>
      </div>
    </>
  )
}
