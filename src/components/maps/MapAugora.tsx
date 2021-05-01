import React, { useState, useEffect, useRef } from "react"
import { isMobile } from "react-device-detect"
import router from "next/router"
import isEmpty from "lodash/isEmpty"
import mapStore from "src/stores/mapStore"
import InteractiveMap, { NavigationControl, FullscreenControl, GeolocateControl, Source, Layer, LayerProps } from "react-map-gl"
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
  deputies?: Deputy.DeputiesList
  /** Callback auquel un string "nom de zone" sera passé */
  setPageTitle?(title: string): void
  /** Callback pour si la map doit utiliser l'URL */
  changeURL?(URL: string): void
  /** Object contenant les codes de zone */
  codes?: AugoraMap.Codes
  /** Si les overlays doivent être affichés */
  overlay?: boolean
  /** S'il faut forcer un recentrage de la map au chargement */
  forceCenter?: boolean
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
  const { overlay = true, deputies = [], forceCenter = false } = props

  /** Zustand state */
  const {
    viewport,
    geoJSON,
    ghostGeoJSON,
    feature: zoneFeature,
    deputies: zoneDeputies,
    paint,
    codes,
    setViewport,
    setMapView,
    setCodes,
  } = mapStore()

  /** useStates */
  const [hover, setHover] = useState<mapboxgl.MapboxGeoJSONFeature>(null)
  const [inExploreMode, setInExploreMode] = useState(false)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  /** useEffects */
  useEffect(() => {
    if (isMapLoaded) {
      if (!compareCodes(props.codes, codes)) {
        displayZone(getFeature(props.codes))
        setCodes(props.codes)
      } else if (isEmpty(codes)) {
        changeZone(MetroFeature)
      } else if (props.changeURL || props.setPageTitle) {
        if (props.changeURL) props.changeURL(buildURLFromCodes(codes))
        if (props.setPageTitle) props.setPageTitle(getZoneTitle(zoneFeature))
      }
    }
  }, [props.codes[Code.Cont], props.codes[Code.Reg], props.codes[Code.Dpt], props.codes[Code.Circ], isMapLoaded]) //s'execute lorsque les codes changent et quand la map est chargée

  useEffect(() => {
    displayZone(zoneFeature, true) //refresh les overlays si la liste des deputés change
  }, [deputies])

  /** useRefs */
  const mapRef = useRef<mapboxgl.Map>()

  /** Transitionne le viewport sur une feature */
  const flyToFeature = <T extends GeoJSON.Feature>(feature: T) => {
    flyToBounds(feature, viewport, setViewport, isMobile ? 20 : 80)
  }

  /**
   * Fonction principale de changement de zone. Determine la prochaine route à prendre selon l'état de la map et la feature fournie
   * @param {GeoJSON.Feature} feature La feature de la nouvelle zone
   */
  const changeZone = <T extends GeoJSON.Feature>(feature: T) => {
    const zoneCode = getZoneCode(feature)
    if (!compareFeatures(feature, zoneFeature)) {
      if (feature) props.changeURL(buildURLFromCodes(getCodesFromFeature(feature)))
      else console.error("Feature à afficher non valide")
    } else if (zoneCode === Code.Circ) {
      const deputy = zoneDeputies[0]
      if (deputy) props.changeURL(`/depute/${deputy.Slug}`)
    } else flyToFeature(feature)
  }

  /**
   * Affiche une nouvelle vue et transitionne, sans changer l'url, ne pas utiliser directement
   * @param {AugoraMap.Feature} feature La feature de la zone à afficher
   */
  const displayZone = (feature: AugoraMap.Feature, noFly?: boolean) => {
    if (feature) {
      const zoneDeputies = getDeputies(feature, deputies)

      if (getZoneCode(feature) === Code.Circ) {
        const groupColor = zoneDeputies[0]?.GroupeParlementaire?.Couleur

        setMapView({
          geoJSON: createFeatureCollection([feature]),
          feature: feature,
          deputies: zoneDeputies,
          paint: groupColor ? getLayerPaint(groupColor) : getLayerPaint("#808080"),
        })
      } else {
        setMapView({
          geoJSON: getChildFeatures(feature),
          ghostGeoJSON: getGhostZones(feature),
          feature: feature,
          deputies: zoneDeputies,
          paint: getLayerPaint(),
        })
      }
      if (props.setPageTitle) {
        if (feature.properties.nom) props.setPageTitle(feature.properties.nom)
        else props.setPageTitle(`${feature.properties.nom_dpt} ${feature.properties[Code.Circ]}`)
      }
      if (!noFly) flyToFeature(feature)
      renderHover()
    } else console.error("Zone à afficher non trouvée")
  }

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
      if (feature) changeZone(feature)
    } else if (e.rightButton) handleBack()
  }

  const handleBack = () => {
    changeZone(getParentFeature(zoneFeature))
  }

  const handleResize = () => {
    if (isMapLoaded) {
      flyToFeature(zoneFeature)
    } else {
      setIsMapLoaded(true)
      if (forceCenter) flyToFeature(zoneFeature)
    }
  }

  return (
    <InteractiveMap
      mapboxApiAccessToken="pk.eyJ1IjoiYXVnb3JhIiwiYSI6ImNraDNoMXVwdjA2aDgyeG55MjN0cWhvdWkifQ.pNUguYV6VedR4PY0urld8w"
      mapStyle="mapbox://styles/augora/ckh3h62oh2nma19qt1fgb0kq7?optimize=true"
      ref={(ref) => (mapRef.current = ref && ref.getMap())}
      {...viewport}
      width="100%"
      height="100%"
      minZoom={1}
      dragRotate={false}
      doubleClickZoom={false}
      touchRotate={false}
      interactiveLayerIds={isMapLoaded && !inExploreMode ? (ghostGeoJSON ? ["zone-fill", "zone-ghost-fill"] : ["zone-fill"]) : []}
      onResize={handleResize}
      onViewportChange={setViewport}
      onClick={handleClick}
      onHover={handleHover}
      onMouseOut={() => renderHover()}
      reuseMaps={true}
    >
      {isMapLoaded && (
        <>
          <Source type="geojson" data={geoJSON} generateId={true}>
            <Layer {...lineLayerProps} paint={paint.line} />
            <Layer {...fillLayerProps} paint={paint.fill} layout={inExploreMode ? { visibility: "none" } : {}} />
          </Source>
          {ghostGeoJSON && (
            <Source type="geojson" data={ghostGeoJSON} generateId={true}>
              <Layer {...lineGhostLayerProps} />
              <Layer {...fillGhostLayerProps} layout={inExploreMode ? { visibility: "none" } : {}} />
            </Source>
          )}
          {overlay && (
            <>
              {!inExploreMode && (
                <MapPins
                  features={geoJSON.features}
                  ghostFeatures={ghostGeoJSON?.features}
                  hoveredFeature={hover}
                  deputies={deputies}
                  handleClick={changeZone}
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
                  <MapBreadcrumb feature={zoneFeature} handleClick={changeZone} />
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
