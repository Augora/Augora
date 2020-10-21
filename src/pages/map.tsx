import React, { useState } from "react"
import { Helmet } from "react-helmet"
import "mapbox-gl/dist/mapbox-gl.css"
import { FranceZoneFeature } from "components/maps/maps-utils"
import MapAugora from "components/maps/MapAugora"

export default function MapPage({
  location,
}: {
  location: { state?: { feature?: FranceZoneFeature } }
}) {
  const [pageTitle, setPageTitle] = useState<string>("Carte")

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
            featureToDisplay={location.state?.feature}
            setPageTitle={setPageTitle}
          />
        </div>
      </div>
    </>
  )
}
