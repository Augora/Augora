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
  Popup,
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
  MetroFeature,
} from "components/maps/maps-utils"
import MapBreadcrumb from "components/maps/MapBreadcrumb"
import MapInput from "components/maps/MapInput"
import MapPins from "components/maps/MapPins"
import MapFilters from "components/maps/MapFilters"
import IconPin from "images/ui-kit/icon-pin.svg"
import "mapbox-gl/dist/mapbox-gl.css"

interface IMapAugora {
  /** Objet view contenant les données d'affichage */
  mapView: AugoraMap.MapView
  /** Viewport state object */
  viewport: ViewportProps
  /** Viewport setstate function */
  setViewport(newViewport: ViewportProps): void
  /** Callback quand la map requete un changement de zone */
  changeZone?<T extends GeoJSON.Feature>(feature: T): void
  /** Si on affiche les circonscriptions comme un pin en mode dézoomé ou de façon normale */
  overview?: boolean
  /** Liste de députés que la map va fouiller. Hint: on peut passer une array avec un seul député pour par exemple une circonscription */
  deputies?: Deputy.DeputiesList
  /** Si les overlays doivent être affichés */
  overlay?: boolean
  /** S'il faut forcer un recentrage de la map au chargement */
  forceCenter?: boolean
  /** Délai optionel de la fonction flytobounds */
  delay?: number
  /** Si le container de la map est petit (<100px) pour éviter le bug de webmercator */
  small?: boolean
  /** S'il faut afficher les infos légales mapbox en bas à droite (légalement obligatoire) */
  attribution?: boolean
  /** S'il faut afficher les frontières */
  borders?: boolean
  children?: React.ReactNode
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
 * @param {AugoraMap.MapView} mapView Object contenant les données d'affichage : geoJSON (zones affichées), feature (zone parente), ghostGeoJSON (zones voisines), paint (comment les zones sont dessinées)
 * @param {Function} [changeZone] Callback de changement de zone
 * @param {Deputy.DeputiesList} [deputies] Liste des députés à afficher sur la map
 * @param {boolean} [overlay] S'il faut afficher les overlay ou pas, default true
 * @param {boolean} [forceCenter] S'il faut recentrer la map au chargement, default false
 * @param {boolean} [small] S'il faut afficher une map plus petite, default false
 * @param {boolean} [attribution] Si on veut afficher le logo MapBox, default true
 * @param {number} [delay] Si on veut retarder l'effet de zoom, default 0
 */
export default function MapAugora(props: IMapAugora) {
  /** Default props */
  const {
    overlay = true,
    deputies = [],
    forceCenter = false,
    mapView: { geoJSON, ghostGeoJSON, feature: zoneFeature, paint },
    overview = false,
    small = false,
    attribution = true,
    delay = 0,
    borders = false,
  } = props

  /** useStates */
  const [hover, setHover] = useState<mapboxgl.MapboxGeoJSONFeature>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  /** useEffects */
  useEffect(() => {
    if (!overview) flyToFeature(zoneFeature)
    else flyToFeature(MetroFeature)
  }, [zoneFeature, overview])

  /** useRefs */
  const mapRef = useRef<mapboxgl.Map>()

  /** Transitionne le viewport sur une feature */
  const flyToFeature = <T extends GeoJSON.Feature>(feature: T) => {
    let padding = 80
    if (isMobile) {
      padding = 20
    } else if (small) {
      padding = 30
    }

    setTimeout(() => {
      flyToBounds(feature, props.viewport, props.setViewport, padding)
    }, delay)
  }

  /** Change la zone affichée et transitionne */
  const goToZone = <T extends GeoJSON.Feature>(feature: T) => {
    const zoneCode = getZoneCode(feature)
    if (feature) {
      if (!compareFeatures(feature, zoneFeature)) {
        if (props.changeZone) props.changeZone(feature)
        renderHover()
      } else if (zoneCode === Code.Circ) {
        if (props.changeZone) props.changeZone(feature)
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
    if (!isMapLoaded) {
      setIsMapLoaded(true)
      if (forceCenter) flyToFeature(zoneFeature)
    }
  }

  return (
    <InteractiveMap
      mapboxApiAccessToken="pk.eyJ1IjoiYXVnb3JhIiwiYSI6ImNraDNoMXVwdjA2aDgyeG55MjN0cWhvdWkifQ.pNUguYV6VedR4PY0urld8w"
      mapStyle={`mapbox://styles/augora/${borders ? "cktufpwer194q18pmh09ut4e5" : "ckh3h62oh2nma19qt1fgb0kq7"}?optimize=true`}
      ref={(ref) => (mapRef.current = ref && ref.getMap())}
      {...props.viewport}
      width="100%"
      height="100%"
      minZoom={small ? 0 : 1}
      dragRotate={false}
      doubleClickZoom={false}
      touchRotate={false}
      interactiveLayerIds={isMapLoaded && !overview ? (ghostGeoJSON ? ["zone-fill", "zone-ghost-fill"] : ["zone-fill"]) : []}
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
          {overview && geoJSON.features.length === 1 ? (
            <Popup
              className="map__popup"
              longitude={zoneFeature.properties.center[0]}
              latitude={zoneFeature.properties.center[1]}
              closeButton={false}
              tipSize={0}
              anchor={"bottom"}
              dynamicPosition={false}
            >
              <div className="icon-wrapper">
                <IconPin style={{ fill: paint.line["line-color"] }} />
              </div>
            </Popup>
          ) : (
            <Source type="geojson" data={geoJSON} generateId={true}>
              <Layer {...lineLayerProps} paint={paint.line} />
              <Layer {...fillLayerProps} paint={paint.fill} />
            </Source>
          )}
          {ghostGeoJSON && (
            <Source type="geojson" data={ghostGeoJSON} generateId={true}>
              <Layer {...lineGhostLayerProps} />
              <Layer {...fillGhostLayerProps} />
            </Source>
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
