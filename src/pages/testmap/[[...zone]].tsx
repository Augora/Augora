import React, { useEffect, useState } from "react"
import { GetStaticPaths, GetStaticProps } from "next"
import MapAugora from "components/maps/MapAugora"
import { useRouter } from "next/router"
import SEO, { PageType } from "components/seo/seo"
import mapStore from "stores/mapStore"
import useDeputiesFilters from "hooks/deputies-filters/useDeputiesFilters"
import { buildURLFromFeature, Code, compareFeatures, createFeatureCollection, getZoneCode } from "components/maps/maps-utils"
import { getMapFeature, getMapGeoJSON } from "components/maps/maps-imports"

interface IMapProps {
  feature: AugoraMap.Feature
  geoJSON: AugoraMap.FeatureCollection
  ghostGeoJSON?: AugoraMap.FeatureCollection
}

export default function MapPage(props: IMapProps) {
  const router = useRouter()

  const {
    state: { FilteredList },
  } = useDeputiesFilters()

  const [pageTitle, setPageTitle] = useState<string>("Carte")

  /** Zustand state */
  const {
    viewsize,
    viewstate,
    geoJSON,
    ghostGeoJSON,
    feature: zoneFeature,
    deputies,
    paint,
    setViewsize,
    setViewstate,
    setMapView,
    setDeputies,
  } = mapStore()

  // useEffect(() => {
  //   const ready = !/\?./.test(router.asPath) || Object.keys(router.query).length > 0 //test si on a bien les valeurs finales de la query
  //   if (!ready) return

  //   const newFeature = getFeatureFromQuery(router.query)

  //   if (newFeature) displayZone(newFeature)
  //   else if (zoneFeature.properties.nom === "Empty") changeZone(MetroFeature)
  //   else {
  //     setPageTitle(getZoneTitle(zoneFeature))
  //     changeURL(buildURLFromFeature(zoneFeature))
  //   }
  // }, [router])

  useEffect(() => {
    setViewsize({ height: window.innerHeight, width: window.innerWidth })
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, []) //calcule le vh en js pour contrecarrer le bug des 100vh sur mobile

  // useNonInitialEffect(() => {
  //   displayZone(zoneFeature) //refresh les overlays si la liste des deputés change
  // }, [FilteredList])

  const handleResize = (e) => {
    setViewsize({ height: e.target.innerHeight, width: e.target.innerWidth })
  }

  const changeURL = (URL: string) => {
    router.push(URL, URL, { shallow: true })
  }

  /**
   * Fonction principale de changement de zone. Determine la prochaine route à prendre selon l'état de la map et la feature fournie
   * @param {GeoJSON.Feature} feature La feature de la nouvelle zone
   */
  const changeZone = <T extends GeoJSON.Feature>(feature: T) => {
    const zoneCode = getZoneCode(feature)
    if (!compareFeatures(feature, zoneFeature)) {
      if (feature) changeURL(buildURLFromFeature(feature))
      else console.error("Feature à afficher non valide :", feature)
    } else if (zoneCode === Code.Circ) {
      const deputy = deputies[0]
      if (deputy) changeURL(`/depute/${deputy.Slug}`)
    }
  }

  // /**
  //  * Affiche une nouvelle vue et transitionne, sans changer l'url, ne pas utiliser directement
  //  * @param {AugoraMap.Feature} feature La feature de la zone à afficher
  //  */
  // const displayZone = (feature: AugoraMap.Feature) => {
  //   if (feature) {
  //     const zoneDeputies = getDeputies(feature, FilteredList)
  //     setDeputies(zoneDeputies)

  //     if (getZoneCode(feature) === Code.Circ) {
  //       const groupColor = zoneDeputies[0]?.GroupeParlementaire?.Couleur

  //       setMapView({
  //         geoJSON: createFeatureCollection([feature]),
  //         feature: feature,
  //         paint: groupColor ? getLayerPaint(groupColor) : getLayerPaint("#808080"),
  //       })
  //     } else {
  //       setMapView({
  //         geoJSON: getChildFeatures(feature),
  //         ghostGeoJSON: getGhostZones(feature),
  //         feature: feature,
  //         paint: getLayerPaint(),
  //       })
  //     }
  //     setPageTitle(getZoneTitle(feature))
  //   } else {
  //     console.warn("Zone à afficher non trouvée. Redirection vers France Métropolitaine")
  //     changeZone(MetroFeature)
  //   }
  // }

  return (
    <>
      <SEO pageType={PageType.Map} title={pageTitle} />
      <div className="page page__map">
        <div className="map__container" style={{ height: viewsize.height - 60 }}>
          <MapAugora
            viewstate={viewstate}
            setViewstate={setViewstate}
            deputies={FilteredList}
            mapView={{
              geoJSON: props.geoJSON,
              ghostGeoJSON: ghostGeoJSON,
              feature: props.feature,
              paint: paint,
            }}
            // onZoneClick={changeZone}
          />
        </div>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params: { zone = null } }: { params: { zone: string[] } }) => {
  return {
    props: {
      feature: getMapFeature(zone),
      geoJSON: getMapGeoJSON(zone),
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const pathsFile = await import("static/zone-routes.json")

  return {
    paths: [
      { params: { zone: [] } },
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

/*map/
├─ france
├─ monde
├─ france/
|  ├─ occitanie
|  ├─ ile-de-france
│  ├─ occitanie/
|  |  ├─ pyrenees-orientales
|  |  ├─ pyrenees-orientales/
|  |  |  ├─ 1
|  |  |  ├─ 2
│  ├─ ile-de-france/
|  |  ├─ paris
|  |  ├─ paris/
|  |  |  ├─ 1
|  |  |  ├─ 2
|  |  |  ├─ 3
|  |  |  ├─ 4
|  |  |  ├─ 5
├─ om/
|  ├─ guadeloupe
|  ├─ martinique
│  ├─ guadeloupe/
│  |  ├─ 1
│  |  ├─ 2
│  |  ├─ 3
│  |  ├─ 4
│  ├─ martinique/
│  |  ├─ 1
│  |  ├─ 2
├─ monde/
│   ├─ 1
│   ├─ 2
│   ├─ 3
│   ├─ 4*/