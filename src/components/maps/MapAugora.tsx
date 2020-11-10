import React, { useState, useContext, useEffect, useRef } from "react"
import router from "next/router"
import InteractiveMap, { NavigationControl, FullscreenControl, Source, Layer, LayerProps, ViewState } from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import {
  Code,
  France,
  MetroFeature,
  WorldFeature,
  AllReg,
  flyToBounds,
  getChildFeatures,
  getZoneCode,
  getMouseEventFeature,
  getFeature,
  getGhostZones,
  getDeputies,
  getParentFeature,
} from "components/maps/maps-utils"
import CustomControl from "components/maps/CustomControl"
import MapTooltip from "components/maps/MapTooltip"
import MapBreadcrumb from "components/maps/MapBreadcrumb"
import MapButton from "components/maps/MapButton"
import MapInput from "components/maps/MapInput"
import MapPins from "components/maps/MapPins"
import MapMiniFilter from "components/maps/MapMiniFilter"
import IconArrow from "images/ui-kit/icon-arrow.svg"
import IconClose from "images/ui-kit/icon-close.svg"
import IconPin from "images/ui-kit/icon-pin.svg"
import Filters from "components/deputies-list/filters/Filters"
import { DeputiesListContext } from "context/deputies-filters/deputiesFiltersContext"

interface ICurrentView {
  GEOJson: AugoraMap.FeatureCollection
  feature: AugoraMap.Feature
}

interface IHover {
  lngLat?: AugoraMap.Coordinates
  feature?: AugoraMap.Feature
  source?: string
  id?: string
}

interface IMapAugora {
  setPageTitle?: React.Dispatch<React.SetStateAction<string>>
  codeCont?: number
  codeReg?: number | string
  codeDpt?: number | string
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
 */
export default function MapAugora(props: IMapAugora) {
  const {
    state: { FilteredList },
  } = useContext(DeputiesListContext)

  useEffect(() => {
    if (props.codeCont !== undefined) {
      displayZone(getFeature(props.codeCont, Code.Cont))
    } else if (props.codeReg) {
      displayZone(getFeature(props.codeReg, Code.Reg))
    } else if (props.codeDpt) {
      displayZone(getFeature(props.codeDpt, Code.Dpt))
    }
  }, [props.codeCont, props.codeReg, props.codeDpt])

  const [viewState, setViewState] = useState<ViewState>({
    zoom: 5,
    longitude: France.center.lng,
    latitude: France.center.lat,
  })
  const [currentView, setCurrentView] = useState<ICurrentView>({
    GEOJson: AllReg,
    feature: MetroFeature,
  })
  const [hover, setHover] = useState<IHover>(null)
  const [inExploreMode, setInExploreMode] = useState(false)
  const [isFilterDisplayed, setIsFilterDisplayed] = useState(false)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  const mapRef = useRef<mapboxgl.Map>()

  /**
   * Change le titre de la page, si un callback à cet effet a été fourni
   * @param {string} zoneName Le titre sera [zoneName] | Augora
   */
  const changePageTitle = (zoneName: string) => {
    if (props.setPageTitle) props.setPageTitle(zoneName)
  }

  /**
   * Change de zone sur la feature fournie, reset le viewport si on est deja sur la zone
   * @param {AugoraMap.Feature} feature La feature de la nouvelle zone
   */
  const changeZone = (feature: AugoraMap.Feature) => {
    if (feature !== currentView.feature) {
      const zoneCode = getZoneCode(feature)
      switch (zoneCode) {
        case Code.Cont:
          router.push(`/map?codeCont=${feature.properties[Code.Cont]}`)
          return
        case Code.Reg:
          router.push(`/map?codeReg=${feature.properties[Code.Reg]}`)
          return
        case Code.Dpt:
          router.push(`/map?codeDpt=${feature.properties[Code.Dpt]}`)
          return
        case Code.Circ:
          const deputy = getDeputies(feature, FilteredList)[0]
          if (deputy) router.push(`/depute/${deputy.Slug}`)
        default:
          return
      }
    } else flyToBounds(feature, viewState, setViewState)
  }

  /**
   * Affiche une nouvelle vue, sans changer l'url, ne pas utiliser directement
   * @param {AugoraMap.Feature} feature La feature de la zone à afficher
   */
  const displayZone = (feature: AugoraMap.Feature): void => {
    const zoneCode = getZoneCode(feature)
    let newFeature = feature

    switch (zoneCode) {
      case Code.Circ:
        newFeature = getParentFeature(feature)
      case Code.Dpt:
      case Code.Reg:
      case Code.Cont:
        const newGEOJson = getChildFeatures(newFeature)

        setCurrentView({
          GEOJson: newGEOJson,
          feature: newFeature,
        })

        changePageTitle(newFeature.properties.nom)

        if (isMapLoaded) flyToBounds(newFeature, viewState, setViewState)
        break
      default:
        console.error("Zone à afficher non trouvée")
        break
    }
    resetHover()
  }

  /**
   * Reset les data de hover
   */
  const resetHover = () => {
    if (hover) {
      mapRef.current.setFeatureState({ source: hover.source, id: hover.id }, { hover: false })
      setHover(null)
    }
  }

  const handleHover = (e) => {
    const feature = getMouseEventFeature(e)
    if (feature && !inExploreMode) {
      const eventFeature = e.features[0]
      if (hover?.id !== eventFeature.id || hover?.source !== eventFeature.source) {
        if (hover) mapRef.current.setFeatureState({ source: hover.source, id: hover.id }, { hover: false })
        mapRef.current.setFeatureState({ source: eventFeature.source, id: eventFeature.id }, { hover: true })
      }
      setHover({
        lngLat: e.lngLat,
        feature: feature,
        source: eventFeature.source,
        id: eventFeature.id,
      })
    } else {
      resetHover()
    }
  }

  const handleClick = (e) => {
    if (e.leftButton) {
      const feature = getMouseEventFeature(e)
      if (feature) changeZone(feature)
    } else if (e.rightButton) handleBack()
    resetHover()
  }

  const handleBack = () => {
    changeZone(getParentFeature(currentView.feature))
  }

  const handleLoad = () => {
    flyToBounds(currentView.feature, viewState, setViewState)
    setIsMapLoaded(true)
  }

  return (
    <InteractiveMap
      mapboxApiAccessToken="pk.eyJ1IjoiYXVnb3JhIiwiYSI6ImNraDNoMXVwdjA2aDgyeG55MjN0cWhvdWkifQ.pNUguYV6VedR4PY0urld8w"
      mapStyle="mapbox://styles/augora/ckh3h62oh2nma19qt1fgb0kq7?optimize=true"
      ref={(ref) => (mapRef.current = ref && ref.getMap())}
      {...viewState}
      width="100%"
      height="100%"
      minZoom={2}
      dragRotate={false}
      doubleClickZoom={false}
      touchRotate={false}
      interactiveLayerIds={!inExploreMode ? ["zone-fill", "zone-ghost-fill"] : []}
      onLoad={handleLoad}
      onViewStateChange={(change) => setViewState(change.viewState)}
      onClick={handleClick}
      onHover={handleHover}
      reuseMaps={true}
    >
      <Source type="geojson" data={currentView.GEOJson} generateId={true}>
        <Layer {...lineLayerProps} />
        <Layer {...fillLayerProps} layout={inExploreMode ? { visibility: "none" } : {}} />
      </Source>
      <Source type="geojson" data={getGhostZones(currentView.feature)} generateId={true}>
        <Layer {...lineGhostLayerProps} />
        <Layer {...fillGhostLayerProps} layout={inExploreMode ? { visibility: "none" } : {}} />
      </Source>
      {!inExploreMode && hover && <MapTooltip lngLat={hover.lngLat} zoneFeature={hover.feature} deputiesList={FilteredList} />}
      {!inExploreMode && <MapPins features={currentView.GEOJson.features} deputiesList={FilteredList} />}
      <div className="map__navigation map__navigation-right">
        <NavigationControl showCompass={false} zoomInLabel="Zoomer" zoomOutLabel="Dézoomer" />
        <FullscreenControl />
        {/* <MapButton className="visible" title="Revenir sur la France métropolitaine" onClick={() => changeZone(MetroFeature)}>
          <IconFrance />
        </MapButton> */}
        <MapInput
          type="checkbox"
          title={`${inExploreMode ? "Désactiver" : "Activer"} le mode exploration`}
          checked={inExploreMode}
          onChange={() => setInExploreMode(!inExploreMode)}
        >
          <IconPin style={inExploreMode ? { fill: "white" } : {}} />
        </MapInput>
      </div>
      <div className="map__navigation map__navigation-left">
        <MapBreadcrumb feature={currentView.feature} handleClick={changeZone} />
        <MapButton
          className={currentView.feature !== WorldFeature ? "visible" : ""}
          title="Revenir à la vue précédente"
          onClick={handleBack}
        >
          <div className="icon-wrapper">
            <IconArrow style={{ transform: "rotate(90deg)" }} />
          </div>
        </MapButton>
      </div>
      <div className="map__navigation map__navigation-bottom">
        {!isFilterDisplayed && (
          <MapMiniFilter onClick={() => setIsFilterDisplayed(true)} zoneList={getDeputies(currentView.feature, FilteredList)} />
        )}
        {isFilterDisplayed && (
          <CustomControl className="map__filters">
            <Filters />
            <button className="filters__close" onClick={() => setIsFilterDisplayed(false)} title="Cacher les filtres">
              <div className="icon-wrapper">
                <IconClose />
              </div>
            </button>
          </CustomControl>
        )}
      </div>
    </InteractiveMap>
  )
}
