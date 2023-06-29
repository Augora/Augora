import React, { useState, useRef, useEffect, useMemo } from "react"
import { flushSync } from "react-dom"
import { isMobile } from "react-device-detect"
import Map, {
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
  Source,
  Layer,
  ViewState,
  MapRef,
  GeolocateResultEvent,
  MapboxGeoJSONFeature,
  MapLayerMouseEvent,
} from "react-map-gl"
import {
  Code,
  flyToBounds,
  getZoneCode,
  compareFeatures,
  getLayerPaint,
  flyToCoords,
  getPosition,
  Pos,
  localeFR,
  geolocateFromCoords,
  geolocateZone,
} from "components/maps/maps-utils"
import MapControl from "components/maps/MapControl"
import MapBreadcrumb from "components/maps/MapBreadcrumb"
import MapPins from "components/maps/MapPins"
import MapPin from "components/maps/MapPin"
import MapFilters from "components/maps/MapFilters"
import Geocoder from "components/maps/Geocoder"
import "mapbox-gl/dist/mapbox-gl.css"

interface IMapAugora {
  /** Objet view contenant les données d'affichage */
  mapView: AugoraMap.MapView
  /** Viewport state object */
  viewstate: ViewState
  /** Viewport setstate function */
  setViewstate(newViewport: ViewState): void
  /** Callback quand une zone de la map est cliquée */
  onZoneClick?<T extends GeoJSON.Feature>(feature: T): void
  /** Callback de quand le clic droit est utilisé */
  onBack?(args?: any): void
  /** Objet breadcrumb pour savoir quoi afficher */
  breadcrumb?: AugoraMap.Breadcrumb[]
  /** Le mode de vue sur les zones, par défaut zoomé */
  overview?: boolean
  /** Pour passer du JSX custom dans un marker au milieu de la zone */
  marker?: JSX.Element
  /** Liste de tous les députés. Inutile si on désactive les overlay */
  deputies?: Deputy.DeputiesList
  /** Liste des députés dans la zone actuelle. Inutile si on désactive les overlay */
  zoneDeputies?: Deputy.DeputiesList
  /** Si les overlays doivent être affichés,
   * @default true */
  overlay?: boolean
  /** Délai optionel de la fonction flytobounds */
  delay?: number
  /** S'il faut afficher les infos légales mapbox en bas à droite (légalement obligatoire)
   * @default true */
  attribution?: boolean
  /** Si la carte est en chargement. Désactive les différents évènements de routing (clic gauche, clic droit, breadcrumb, pins) */
  isLoading?: boolean
  /** S'il faut afficher les frontières */
  borders?: boolean
  children?: React.ReactNode
}

/**
 * Renvoie la map augora, il lui faut impérativement des données d'affichage, un viewport, et un setViewstate, le reste est optionnel
 * @param {AugoraMap.MapView} mapView Object contenant les données d'affichage : geoJSON (zones affichées), feature (zone parente), ghostGeoJSON (zones voisines), paint (comment les zones sont dessinées)
 * @param {Function} [onZoneClick] Callback au click d'une zone, fournie la feature cliquée en paramètre
 * @param {Deputy.DeputiesList} [deputies] Liste des députés à afficher sur la map, inutile si les overlays sont désactivés
 * @param {boolean} [overview] Pour afficher les zones en mode overview, default false
 * @param {boolean} [overlay] S'il faut afficher les overlay ou pas, default true
 * @param {boolean} [borders] S'il faut afficher les frontières, default false
 * @param {boolean} [attribution] Si on veut afficher le logo MapBox, default true
 * @param {number} [delay] Si on veut retarder l'effet de zoom, default 0
 */
export default function MapAugora(props: IMapAugora) {
  /** Default props */
  const {
    mapView: { geoJSON, ghostGeoJSON, feature: zoneFeature, color = null },
    overlay = true,
    deputies = [],
    zoneDeputies = [],
    overview = false,
    attribution = true,
    delay = 0,
    isLoading = false,
    borders = false,
    marker = null,
  } = props

  const paint = useMemo(() => getLayerPaint(color && { color }), [color])

  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  /** useStates */
  const [hover, setHover] = useState<MapboxGeoJSONFeature>(null)
  const [cursor, setCursor] = useState<string>("grab")
  const [geoPin, setGeoPin] = useState<AugoraMap.Coordinates>(null)

  /** useEffects */
  useEffect(() => {
    handleLoad()
  }, [zoneFeature, overview]) //lance une transition entre zones lorsque l'affichage change

  useEffect(() => {
    isLoading ? setCursor("wait") : setCursor("grab")
  }, [isLoading])

  /** useRefs */
  const mapRef = useRef<MapRef>()

  /** Transitionne le viewport sur une feature */
  const flyToFeature = <T extends GeoJSON.Feature>(feature: T) => {
    setTimeout(() => {
      if (mapRef.current) flyToBounds(feature, mapRef.current, isMobile)
    }, delay)
  }

  /** Transitionne le viewport sur un pin en mode overview */
  const flyToPin = <T extends GeoJSON.Feature>(feature: T) => {
    const pos = getPosition(feature)
    const zoom =
      pos === Pos.World || pos === Pos.WCirc ? -1 : pos === Pos.OMDpt || pos === Pos.OMCirc ? 2 : pos === Pos.France ? 0 : 3.5

    if (mapRef.current) flyToCoords(mapRef.current, zoneFeature.properties.center, { zoom: zoom })
  }

  /** Change la zone affichée et transitionne
   * @param {T} [opts.feature] La feature à afficher
   * @param {AugoraMap.Coordinates} [opts.coords] Les coords sur lesquelles transitionner, ignoré si une feature est aussi passée
   * @param {string} [opts.url] Pour requeter un changement d'url, ignoré si une feature et des coordonnées sont passées
   * @param {boolean} [opts.redirect] S'il faut changer pour la page détal en cas de clic sur une circonscription @default true
   */
  const goToZone = <T extends GeoJSON.Feature>(opts: { feature?: T; coords?: AugoraMap.Coordinates; redirect?: boolean }) => {
    const { feature, coords, redirect = true } = opts

    if (feature) {
      const zoneCode = getZoneCode(feature)
      if (!compareFeatures(feature, zoneFeature)) {
        props.onZoneClick && props.onZoneClick(feature)
        renderHover()
      } else if (redirect && zoneCode === Code.Circ) {
        props.onZoneClick && props.onZoneClick(feature)
      } else flyToFeature(feature)
    } else if (coords) {
      flyToCoords(mapRef.current, coords, { zoom: 3 })
      console.warn(`Pas de zone trouvée à ces coordonnées: ${coords[0]}, ${coords[1]}`)
    }
  }

  /** Renvoie la feature mapbox sous l'event pointeur fourni, undefined s'il n'y en a pas */
  const getMouseEventFeature = (e: MapLayerMouseEvent): MapboxGeoJSONFeature => {
    return mapRef?.current
      ?.queryRenderedFeatures(e.point)
      .find((feat) => feat.layer.id === "zone-fill" || feat.layer.id === "zone-ghost-fill")
  }

  /** Renvoie la feature mapbox actuellement affichée correspondant à la feature fournie, undefined si elle n'est pas rendered */
  const getRenderedFeature = (feature: AugoraMap.Feature): MapboxGeoJSONFeature => {
    const zoneCode = getZoneCode(feature)

    return mapRef?.current?.queryRenderedFeatures(null, { layers: ["zone-fill"] }).find((feat) => {
      return zoneCode !== Code.Circ
        ? feat.properties[zoneCode] === feature.properties[zoneCode]
        : feat.properties[zoneCode] === feature.properties[zoneCode] && feat.properties[Code.Dpt] === feature.properties[Code.Dpt]
    })
  }

  /** Active le hover de la feature si elle est actuellement affichée sur la map */
  const simulateHover = (feature: AugoraMap.Feature) => {
    if (mapRef.current) {
      if (!compareFeatures(hover, feature)) {
        const renderedFeature = getRenderedFeature(feature)
        renderHover(renderedFeature)
      }
    }
  }

  /**
   * Crée un effet de hover sur la rendered feature mapbox fournie
   * @param {MapboxGeoJSONFeature} [renderedFeature] Si ce paramètre est manquant ou incorrect, la fonction reset le hover
   */
  const renderHover = (renderedFeature?: MapboxGeoJSONFeature) => {
    if (!compareFeatures(hover, renderedFeature)) {
      if (hover) mapRef.current.setFeatureState({ source: hover.source, id: hover.id }, { hover: false })
      if (renderedFeature)
        mapRef.current.setFeatureState({ source: renderedFeature.source, id: renderedFeature.id }, { hover: true })
      flushSync(() => setHover(renderedFeature ? renderedFeature : null))
    }
  }

  const handlePointerMove = (e) => {
    if (e.originalEvent.target.className === "mapboxgl-canvas") {
      const renderedFeature = getMouseEventFeature(e)

      if (renderedFeature) {
        if (cursor !== "pointer" && !isLoading) setCursor("pointer")
        renderHover(renderedFeature)
      } else {
        if (cursor !== "grab" && !isLoading) setCursor("grab")
        if (hover) renderHover()
      }
    }
  }

  const handleClick = (e: MapLayerMouseEvent) => {
    if (!isLoading) {
      const renderedFeature = getMouseEventFeature(e)

      if (renderedFeature) {
        goToZone({ feature: renderedFeature })
      }
    }
  }

  const handleBack = () => {
    if (!isLoading) {
      if (props.onBack) {
        props.onBack()
      }
    }
  }

  const handleBreadcrumb = (feat) => {
    if (!isLoading) {
      goToZone({ feature: feat })
    }
  }

  const handleResize = () => {
    if (mapRef.current) flyToFeature(zoneFeature)
  }

  const handleLoad = () => {
    if (!overview) flyToFeature(zoneFeature)
    else flyToPin(zoneFeature)
  }

  const handleGeolocate = (e: GeolocateResultEvent) => {
    const coords: AugoraMap.Coordinates = [+e.coords.longitude.toFixed(4), +e.coords.latitude.toFixed(4)]
    if (coords) {
      geolocateFromCoords(coords, Code.Circ).then(
        (result) => {
          goToZone({ feature: result, coords: coords, redirect: false })
          setGeoPin(coords)
        },
        (error) => console.error(error)
      )
    }
  }

  const handleGeocode = (feature: AugoraMap.MapboxAPIFeature) => {
    if (feature) {
      geolocateZone(feature).then(
        (result) => {
          goToZone({ feature: result, coords: feature.center, redirect: false })
          setGeoPin(feature.center)
        },
        (error) => console.error(error)
      )
    } else setGeoPin(null)
  }

  return (
    <Map
      mapboxAccessToken={MAPBOX_TOKEN}
      mapStyle={`mapbox://styles/augora/${borders ? "cktufpwer194q18pmh09ut4e5" : "ckh3h62oh2nma19qt1fgb0kq7"}?optimize=true`}
      locale={localeFR}
      ref={mapRef}
      style={{ width: "100%", height: "100%" }}
      initialViewState={props.viewstate}
      minZoom={-1}
      dragRotate={false}
      doubleClickZoom={false}
      // interactiveLayerIds={isMapLoaded ? (ghostGeoJSON ? ["zone-fill", "zone-ghost-fill"] : ["zone-fill"]) : []}
      cursor={cursor}
      onResize={handleResize}
      onLoad={handleLoad}
      onMove={(e) => props.setViewstate(e.viewState)}
      onMouseMove={handlePointerMove}
      onClick={handleClick}
      onContextMenu={handleBack}
      onMouseDown={() => cursor !== "wait" && setCursor("grabbing")}
      reuseMaps={false}
      attributionControl={attribution}
    >
      <>
        <Source type="geojson" data={geoJSON} generateId={true}>
          <Layer id="zone-line" type="line" beforeId="road-label" paint={paint.line} />
          <Layer id="zone-fill" type="fill" beforeId="road-label" paint={paint.fill} />
        </Source>
        {ghostGeoJSON && (
          <Source type="geojson" data={ghostGeoJSON} generateId={true}>
            <Layer id="zone-ghost-line" type="line" beforeId="road-label" paint={getLayerPaint({ ghost: true }).line} />
            <Layer id="zone-ghost-fill" type="fill" beforeId="road-label" paint={getLayerPaint({ ghost: true }).fill} />
          </Source>
        )}
        {overview && !marker && <MapPin coords={zoneFeature.properties.center} color={color} />}
        {marker && <MapPin coords={zoneFeature.properties.center}>{marker}</MapPin>}
        {overlay && (
          <>
            <MapPins
              features={geoJSON.features}
              ghostFeatures={ghostGeoJSON?.features}
              hoveredFeature={hover}
              deputies={deputies}
              handleClick={!isLoading && goToZone}
              handleHover={simulateHover}
            />
            {geoPin && <MapPin coords={geoPin} style={{ zIndex: 1 }} />}
            {props.breadcrumb && (
              <MapControl position="top-left">
                <MapBreadcrumb breadcrumb={props.breadcrumb} handleClick={handleBreadcrumb} />
              </MapControl>
            )}
            <MapControl position="top-right" className="mapboxgl-ctrl-geo">
              <Geocoder token={MAPBOX_TOKEN} handleClick={handleGeocode} isCollapsed={isMobile} />
            </MapControl>
            <NavigationControl showCompass={false} />
            <FullscreenControl />
            <GeolocateControl onGeolocate={handleGeolocate} showUserLocation={false} />
            <div className="custom-control-container">
              <div className="ctrl-bottom">
                <MapFilters zoneDeputies={zoneDeputies} />
              </div>
            </div>
          </>
        )}
        {props.children}
      </>
    </Map>
  )
}
