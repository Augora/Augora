import React, { useState, useRef, useEffect } from "react"
import { isMobile } from "react-device-detect"
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
  flyToBounds,
  getZoneCode,
  getMouseEventFeature,
  getParentFeature,
  compareFeatures,
  getLayerPaint,
  getDeputies,
  flyToCoords,
  getContinent,
  Cont,
} from "components/maps/maps-utils"
import MapBreadcrumb from "components/maps/MapBreadcrumb"
import MapPins from "components/maps/MapPins"
import MapPin from "components/maps/MapPin"
import MapFilters from "components/maps/MapFilters"
import "mapbox-gl/dist/mapbox-gl.css"

interface IMapAugora {
  /** Objet view contenant les données d'affichage */
  mapView: AugoraMap.MapView
  /** Viewport state object */
  viewport: ViewportProps
  /** Viewport setstate function */
  setViewport(newViewport: ViewportProps): void
  /** Callback quand une zone de la map est cliquée */
  onZoneClick?<T extends GeoJSON.Feature>(feature: T): void
  /** Le mode de vue sur les zones, par défaut zoomé */
  overview?: boolean
  /** Liste de députés que la map va fouiller. Inutile si on désactive les overlay */
  deputies?: Deputy.DeputiesList
  /** Si les overlays doivent être affichés */
  overlay?: boolean
  /** Délai optionel de la fonction flytobounds */
  delay?: number
  /** S'il faut afficher les infos légales mapbox en bas à droite (légalement obligatoire) */
  attribution?: boolean
  /** S'il faut afficher les frontières */
  borders?: boolean
  children?: React.ReactNode
}

const fillLayerProps: LayerProps = {
  id: "zone-fill",
  type: "fill",
  beforeId: "road-label",
  paint: getLayerPaint().fill,
}

const lineLayerProps: LayerProps = {
  id: "zone-line",
  type: "line",
  beforeId: "road-label",
  paint: getLayerPaint().line,
}

const fillGhostLayerProps: LayerProps = {
  id: "zone-ghost-fill",
  type: "fill",
  beforeId: "road-label",
  paint: getLayerPaint(null, true).fill,
}

const lineGhostLayerProps: LayerProps = {
  id: "zone-ghost-line",
  type: "line",
  beforeId: "road-label",
  paint: {
    ...getLayerPaint().line,
    "line-opacity": 0.2,
  },
}

/**
 * Renvoie la map augora, il lui faut impérativement des données d'affichage, un viewport, et un setViewport, le reste est optionnel
 * @param {AugoraMap.MapView} mapView Object contenant les données d'affichage : geoJSON (zones affichées), feature (zone parente), ghostGeoJSON (zones voisines), paint (comment les zones sont dessinées)
 * @param {Function} [onZoneClick] Callback au click d'une zone, fournie la feature cliquée en paramètre
 * @param {Deputy.DeputiesList} [deputies] Liste des députés à afficher sur la map, inutile si les overlays sont désactivés
 * @param {boolean} [overlay] S'il faut afficher les overlay ou pas, default true
 * @param {boolean} [small] S'il faut afficher une map plus petite, default false
 * @param {boolean} [attribution] Si on veut afficher le logo MapBox, default true
 * @param {number} [delay] Si on veut retarder l'effet de zoom, default 0
 */
export default function MapAugora(props: IMapAugora) {
  /** Default props */
  const {
    mapView: { geoJSON, ghostGeoJSON, feature: zoneFeature, paint },
    overlay = true,
    deputies = [],
    overview = false,
    attribution = true,
    delay = 0,
    borders = false,
  } = props

  /** useStates */
  const [hover, setHover] = useState<mapboxgl.MapboxGeoJSONFeature>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  /** useEffects */
  useEffect(() => {
    if (isMapLoaded) {
      if (!overview) flyToFeature(zoneFeature)
      else flyToPin(zoneFeature)
    }
  }, [zoneFeature, overview, isMapLoaded])

  /** useRefs */
  const mapRef = useRef<mapboxgl.Map>()

  /** Transitionne le viewport sur une feature */
  const flyToFeature = <T extends GeoJSON.Feature>(feature: T) => {
    const padding = isMobile ? 20 : Math.min(props.viewport.width, props.viewport.height) / 20 + 15

    setTimeout(() => {
      flyToBounds(feature, props.viewport, props.setViewport, padding)
    }, delay)
  }

  /** Transitionne le viewport sur un pin en mode overview */
  const flyToPin = <T extends GeoJSON.Feature>(feature: T) => {
    const contId = getContinent(feature)
    const code = getZoneCode(feature)
    const zoom = contId === Cont.World ? -1 : contId === Cont.OM ? 2 : code !== Code.Cont ? 3.5 : 0

    flyToCoords(zoneFeature.properties.center, props.viewport, props.setViewport, zoom)
  }

  /** Change la zone affichée et transitionne */
  const goToZone = <T extends GeoJSON.Feature>(feature: T) => {
    const zoneCode = getZoneCode(feature)
    if (feature) {
      if (!compareFeatures(feature, zoneFeature)) {
        if (props.onZoneClick) props.onZoneClick(feature)
        renderHover()
      } else if (zoneCode === Code.Circ) {
        if (props.onZoneClick) props.onZoneClick(feature)
      } else flyToFeature(feature)
    }
  }

  /** Renvoie la feature mapbox actuellement affichée correspondant à la feature fournie, undefined si elle n'est pas rendered */
  const getRenderedFeature = (feature: AugoraMap.Feature): mapboxgl.MapboxGeoJSONFeature => {
    const zoneCode = getZoneCode(feature)

    return mapRef.current.queryRenderedFeatures(null, { layers: ["zone-fill"] }).find((feat) => {
      return zoneCode !== Code.Circ
        ? feat.properties[zoneCode] === feature.properties[zoneCode]
        : feat.properties[zoneCode] === feature.properties[zoneCode] && feat.properties[Code.Dpt] === feature.properties[Code.Dpt]
    })
  }

  /** Active le hover de la feature si elle est actuellement affichée sur la map */
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
    if (isMapLoaded && e.target.className !== "pins__btn") {
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
    goToZone(getParentFeature(zoneFeature))
  }

  const handleResize = () => {
    if (isMapLoaded) flyToFeature(zoneFeature)
  }

  const handleLoad = () => {
    if (!isMapLoaded) setIsMapLoaded(true)
  }

  return (
    <InteractiveMap
      mapboxApiAccessToken="pk.eyJ1IjoiYXVnb3JhIiwiYSI6ImNraDNoMXVwdjA2aDgyeG55MjN0cWhvdWkifQ.pNUguYV6VedR4PY0urld8w"
      mapStyle={`mapbox://styles/augora/${borders ? "cktufpwer194q18pmh09ut4e5" : "ckh3h62oh2nma19qt1fgb0kq7"}?optimize=true`}
      ref={(ref) => (mapRef.current = ref && ref.getMap())}
      {...props.viewport}
      width="100%"
      height="100%"
      minZoom={0}
      dragRotate={false}
      doubleClickZoom={false}
      touchRotate={false}
      interactiveLayerIds={isMapLoaded ? (ghostGeoJSON ? ["zone-fill", "zone-ghost-fill"] : ["zone-fill"]) : []}
      onResize={handleResize}
      onLoad={handleLoad}
      onViewportChange={props.setViewport}
      onClick={handleClick}
      onHover={handleHover}
      onMouseOut={() => renderHover()}
      reuseMaps={true}
      attributionControl={attribution}
    >
      {isMapLoaded && (
        <>
          <Source type="geojson" data={geoJSON} generateId={true}>
            <Layer {...lineLayerProps} paint={paint.line} />
            <Layer {...fillLayerProps} paint={paint.fill} />
          </Source>
          {ghostGeoJSON && (
            <Source type="geojson" data={ghostGeoJSON} generateId={true}>
              <Layer {...lineGhostLayerProps} />
              <Layer {...fillGhostLayerProps} />
            </Source>
          )}
          {overview && geoJSON.features.length === 1 && (
            <MapPin
              coords={[zoneFeature.properties.center[0], zoneFeature.properties.center[1]]}
              color={paint.line["line-color"] as string}
            />
          )}
          {overlay && (
            <>
              <MapPins
                features={geoJSON.features}
                ghostFeatures={ghostGeoJSON?.features}
                hoveredFeature={hover}
                deputies={deputies}
                handleClick={goToZone}
                handleHover={simulateHover}
              />
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
                </div>
                <div className="navigation__left">
                  <MapBreadcrumb feature={zoneFeature} handleClick={goToZone} />
                </div>
                <div className="navigation__bottom">
                  <MapFilters zoneDeputies={getDeputies(zoneFeature, deputies)} />
                </div>
              </div>
            </>
          )}
          {props.children}
        </>
      )}
    </InteractiveMap>
  )
}
