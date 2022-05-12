import React, { useState, useRef, useEffect } from "react"
import { isMobile } from "react-device-detect"
import Map, {
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
  Source,
  Layer,
  LayerProps,
  ViewState,
  MapRef,
  GeolocateResultEvent,
} from "react-map-gl"
import {
  Code,
  flyToBounds,
  getZoneCode,
  getParentFeature,
  compareFeatures,
  getLayerPaint,
  getDeputies,
  flyToCoords,
  getContinent,
  geolocateCirc,
  Cont,
} from "components/maps/maps-utils"
import MapControl from "components/maps/MapControl"
import MapBreadcrumb from "components/maps/MapBreadcrumb"
import MapPins from "components/maps/MapPins"
import MapPin from "components/maps/MapPin"
import MapFilters from "components/maps/MapFilters"
import Geocoder from "components/maps/Geocoder"
import mapboxgl from "mapbox-gl"
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

const localeFR = {
  // "AttributionControl.ToggleAttribution": "Toggle attribution",
  "AttributionControl.MapFeedback": "Retours sur la map",
  "FullscreenControl.Enter": "Entrer en plein écran",
  "FullscreenControl.Exit": "Sortir du plein écran",
  "GeolocateControl.FindMyLocation": "Me géolocaliser",
  "GeolocateControl.LocationNotAvailable": "Géolocalisation indisponible",
  "LogoControl.Title": "Logo Mapbox ",
  // "NavigationControl.ResetBearing": "Reset bearing to north",
  "NavigationControl.ZoomIn": "Zoomer",
  "NavigationControl.ZoomOut": "Dézoomer",
  "ScaleControl.Feet": "pieds",
  "ScaleControl.Meters": "m",
  "ScaleControl.Kilometers": "km",
  "ScaleControl.Miles": "miles",
  "ScaleControl.NauticalMiles": "nm",
  "ScrollZoomBlocker.CtrlMessage": "Utilisez control + molette pour zoomer la carte",
  "ScrollZoomBlocker.CmdMessage": "Utilisez ⌘ + molette pour zoomer la carte",
  "TouchPanBlocker.Message": "Utilisez deux doigts pour bouger la carte",
}

/**
 * Renvoie la map augora, il lui faut impérativement des données d'affichage, un viewport, et un setViewstate, le reste est optionnel
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
  const [cursor, setCursor] = useState<string>("grab")
  const [geoPin, setGeoPin] = useState<AugoraMap.Coordinates>(null)

  /** useEffects */
  useEffect(() => {
    if (isMapLoaded) {
      if (!overview) flyToFeature(zoneFeature)
      else flyToPin(zoneFeature)
    }
  }, [zoneFeature, overview, isMapLoaded])

  /** useRefs */
  const mapRef = useRef<MapRef>()

  const MAPBOX_TOKEN = "pk.eyJ1IjoiYXVnb3JhIiwiYSI6ImNraDNoMXVwdjA2aDgyeG55MjN0cWhvdWkifQ.pNUguYV6VedR4PY0urld8w"

  /** Transitionne le viewport sur une feature */
  const flyToFeature = <T extends GeoJSON.Feature>(feature: T) => {
    setTimeout(() => {
      flyToBounds(feature, mapRef.current, isMobile)
    }, delay)
  }

  /** Transitionne le viewport sur un pin en mode overview */
  const flyToPin = <T extends GeoJSON.Feature>(feature: T) => {
    const contId = getContinent(feature)
    const code = getZoneCode(feature)
    const zoom = contId === Cont.World ? -1 : contId === Cont.OM ? 2 : code !== Code.Cont ? 3.5 : 0

    flyToCoords(mapRef.current, zoneFeature.properties.center, zoom)
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

  /** Renvoie la feature mapbox sous l'event pointeur fourni, undefined s'il n'y en a pas */
  const getMouseEventFeature = (e: mapboxgl.MapLayerMouseEvent): mapboxgl.MapboxGeoJSONFeature => {
    return mapRef.current
      .queryRenderedFeatures(e.point)
      .find((feat) => feat.layer.id === "zone-fill" || feat.layer.id === "zone-ghost-fill")
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
   * @param {MapboxGeoJSONFeature} [renderedFeature] Si ce paramètre est manquant ou incorrect, la fonction reset le hover
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

  const handlePointerMove = (e) => {
    if (e.originalEvent.target.className === "mapboxgl-canvas") {
      const renderedFeature = getMouseEventFeature(e)

      if (renderedFeature) {
        if (cursor === "grab" || cursor === "grabbing") setCursor("pointer")
        renderHover(renderedFeature)
      } else {
        if (cursor !== "grab") setCursor("grab")
        if (hover) renderHover()
      }
    }
  }

  const handleClick = (e: mapboxgl.MapLayerMouseEvent) => {
    const renderedFeature = getMouseEventFeature(e)

    if (renderedFeature) goToZone(renderedFeature)
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

  const goToCoordsCirc = (coords: AugoraMap.Coordinates) => {
    const feature = geolocateCirc(coords)

    if (feature) {
      if (!compareFeatures(feature, zoneFeature)) goToZone(feature)
      else flyToFeature(feature)
    } else console.warn(`Pas de circonscription trouvée à ces coordonnées: ${coords[0]}, ${coords[1]}`)
  }

  const handleGeolocate = (e: GeolocateResultEvent) => {
    const coords = [+e.coords.longitude.toFixed(4), +e.coords.latitude.toFixed(4)] as AugoraMap.Coordinates
    if (coords) goToCoordsCirc(coords)
  }

  return (
    <Map
      mapboxAccessToken={MAPBOX_TOKEN}
      mapStyle={`mapbox://styles/augora/${borders ? "cktufpwer194q18pmh09ut4e5" : "ckh3h62oh2nma19qt1fgb0kq7"}?optimize=true`}
      locale={localeFR}
      ref={mapRef}
      style={{ width: "100%", height: "100%" }}
      initialViewState={props.viewstate}
      minZoom={0}
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
      onMouseDown={() => setCursor("grabbing")}
      reuseMaps={false}
      attributionControl={attribution}
    >
      {isMapLoaded && (
        <>
          <Source type="geojson" data={geoJSON} generateId={true}>
            {/* spread pour éviter un bug de typescript de react map gl, à changer quand c'est fix */}
            <Layer {...lineLayerProps} {...{ paint: paint.line }} />
            <Layer {...fillLayerProps} {...{ paint: paint.fill }} />
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
              {geoPin && <MapPin coords={geoPin} style={{ zIndex: 1 }} />}
              <MapControl position="top-left">
                <MapBreadcrumb
                  feature={zoneFeature}
                  handleClick={(feature) => (!compareFeatures(feature, zoneFeature) ? goToZone(feature) : flyToFeature(feature))}
                />
              </MapControl>
              <MapControl position="top-right" className="mapboxgl-ctrl-geo">
                <Geocoder
                  token={MAPBOX_TOKEN}
                  handleClick={(coords) => {
                    if (coords) {
                      goToCoordsCirc(coords)
                      setGeoPin(coords)
                    } else setGeoPin(null)
                  }}
                />
                {/* <form
                  style={{ position: "absolute", top: 170, right: 0, display: "flex", flexDirection: "column" }}
                  onSubmit={(e) => {
                    e.preventDefault()
                    const lng = e.target[0].value
                    const lat = e.target[1].value

                    if (isNaN(lng) || isNaN(lat) || lng === "" || lat === "") {
                      console.error("Les données fournis ne sont pas valides")
                    } else {
                      goToCoordsCirc([lng, lat])
                    }
                  }}
                >
                  <input type="text" placeholder="Longitude" />
                  <input type="text" placeholder="Latitude" />
                  <button>GO</button>
                </form> */}
              </MapControl>
              <NavigationControl showCompass={false} />
              <FullscreenControl />
              <GeolocateControl onGeolocate={handleGeolocate} />
              <div className="custom-control-container">
                <div className="ctrl-bottom">
                  <MapFilters zoneDeputies={getDeputies(zoneFeature, deputies)} />
                </div>
              </div>
            </>
          )}
          {props.children}
        </>
      )}
    </Map>
  )
}
