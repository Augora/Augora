import React, { useEffect } from "react"
import { GetStaticPaths, GetStaticProps } from "next"
import MapAugora from "components/maps/MapAugora"
import { useRouter } from "next/router"
import SEO, { PageType } from "components/seo/seo"
import mapStore from "stores/mapStore"
import useDeputiesFilters from "hooks/deputies-filters/useDeputiesFilters"
import {
  buildURLFromFeature,
  Code,
  compareFeatures,
  getFeatureURL,
  getLayerPaint,
  getParentURL,
  getPosition,
  getZoneCode,
  getHistory,
  getZoneTitle,
  getDeputies,
} from "components/maps/maps-utils"
import { getMapFeature, getMapGeoJSON, getMapGhostGeoJSON } from "components/maps/maps-imports"
import { getDeputesMap, getGroupes } from "lib/deputes/Wrapper"
import shuffle from "lodash/shuffle"

interface IMapProps {
  feature: AugoraMap.Feature
  geoJSON: AugoraMap.FeatureCollection
  ghostGeoJSON?: AugoraMap.FeatureCollection
  history: AugoraMap.History
}

export default function MapPage(props: IMapProps) {
  const router = useRouter()

  const {
    state: { FilteredList },
  } = useDeputiesFilters()

  /** Zustand state */
  const { viewsize, viewstate, setViewsize, setViewstate } = mapStore()

  useEffect(() => {
    setViewsize({ height: window.innerHeight, width: window.innerWidth })
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, []) //calcule le vh en js pour contrecarrer le bug des 100vh sur mobile

  const zoneDeputies = getDeputies(props.feature, FilteredList)
  const paint =
    zoneDeputies.length === 1
      ? getLayerPaint(zoneDeputies[0]?.GroupeParlementaire?.Couleur)
      : zoneDeputies.length === 0
      ? getLayerPaint("#808080")
      : getLayerPaint()

  const handleResize = (e) => {
    setViewsize({ height: e.target.innerHeight, width: e.target.innerWidth })
  }

  const changeURL = (URL: string) => {
    router.push(`/carte/${URL}`)
  }

  const changeZone = <T extends GeoJSON.Feature>(feature: T) => {
    const zoneCode = getZoneCode(feature)
    if (!compareFeatures(feature, props.feature)) {
      if (feature) changeURL(getFeatureURL(feature))
      else console.error("Feature à afficher non valide :", feature)
    } else if (zoneCode === Code.Circ) {
      const deputy = zoneDeputies[0]
      if (deputy) router.push(`/depute/${deputy.Slug}`)
    }
  }

  return (
    <>
      <SEO pageType={PageType.Map} title={getZoneTitle(props.feature)} />
      <div className="page page__map">
        <div className="map__container" style={{ height: viewsize.height - 60 }}>
          <MapAugora
            viewstate={viewstate}
            setViewstate={setViewstate}
            deputies={zoneDeputies}
            mapView={{
              geoJSON: props.geoJSON,
              ghostGeoJSON: props.ghostGeoJSON,
              feature: props.feature,
              paint: paint,
            }}
            onZoneClick={changeZone}
            onBack={() => changeURL(getParentURL(props.feature))}
            onBreadcrumbClick={(url) => changeURL(url)}
            history={props.history}
          />
        </div>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params: { zone = null } }: { params: { zone: string[] } }) => {
  const [deputes, groupes] = await Promise.all([getDeputesMap(), getGroupes()])
  const feature = getMapFeature(zone)

  return {
    props: {
      feature: feature,
      geoJSON: getMapGeoJSON(zone),
      ghostGeoJSON: getMapGhostGeoJSON(zone),
      history: getHistory(feature),
      deputes: shuffle(deputes),
      groupes,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const pathsFile = await import("static/zone-routes.json")

  return {
    paths: [
      ...pathsFile.default.map((route) => {
        return {
          params: {
            zone: route,
          },
        }
      }),
    ],
    fallback: false,
  }
}
