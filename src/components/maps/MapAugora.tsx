import React, { useState, useEffect, useRef } from "react"
import { isMobile } from "react-device-detect"
import router from "next/router"
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
  France,
  MetroFeature,
  AllReg,
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
} from "components/maps/maps-utils"
import MapBreadcrumb from "components/maps/MapBreadcrumb"
import MapInput from "components/maps/MapInput"
import MapPins from "components/maps/MapPins"
import MapFilters from "components/maps/MapFilters"
import IconInfo from "images/ui-kit/icon-info.svg"
import useDeputiesFilters from "src/hooks/deputies-filters/useDeputiesFilters"
import { getDeputes } from "src/lib/deputes/Wrapper"
import "mapbox-gl/dist/mapbox-gl.css"

interface ICurrentView {
  geoJSON: AugoraMap.FeatureCollection
  feature: AugoraMap.Feature
  ghostGeoJSON?: AugoraMap.FeatureCollection
}

interface IMapAugora {
  setPageTitle?: React.Dispatch<React.SetStateAction<string>>
  codeCont?: number
  codeReg?: number | string
  codeDpt?: number | string
  codeCirc?: number | string
}

const fillLayerProps: LayerProps = {
  id: "zone-fill",
  type: "fill",
  paint: {
    "fill-color": ["case", ["boolean", ["feature-state", "hover"], false], "#14ccae", "#00bbcc"],
    "fill-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.4, 0.1],
  },
}

const lineLayerProps: LayerProps = {
  id: "zone-line",
  type: "line",
  paint: {
    "line-color": "#00bbcc",
    "line-width": 2,
  },
}

const fillGhostLayerProps: LayerProps = {
  id: "zone-ghost-fill",
  type: "fill",
  paint: {
    "fill-color": ["case", ["boolean", ["feature-state", "hover"], false], "#14ccae", "#00bbcc"],
    "fill-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.4, 0.04],
  },
}

const lineGhostLayerProps: LayerProps = {
  id: "zone-ghost-line",
  type: "line",
  paint: {
    "line-color": "#00bbcc",
    "line-width": 2,
    // "line-dasharray": [2, 2],
    "line-opacity": 0.2,
  },
}

/**
 * Renvoie la map augora, ne peut recevoir qu'un seul code d'affichage. Si plusieurs sont fournis, ils seront pris en compte dans l'ordre continent > region > département
 * @param {React.Dispatch<React.SetStateAction<string>>} [setPageTitle] setState callback pour changer le titre de la page
 * @param {number} codeCont Code de continent à afficher
 * @param {number | string} codeReg Code de région à afficher
 * @param {number | string} codeDpt Code de département à afficher
 * @param {number | string} codeCirc Code de circonscription à afficher
 */
export default function MapAugora(props: IMapAugora) {
  const {
    state: { FilteredList },
  } = useDeputiesFilters()

  useEffect(() => {
    if (props.codeCont !== undefined) {
      displayZone(getFeature(props.codeCont, Code.Cont))
    } else if (props.codeReg) {
      displayZone(getFeature(props.codeReg, Code.Reg))
    } else if (props.codeCirc) {
      displayZone(getFeature(props.codeCirc, Code.Circ, props.codeDpt))
    } else if (props.codeDpt) {
      displayZone(getFeature(props.codeDpt, Code.Dpt))
    }
  }, [props.codeCont, props.codeReg, props.codeDpt, props.codeCirc])

  const [viewport, setViewport] = useState<ViewportProps>({
    zoom: 5,
    longitude: France.center.lng,
    latitude: France.center.lat,
  })
  const [currentView, setCurrentView] = useState<ICurrentView>({
    geoJSON: AllReg,
    feature: MetroFeature,
    ghostGeoJSON: getGhostZones(MetroFeature),
  })
  const [hover, setHover] = useState<mapboxgl.MapboxGeoJSONFeature>(null)
  const [inExploreMode, setInExploreMode] = useState(false)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  const mapRef = useRef<mapboxgl.Map>()

  /** Transitionne le viewport sur une feature */
  const flyToFeature = <T extends GeoJSON.Feature>(feature: T) => {
    flyToBounds(feature, viewport, setViewport, isMobile ? 20 : 80)
  }

  /**
   * Change de zone sur la feature fournie, reset le viewport si on est deja sur la zone
   * @param {GeoJSON.Feature} feature La feature de la nouvelle zone
   */
  const changeZone = <T extends GeoJSON.Feature>(feature: T) => {
    const zoneCode = getZoneCode(feature)
    if (!compareFeatures(feature, currentView.feature)) {
      switch (zoneCode) {
        case Code.Cont:
          router.push(`/carte?codeCont=${feature.properties[Code.Cont]}`, `/carte?codeCont=${feature.properties[Code.Cont]}`, {
            shallow: true,
          })
          return
        case Code.Reg:
          router.push(`/carte?codeReg=${feature.properties[Code.Reg]}`, `/carte?codeReg=${feature.properties[Code.Reg]}`, {
            shallow: true,
          })
          return
        case Code.Dpt:
          router.push(`/carte?codeDpt=${feature.properties[Code.Dpt]}`, `/carte?codeDpt=${feature.properties[Code.Dpt]}`, {
            shallow: true,
          })
          return
        case Code.Circ:
          router.push(
            `/carte?codeDpt=${feature.properties[Code.Dpt]}&codeCirc=${feature.properties[Code.Circ]}`,
            `/carte?codeDpt=${feature.properties[Code.Dpt]}&codeCirc=${feature.properties[Code.Circ]}`,
            {
              shallow: true,
            }
          )
          return
        default:
          console.error("Feature à afficher non valide")
          return
      }
    } else if (zoneCode === Code.Circ && !currentView.ghostGeoJSON) {
      const deputy = getDeputies(feature, FilteredList)[0]
      if (deputy) {
        router.push(`/depute/${deputy.Slug}`, `/depute/${deputy.Slug}`, {
          shallow: true,
        })
      }
    } else flyToFeature(feature)
  }

  /**
   * Affiche une nouvelle vue, sans changer l'url, ne pas utiliser directement
   * @param {AugoraMap.Feature} feature La feature de la zone à afficher
   */
  const displayZone = (feature: AugoraMap.Feature) => {
    const zoneCode = getZoneCode(feature)
    switch (zoneCode) {
      case Code.Circ:
        setCurrentView({
          geoJSON: createFeatureCollection([feature]),
          feature: feature,
        })

        if (props.setPageTitle) props.setPageTitle(`${feature.properties.nom_dpt} ${feature.properties.code_circ}`)

        if (isMapLoaded) flyToFeature(feature)
        break
      case Code.Dpt:
      case Code.Reg:
      case Code.Cont:
        const newGEOJson = getChildFeatures(feature)

        setCurrentView({
          geoJSON: newGEOJson,
          feature: feature,
          ghostGeoJSON: getGhostZones(feature),
        })

        if (props.setPageTitle) props.setPageTitle(feature.properties.nom)

        if (isMapLoaded) flyToFeature(feature)
        break
      default:
        console.error("Zone à afficher non trouvée")
        break
    }
    renderHover()
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
    if (!inExploreMode && e.target.className !== "pins__btn") {
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
    changeZone(getParentFeature(currentView.feature))
  }

  const handleLoad = () => {
    setIsMapLoaded(true)
    flyToFeature(currentView.feature)
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
      interactiveLayerIds={!inExploreMode ? (currentView.ghostGeoJSON ? ["zone-fill", "zone-ghost-fill"] : ["zone-fill"]) : []}
      onResize={handleLoad}
      onViewportChange={setViewport}
      onClick={handleClick}
      onHover={handleHover}
      onMouseOut={() => renderHover()}
      reuseMaps={true}
    >
      <Source type="geojson" data={currentView.geoJSON} generateId={true}>
        <Layer {...lineLayerProps} />
        <Layer {...fillLayerProps} layout={inExploreMode ? { visibility: "none" } : {}} />
      </Source>
      {currentView.ghostGeoJSON && (
        <Source type="geojson" data={currentView.ghostGeoJSON} generateId={true}>
          <Layer {...lineGhostLayerProps} />
          <Layer {...fillGhostLayerProps} layout={inExploreMode ? { visibility: "none" } : {}} />
        </Source>
      )}
      {!inExploreMode && isMapLoaded && (
        <MapPins
          features={currentView.geoJSON.features}
          ghostFeatures={currentView.ghostGeoJSON ? currentView.ghostGeoJSON.features : null}
          hoveredFeature={hover}
          deputies={FilteredList}
          handleClick={changeZone}
          handleHover={simulateHover}
        />
      )}
      <div className="map__navigation">
        <div className="navigation__right">
          <NavigationControl showCompass={false} zoomInLabel="Zoomer" zoomOutLabel="Dézoomer" style={{ position: "relative" }} />
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
          <MapBreadcrumb feature={currentView.feature} handleClick={changeZone} />
        </div>
        <div className="navigation__bottom">
          <MapFilters zoneDeputies={getDeputies(currentView.feature, FilteredList)} />
        </div>
      </div>
    </InteractiveMap>
  )
}

export async function getStaticProps() {
  const deputes = await getDeputes()

  return {
    props: {
      deputes,
    },
  }
}
