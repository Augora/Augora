import React, { useState, useContext } from "react"
import { navigate } from "gatsby"
import InteractiveMap, {
  NavigationControl,
  FullscreenControl,
  Source,
  Layer,
  LayerProps,
  FlyToInterpolator,
  InteractiveMapProps,
  MapLoadEvent,
} from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import {
  Code,
  Continent,
  France,
  franceBox,
  GEOJsonReg,
  DROMGEOJsonReg,
  metroFranceFeature,
  OMFeature,
  flyToBounds,
  getContinent,
  getBoundingBoxFromFeature,
  getChildFeatures,
  getZoneCode,
  getMouseEventFeature,
  getZoneFeature,
  getGhostZones,
  getDeputies,
} from "components/maps/maps-utils"
import CustomControl from "components/maps/CustomControl"
import MapTooltip from "components/maps/MapTooltip"
import MapBreadcrumb from "components/maps/MapBreadcrumb"
import MapButton from "components/maps/MapButton"
import MapPins from "components/maps/MapPins"
import IconFrance from "images/logos/projet/augora-logo.svg"
import IconArrow from "images/ui-kit/icon-arrow.svg"
import IconFilter from "images/ui-kit/icon-filter.svg"
import IconClose from "images/ui-kit/icon-close.svg"
import Filters from "components/deputies-list/filters/Filters"
import { DeputiesListContext } from "context/deputies-filters/deputiesFiltersContext"

export interface ICurrentView {
  GEOJson: AugoraMap.FeatureCollection
  zoneCode: Code
  zoneData: AugoraMap.Feature
}

interface IHoverInfo {
  filter: [string, ...any[]]
  lngLat: [number, number]
  zoneData: AugoraMap.Feature
}

interface IMapAugora {
  featureToDisplay?: AugoraMap.Feature
  setPageTitle?: React.Dispatch<React.SetStateAction<string>>
}

const fillLayerProps: LayerProps = {
  id: "zone-fill",
  type: "fill",
  paint: {
    "fill-color": " #00bbcc",
    "fill-opacity": 0.1,
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

const hoverLayerProps: LayerProps = {
  id: "zone-fill-hovered",
  type: "fill",
  paint: {
    "fill-color": "#14ccae",
    "fill-opacity": 0.3,
  },
}

const fillGhostLayerProps: LayerProps = {
  id: "zone-ghost-fill",
  type: "fill",
  paint: {
    "fill-color": " #00bbcc",
    "fill-opacity": 0.04,
  },
}

const lineGhostLayerProps: LayerProps = {
  id: "zone-ghost-line",
  type: "line",
  paint: {
    "line-color": "#00bbcc",
    "line-width": 2,
    "line-dasharray": [2, 2],
    "line-opacity": 0.4,
  },
}

/**
 * Renvoie la map augora
 * @param {AugoraMap.Feature} [featureToDisplay] La feature à afficher au chargement
 * @param {React.Dispatch<React.SetStateAction<string>>} [setPageTitle] setState function pour changer le titre de la page
 */
export default function MapAugora({
  featureToDisplay = null,
  setPageTitle = undefined,
}: IMapAugora) {
  const {
    state: { FilteredList },
  } = useContext(DeputiesListContext)

  const [viewport, setViewport] = useState<InteractiveMapProps>({
    width: "100%",
    height: "100%",
    zoom: 5,
    longitude: France.center.lng,
    latitude: France.center.lat,
  })
  const [currentView, setCurrentView] = useState<ICurrentView>({
    GEOJson: GEOJsonReg,
    zoneCode: Code.Regions,
    zoneData: metroFranceFeature,
  })
  const [hoverInfo, setHoverInfo] = useState<IHoverInfo>({
    filter: ["==", ["get", ""], 0],
    lngLat: null,
    zoneData: null,
  })
  const [filterDisplayed, setFilterDisplayed] = useState(false)

  const changePageTitle = (zoneName: string) => {
    if (setPageTitle) setPageTitle(zoneName)
  }

  const resetHoverInfo = () => {
    if (hoverInfo.filter !== ["==", ["get", ""], 0])
      setHoverInfo({
        filter: ["==", ["get", ""], 0],
        lngLat: null,
        zoneData: null,
      })
  }

  /**
   * Affiche la france métropolitaine
   */
  const displayFrance = () => {
    setCurrentView({
      GEOJson: GEOJsonReg,
      zoneCode: Code.Regions,
      zoneData: metroFranceFeature,
    })

    changePageTitle(metroFranceFeature.properties.nom)

    flyToBounds(franceBox, viewport, setViewport)

    resetHoverInfo()
  }

  /**
   * Affiche l'outre-mer
   */
  const displayDROM = () => {
    setCurrentView({
      GEOJson: DROMGEOJsonReg,
      zoneCode: Code.Regions,
      zoneData: OMFeature,
    })

    setViewport({
      ...viewport,
      zoom: 3,
      longitude: 0,
      latitude: 0,
      transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
      transitionDuration: "auto",
    })

    changePageTitle(OMFeature.properties.nom)

    resetHoverInfo()
  }

  /**
   * Affiche une nouvelle vue
   * @param {AugoraMap.Feature} feature La feature de la zone à afficher
   */
  const displayNewZone = (feature: AugoraMap.Feature): void => {
    const zoneCode = getZoneCode(feature)
    const continentId = getContinent(feature)
    let newFeature = feature

    switch (zoneCode) {
      case Code.Circonscriptions:
        switch (continentId) {
          case Continent.DROM:
            newFeature = getZoneFeature(
              feature.properties[Code.Regions],
              Code.Regions
            )
            break
          case Continent.COM:
            newFeature = getZoneFeature(
              feature.properties[Code.Departements],
              Code.Regions
            )
            break
          case Continent.France:
            newFeature = getZoneFeature(
              feature.properties[Code.Departements],
              Code.Departements
            )
            break
          default:
            return
        }
      case Code.Departements:
      case Code.Regions:
        const childrenZonesCode =
          zoneCode === Code.Regions && continentId === Continent.France
            ? Code.Departements
            : Code.Circonscriptions

        const newZoneGEOJson = getChildFeatures(newFeature)

        // const newDeputiesInZone = getDeputies(newFeature, FilteredList)

        setCurrentView({
          GEOJson: newZoneGEOJson,
          zoneCode: childrenZonesCode,
          zoneData: newFeature,
        })

        changePageTitle(newFeature.properties.nom)

        flyToBounds(
          getBoundingBoxFromFeature(newFeature),
          viewport,
          setViewport
        )
        break
      case Code.Continent:
        newFeature.properties[zoneCode] === Continent.DROM
          ? displayDROM()
          : displayFrance()
        break
      default:
        break
    }
    resetHoverInfo()
  }

  const handleHover = (e) => {
    const feature = getMouseEventFeature(e)
    if (feature && viewport.zoom < 13) {
      const zoneCode = getZoneCode(feature)
      setHoverInfo({
        filter: ["==", ["get", zoneCode], feature.properties[zoneCode]],
        lngLat: e.lngLat,
        zoneData: feature,
      })
    } else resetHoverInfo()
  }

  const handleClick = (e) => {
    if (e.leftButton) {
      const feature = getMouseEventFeature(e)
      if (feature) {
        const zoneCode = getZoneCode(feature)
        if (zoneCode === Code.Circonscriptions) {
          const deputy = getDeputies(feature, FilteredList)[0]
          if (deputy) navigate(`/depute/${deputy.Slug}`)
        } else {
          displayNewZone(feature)
        }
      }
      resetHoverInfo()
    } else if (e.rightButton) handleBack()
  }

  const handleBack = () => {
    if (currentView.zoneCode === Code.Circonscriptions) {
      const contId = getContinent(currentView.zoneData)
      if (contId === Continent.France) {
        const regionFeature = getZoneFeature(
          currentView.GEOJson.features[0].properties[Code.Regions],
          Code.Regions
        )

        displayNewZone(regionFeature)
      } else displayDROM()
    } else if (currentView.zoneCode === Code.Departements) {
      displayFrance()
    }
  }

  /**
   * Appelé au chargement, permet de target l'object mapbox pour utiliser ses méthodes
   * @param event L'event contient une ref de la map
   */
  const handleLoad = (event: MapLoadEvent) => {
    const map = event.target
    // console.log(map.getStyle().layers)

    //Enlève les frontières
    map.removeLayer("admin-0-boundary") //Les frontières des pays
    map.removeLayer("admin-0-boundary-bg")
    map.removeLayer("admin-1-boundary") //Les frontières des régions
    map.removeLayer("admin-1-boundary-bg")
    map.removeLayer("admin-0-boundary-disputed") //Les frontières contestées

    if (featureToDisplay) displayNewZone(featureToDisplay)
    else flyToBounds(franceBox, viewport, setViewport)
  }

  return (
    <InteractiveMap
      mapboxApiAccessToken="pk.eyJ1Ijoia29iYXJ1IiwiYSI6ImNrMXBhdnV6YjBwcWkzbnJ5NDd5NXpja2sifQ.vvykENe0q1tLZ7G476OC2A"
      mapStyle="mapbox://styles/mapbox/light-v10?optimize=true"
      {...viewport}
      width="100%"
      height="100%"
      minZoom={2}
      dragRotate={false}
      doubleClickZoom={false}
      touchRotate={false}
      interactiveLayerIds={["zone-fill", "zone-ghost-fill"]}
      onLoad={handleLoad}
      onViewportChange={(change) => setViewport(change)}
      onHover={handleHover}
      onClick={handleClick}
    >
      <Source type="geojson" data={currentView.GEOJson}>
        <Layer {...hoverLayerProps} filter={hoverInfo.filter} />
        <Layer {...fillLayerProps} />
        <Layer {...lineLayerProps} />
      </Source>
      <Source type="geojson" data={getGhostZones(currentView.zoneData)}>
        <Layer
          {...hoverLayerProps}
          id="zone-ghost-fill-hovered"
          filter={hoverInfo.filter}
        />
        <Layer {...lineGhostLayerProps} />
        <Layer {...fillGhostLayerProps} />
      </Source>
      {hoverInfo.zoneData && viewport.zoom < 13 ? (
        <MapTooltip
          lngLat={hoverInfo.lngLat}
          zoneFeature={hoverInfo.zoneData}
          deputiesArray={getDeputies(hoverInfo.zoneData, FilteredList)}
          totalDeputes={FilteredList.length}
        />
      ) : null}
      <MapPins viewData={currentView} deputiesList={FilteredList} />
      <div className="map__navigation map__navigation-right">
        <NavigationControl
          showCompass={false}
          zoomInLabel="Zoomer"
          zoomOutLabel="Dézoomer"
        />
        <FullscreenControl />
        <MapButton
          className="visible"
          title="Revenir sur la France métropolitaine"
          onClick={displayFrance}
        >
          <IconFrance />
        </MapButton>
      </div>
      <div className="map__navigation map__navigation-left">
        <MapBreadcrumb
          feature={currentView.zoneData}
          handleClick={displayNewZone}
        />
        <MapButton
          className={currentView.zoneCode === Code.Regions ? "" : "visible"}
          title="Revenir à la vue précédente"
          onClick={handleBack}
        >
          <IconArrow
            style={{
              transform: "rotate(90deg)",
            }}
          />
        </MapButton>
      </div>
      <div
        className={`map__navigation map__navigation-bottom ${
          filterDisplayed ? "" : "visible"
        }`}
      >
        <MapButton
          className="visible"
          title="Afficher les filtres"
          onClick={() => setFilterDisplayed(true)}
        >
          <IconFilter />
        </MapButton>
      </div>
      <div className={`map__filters ${filterDisplayed ? "visible" : ""}`}>
        <CustomControl>
          <Filters />
          <button
            className="map__filters-close"
            onClick={() => setFilterDisplayed(false)}
            title="Cacher les filtres"
          >
            <div className="icon-wrapper">
              <IconClose />
            </div>
          </button>
        </CustomControl>
      </div>
    </InteractiveMap>
  )
}
