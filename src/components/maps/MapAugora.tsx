import React, { useState, useEffect, useRef } from "react"
import { isMobile } from "react-device-detect"
import isEmpty from "lodash/isEmpty"
import mapStore from "src/stores/mapStore"
import InteractiveMap, {
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
  Source,
  Layer,
  LayerProps,
  ViewportProps,
} from "react-map-gl"
import {
  Code,
  MetroFeature,
  flyToBounds,
  getChildFeatures,
  getZoneCode,
  getMouseEventFeature,
  getFeature,
  getGhostZones,
  getDeputies,
  getParentFeature,
  compareFeatures,
  createFeatureCollection,
  getLayerPaint,
  buildURLFromCodes,
  compareCodes,
  getCodesFromFeature,
  getZoneTitle,
} from "components/maps/maps-utils"
import MapBreadcrumb from "components/maps/MapBreadcrumb"
import MapInput from "components/maps/MapInput"
import MapPins from "components/maps/MapPins"
import MapFilters from "components/maps/MapFilters"
import IconInfo from "images/ui-kit/icon-info.svg"
import "mapbox-gl/dist/mapbox-gl.css"

interface IMapAugora {
  /** Liste de députés que la map va fouiller. Hint: on peut passer une array avec un seul député pour par exemple une circonscription */
  allDeputies?: Deputy.DeputiesList
  zoneDeputies?: Deputy.DeputiesList
  // /** Callback auquel un string "nom de zone" sera passé */
  // setPageTitle?(title: string): void
  // /** Callback pour si la map doit utiliser l'URL */
  // changeURL?(URL: string): void
  // /** Object contenant les codes de zone */
  // codes?: AugoraMap.Codes
  /** Si les overlays doivent être affichés */
  overlay?: boolean
  /** S'il faut forcer un recentrage de la map au chargement */
  forceCenter?: boolean
  mapView: AugoraMap.MapView
  changeZone?<T extends GeoJSON.Feature>(feature: T): void
  viewport: ViewportProps
  setViewport(newViewport: ViewportProps): void
}

const fillLayerProps: LayerProps = {
  id: "zone-fill",
  type: "fill",
  paint: getLayerPaint().fill,
}

const lineLayerProps: LayerProps = {
  id: "zone-line",
  type: "line",
  paint: getLayerPaint().line,
}

const fillGhostLayerProps: LayerProps = {
  id: "zone-ghost-fill",
  type: "fill",
  paint: getLayerPaint(null, true).fill,
}

const lineGhostLayerProps: LayerProps = {
  id: "zone-ghost-line",
  type: "line",
  paint: {
    ...getLayerPaint().line,
    // "line-dasharray": [2, 2],
    "line-opacity": 0.2,
  },
}

/**
 * Renvoie la map augora, reçoit un code d'affichage, 2 (Dpt, Circ) s'il s'agit d'une circonscription. Si plusieurs sont fournis, ils seront pris en compte dans l'ordre circonscription > département > région > continent
 * @param {Deputy.DeputiesList} [deputies] Liste des députés à afficher sur la map
 * @param {Function} [setPageTitle] setState callback pour changer le titre de la page
 * @param {AugoraMap.MapCodes} [codes] Code(s) de la zone à afficher
 * @param {boolean} [overlay] S'il faut afficher les overlay ou pas, default true
 * @param {boolean} [forceCenter] S'il faut recentrer la map au chargement, default false
 */
export default function MapAugora(props: IMapAugora) {
  /** Default props */
  const { overlay = true, allDeputies = [], zoneDeputies = [], forceCenter = false, mapView, changeZone } = props

  // /** Zustand state */
  // const {
  //   viewport,
  //   geoJSON,
  //   ghostGeoJSON,
  //   feature: zoneFeature,
  //   deputies: zoneDeputies,
  //   paint,
  //   codes,
  //   setViewport,
  //   setMapView,
  //   setDeputies,
  //   setCodes,
  // } = mapStore()

  /** useStates */
  const [hover, setHover] = useState<mapboxgl.MapboxGeoJSONFeature>(null)
  const [inExploreMode, setInExploreMode] = useState(false)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  /** useEffects */
  // useEffect(() => {
  //   if (isMapLoaded) {
  //     flyToFeature(mapView.feature)
  //   }
  // }, [isMapLoaded]) //s'execute lorsque la map est chargée

  // useEffect(() => {
  //   displayZone(mapView.feature, true) //refresh les overlays si la liste des deputés change
  // }, [deputies])

  /** useRefs */
  const mapRef = useRef<mapboxgl.Map>()

  /** Transitionne le viewport sur une feature */
  const flyToFeature = <T extends GeoJSON.Feature>(feature: T) => {
    flyToBounds(feature, props.viewport, props.setViewport, isMobile ? 20 : 80)
  }

  const goToZone = <T extends GeoJSON.Feature>(feature: T) => {
    const zoneCode = getZoneCode(feature)
    if (feature) {
      if (!compareFeatures(feature, mapView.feature)) {
        if (changeZone) changeZone(feature)
        renderHover()
        flyToFeature(feature)
      } else if (zoneCode === Code.Circ) {
        if (changeZone) changeZone(feature)
      } else flyToFeature(feature)
    }
  }

  // /**
  //  * Fonction principale de changement de zone. Determine la prochaine route à prendre selon l'état de la map et la feature fournie
  //  * @param {GeoJSON.Feature} feature La feature de la nouvelle zone
  //  */
  // const changeZone = <T extends GeoJSON.Feature>(feature: T) => {
  //   const zoneCode = getZoneCode(feature)
  //   if (!compareFeatures(feature, zoneFeature)) {
  //     if (feature) props.changeURL(buildURLFromCodes(getCodesFromFeature(feature)))
  //     else console.error("Feature à afficher non valide :", feature)
  //   } else if (zoneCode === Code.Circ) {
  //     const deputy = zoneDeputies[0]
  //     if (deputy) props.changeURL(`/depute/${deputy.Slug}`)
  //   } else flyToFeature(feature)
  // }

  // /**
  //  * Affiche une nouvelle vue et transitionne, sans changer l'url, ne pas utiliser directement
  //  * @param {AugoraMap.Feature} feature La feature de la zone à afficher
  //  */
  // const displayZone = (feature: AugoraMap.Feature, noFly?: boolean) => {
  //   if (feature) {
  //     const zoneDeputies = getDeputies(feature, deputies)
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
  //     if (props.setPageTitle) props.setPageTitle(getZoneTitle(feature))
  //     if (!noFly) flyToFeature(feature)
  //     renderHover()
  //   } else {
  //     console.warn("Zone à afficher non trouvée. Redirection vers France Métropolitaine")
  //     changeZone(MetroFeature)
  //   }
  // }

  /**
   * Renvoie la feature mapbox actuellement affichée correspondant à la feature fournie, undefined si elle n'est pas rendered
   * @param {AugoraMap.Feature} feature
   */
  const getRenderedFeature = (feature: AugoraMap.Feature): mapboxgl.MapboxGeoJSONFeature => {
    const zoneCode = getZoneCode(feature)

    return mapRef.current.queryRenderedFeatures(null, { layers: ["zone-fill"] }).find((feat) => {
      return zoneCode !== Code.Circ
        ? feat.properties[zoneCode] === feature.properties[zoneCode]
        : feat.properties[zoneCode] === feature.properties[zoneCode] && feat.properties[Code.Dpt] === feature.properties[Code.Dpt]
    })
  }

  /**
   * Active le hover de la feature si elle est actuellement affichée sur la map
   * @param {AugoraMap.Feature} feature
   */
  const simulateHover = (feature: AugoraMap.Feature) => {
    if (!compareFeatures(hover, feature)) {
      const renderedFeature = getRenderedFeature(feature)
      renderHover(renderedFeature)
    }
  }

  /**
   * Crée un effet de hover sur la rendered feature mapbox fournie
   * @param {mapboxgl.MapboxGeoJSONFeature} [renderedFeature] Si ce paramètre est manquant ou incorrect, la fonction reset le hover
   */
  const renderHover = (renderedFeature?: mapboxgl.MapboxGeoJSONFeature) => {
    if (hover && !compareFeatures(hover, renderedFeature)) {
      mapRef.current.setFeatureState({ source: hover.source, id: hover.id }, { hover: false })
      setHover(null)
    }
    if (renderedFeature) {
      mapRef.current.setFeatureState({ source: renderedFeature.source, id: renderedFeature.id }, { hover: true })
      setHover(renderedFeature)
    }
  }

  const handleHover = (e) => {
    if (isMapLoaded && !inExploreMode && e.target.className !== "pins__btn") {
      if (e.features && e.target.className === "overlays") {
        renderHover(e.features[0])
      } else renderHover()
    }
  }

  const handleClick = (e) => {
    if (e.leftButton) {
      const feature = getMouseEventFeature(e)
      if (feature) goToZone(feature)
    } else if (e.rightButton) handleBack()
  }

  const handleBack = () => {
    goToZone(getParentFeature(mapView.feature))
  }

  const handleResize = () => {
    if (isMapLoaded) flyToFeature(mapView.feature)
  }

  const handleLoad = () => {
    if (!isMapLoaded) {
      setIsMapLoaded(true)
      if (forceCenter) flyToFeature(mapView.feature)
    }
  }

  return (
    <InteractiveMap
      mapboxApiAccessToken="pk.eyJ1IjoiYXVnb3JhIiwiYSI6ImNraDNoMXVwdjA2aDgyeG55MjN0cWhvdWkifQ.pNUguYV6VedR4PY0urld8w"
      mapStyle="mapbox://styles/augora/ckh3h62oh2nma19qt1fgb0kq7?optimize=true"
      ref={(ref) => (mapRef.current = ref && ref.getMap())}
      {...props.viewport}
      width="100%"
      height="100%"
      minZoom={1}
      dragRotate={false}
      doubleClickZoom={false}
      touchRotate={false}
      interactiveLayerIds={
        isMapLoaded && !inExploreMode ? (mapView.ghostGeoJSON ? ["zone-fill", "zone-ghost-fill"] : ["zone-fill"]) : []
      }
      onResize={handleResize}
      onLoad={handleLoad}
      onViewportChange={props.setViewport}
      onClick={handleClick}
      onHover={handleHover}
      onMouseOut={() => renderHover()}
      reuseMaps={true}
    >
      {isMapLoaded && (
        <>
          <Source type="geojson" data={mapView.geoJSON} generateId={true}>
            <Layer {...lineLayerProps} paint={mapView.paint.line} />
            {!inExploreMode && <Layer {...fillLayerProps} paint={mapView.paint.fill} />}
          </Source>
          {mapView.ghostGeoJSON && (
            <Source type="geojson" data={mapView.ghostGeoJSON} generateId={true}>
              <Layer {...lineGhostLayerProps} />
              {!inExploreMode && <Layer {...fillGhostLayerProps} />}
            </Source>
          )}
          {overlay && (
            <>
              {!inExploreMode && (
                <MapPins
                  features={mapView.geoJSON.features}
                  ghostFeatures={mapView.ghostGeoJSON?.features}
                  hoveredFeature={hover}
                  deputies={allDeputies}
                  handleClick={goToZone}
                  handleHover={simulateHover}
                />
              )}
              <div className="map__navigation">
                <div className="navigation__right">
                  <NavigationControl
                    showCompass={false}
                    zoomInLabel="Zoomer"
                    zoomOutLabel="Dézoomer"
                    style={{ position: "relative" }}
                  />
                  <FullscreenControl label="Plein écran" style={{ position: "relative" }} />
                  <GeolocateControl label="Me Géolocaliser" style={{ position: "relative" }} />
                  <MapInput
                    className="navigation__explorer"
                    type="checkbox"
                    title={`${inExploreMode ? "Activer" : "Désactiver"} l'affichage des informations`}
                    checked={inExploreMode}
                    onChange={() => setInExploreMode(!inExploreMode)}
                  >
                    <IconInfo style={inExploreMode ? { fill: "white" } : {}} />
                  </MapInput>
                </div>
                <div className="navigation__left">
                  <MapBreadcrumb feature={mapView.feature} handleClick={goToZone} />
                </div>
                <div className="navigation__bottom">
                  <MapFilters zoneDeputies={zoneDeputies} />
                </div>
              </div>
            </>
          )}
        </>
      )}
    </InteractiveMap>
  )
}
