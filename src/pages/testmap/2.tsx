import React, { useEffect, useRef, useState } from "react"
import Map, { Layer, MapRef, Source } from "react-map-gl"
import SEO, { PageType } from "components/seo/seo"
import mapStore from "stores/mapStore"
import { useRouter } from "next/router"
import Asie from "static/hors/11.geojson"

export default function MapPage() {
  const router = useRouter()

  const [pageTitle, setPageTitle] = useState<string>("Carte")

  /** Zustand state */
  const { viewsize, viewstate, setViewsize, setViewstate } = mapStore()

  useEffect(() => {
    setViewsize({ height: window.innerHeight, width: window.innerWidth })
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, []) //calcule le vh en js pour contrecarrer le bug des 100vh sur mobile

  const handleResize = (e) => {
    setViewsize({ height: e.target.innerHeight, width: e.target.innerWidth })
  }

  return (
    <>
      <SEO pageType={PageType.Map} title={pageTitle} />
      <div className="page page__map">
        <div className="map__container" style={{ height: viewsize.height - 60 }}>
          <Map
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            mapStyle={`mapbox://styles/augora/ckh3h62oh2nma19qt1fgb0kq7?optimize=true`}
            style={{ width: "100%", height: "100%" }}
            initialViewState={viewstate}
            minZoom={0}
            dragRotate={false}
            doubleClickZoom={false}
            onMove={(e) => setViewstate(e.viewState)}
            onClick={() => router.push("/testmap/1", "/testmap/1", { shallow: true })}
            onLoad={(e) =>
              e.target.flyTo({
                center: [138.25, 36.2],
                zoom: 3,
                easing: (x) => -(Math.cos(Math.PI * x) - 1) / 2,
              })
            }
            reuseMaps={true}
          >
            <Source type="geojson" data={Asie} generateId={true}>
              <Layer id="zone-fill" type="fill" paint={{ "fill-color": "#00bbcc" }} />
            </Source>
          </Map>{" "}
        </div>
      </div>
    </>
  )
}
