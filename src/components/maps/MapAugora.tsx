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
  setFillPaint,
  setLinePaint,
} from "components/maps/maps-utils"
import MapBreadcrumb from "components/maps/MapBreadcrumb"
import MapInput from "components/maps/MapInput"
import MapPins from "components/maps/MapPins"
import MapFilters from "components/maps/MapFilters"
import IconInfo from "images/ui-kit/icon-info.svg"
import "mapbox-gl/dist/mapbox-gl.css"

interface ICurrentView {
  /** Feature collection des zones principales */
  geoJSON: AugoraMap.FeatureCollection
  /** Feature contenant toutes les zones. Exemple: si on est en vue Pyrénées-Orientales, ce sera l'Occitanie */
  feature: AugoraMap.Feature
  /** Liste des députés de l'ensemble des zones */
  deputies: Deputy.DeputiesList
  /** Objet paint pour les layers. Utilisé pour avoir une couleur dynamique */
  paint: {
    fill: mapboxgl.FillPaint
    line: mapboxgl.LinePaint
  }
  /** Feature collection des zones estompées voisines */
  ghostGeoJSON?: AugoraMap.FeatureCollection
}

interface IMapAugora {
  /** Liste de députés que la map va fouiller. Hint: on peut passer une array avec un seul député pour par exemple une circonscription */
  deputies?: Deputy.DeputiesList
  /** Callback auquel un string "nom de zone" sera passé */
  setPageTitle?: React.Dispatch<React.SetStateAction<string>>
  /** ID continent (0 France, 1 World) */
  codeCont?: number
  /** ID Région */
  codeReg?: number | string
  /** ID Département */
  codeDpt?: number | string
  /** ID Circonscription */
  codeCirc?: number | string
  /** Si les overlays doivent être affichés */
  overlay?: boolean
}

const fillLayerProps: LayerProps = {
  id: "zone-fill",
  type: "fill",
  paint: setFillPaint(),
}

const lineLayerProps: LayerProps = {
  id: "zone-line",
  type: "line",
  paint: setLinePaint(),
}

const fillGhostLayerProps: LayerProps = {
  id: "zone-ghost-fill",
  type: "fill",
  paint: setFillPaint(null, true),
}

const lineGhostLayerProps: LayerProps = {
  id: "zone-ghost-line",
  type: "line",
  paint: {
    ...setLinePaint(),
    // "line-dasharray": [2, 2],
    "line-opacity": 0.2,
  },
}

/**
 * Renvoie la map augora, reçoit un code d'affichage, 2 (Dpt, Circ) s'il s'agit d'une circonscription. Si plusieurs sont fournis, ils seront pris en compte dans l'ordre circonscription > département > région > continent
 * @param {Deputy.DeputiesList} [deputies] Liste des députés à afficher sur la map
 * @param {Function} [setPageTitle] setState callback pour changer le titre de la page
 * @param {number} [codeCont] Code de continent à afficher
 * @param {number | string} [codeReg] Code de région à afficher
 * @param {number | string} [codeDpt] Code de département à afficher
 * @param {number | string} [codeCirc] Code de circonscription à afficher
 * @param {boolean} [overlay] S'il faut afficher les overlay ou pas, default = true
 */
export default function MapAugora(props: IMapAugora) {
  /** Default props */
  const { overlay = true, deputies = [] } = props

  /** useStates */
  const [viewport, setViewport] = useState<ViewportProps>({
    zoom: 5,
    longitude: France.center.lng,
    latitude: France.center.lat,
  })
  const [currentView, setCurrentView] = useState<ICurrentView>({
    geoJSON: getChildFeatures(MetroFeature),
    feature: MetroFeature,
    deputies: getDeputies(MetroFeature, deputies),
    paint: {
      fill: setFillPaint(),
      line: setLinePaint(),
    },
  })
  const [hover, setHover] = useState<mapboxgl.MapboxGeoJSONFeature>(null)
  const [inExploreMode, setInExploreMode] = useState(false)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  /** useEffects */
  useEffect(() => {
    if (isMapLoaded) {
      if (props.codeCirc) {
        displayZone(getFeature(props.codeCirc, Code.Circ, props.codeDpt))
      } else if (props.codeDpt) {
        displayZone(getFeature(props.codeDpt, Code.Dpt))
      } else if (props.codeReg) {
        displayZone(getFeature(props.codeReg, Code.Reg))
      } else if (props.codeCont !== undefined) {
        displayZone(getFeature(props.codeCont, Code.Cont))
      }
    }
  }, [props.codeCont, props.codeReg, props.codeDpt, props.codeCirc, isMapLoaded])

  useEffect(() => {
    renderZone(currentView.feature)
  }, [deputies])

  /** useRefs */
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
          router.push(`/carte?cont=${feature.properties[Code.Cont]}`, `/carte?cont=${feature.properties[Code.Cont]}`, {
            shallow: true,
          })
          return
        case Code.Reg:
          router.push(`/carte?reg=${feature.properties[Code.Reg]}`, `/carte?reg=${feature.properties[Code.Reg]}`, {
            shallow: true,
          })
          return
        case Code.Dpt:
          router.push(`/carte?dpt=${feature.properties[Code.Dpt]}`, `/carte?dpt=${feature.properties[Code.Dpt]}`, {
            shallow: true,
          })
          return
        case Code.Circ:
          router.push(
            `/carte?dpt=${feature.properties[Code.Dpt]}&circ=${feature.properties[Code.Circ]}`,
            `/carte?dpt=${feature.properties[Code.Dpt]}&circ=${feature.properties[Code.Circ]}`,
            {
              shallow: true,
            }
          )
          return
        default:
          console.error("Feature à afficher non valide")
          return
      }
    } else if (zoneCode === Code.Circ) {
      const deputy = currentView.deputies[0]
      if (deputy) {
        router.push(`/depute/${deputy.Slug}`, `/depute/${deputy.Slug}`, {
          shallow: true,
        })
      }
    } else flyToFeature(feature)
  }

  /**
   * Affiche une nouvelle vue et transitionne, sans changer l'url, ne pas utiliser directement
   * @param {AugoraMap.Feature} feature La feature de la zone à afficher
   */
  const displayZone = (feature: AugoraMap.Feature) => {
    if (feature) {
      renderZone(feature)
      if (props.setPageTitle) {
        if (feature.properties.nom) props.setPageTitle(feature.properties.nom)
        else props.setPageTitle(`${feature.properties.nom_dpt} ${feature.properties.code_circ}`)
      }
      flyToFeature(feature)
      renderHover()
    } else console.error("Zone à afficher non trouvée")
  }

  /**
   * Change / update le state de la vue actuelle sans aucune transition
   * @param {AugoraMap.Feature} feature La feature de la zone à afficher
   */
  const renderZone = (feature: AugoraMap.Feature) => {
    const zoneCode = getZoneCode(feature)
    switch (zoneCode) {
      case Code.Circ:
        const deputy = getDeputies(feature, deputies)
        const groupColor = deputy[0]?.GroupeParlementaire?.Couleur

        setCurrentView({
          geoJSON: createFeatureCollection([feature]),
          feature: feature,
          deputies: deputy,
          paint: groupColor
            ? {
                fill: setFillPaint(groupColor),
                line: setLinePaint(groupColor),
              }
            : {
                fill: setFillPaint("#808080"),
                line: setLinePaint("#808080"),
              },
        })
        break
      case Code.Dpt:
      case Code.Reg:
      case Code.Cont:
        setCurrentView({
          geoJSON: getChildFeatures(feature),
          feature: feature,
          deputies: getDeputies(feature, deputies),
          paint: {
            fill: setFillPaint(),
            line: setLinePaint(),
          },
          ghostGeoJSON: getGhostZones(feature),
        })
        break
      default:
        break
    }
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
        <Layer {...lineLayerProps} paint={currentView.paint.line} />
        <Layer {...fillLayerProps} paint={currentView.paint.fill} layout={inExploreMode ? { visibility: "none" } : {}} />
      </Source>
      {currentView.ghostGeoJSON && (
        <Source type="geojson" data={currentView.ghostGeoJSON} generateId={true}>
          <Layer {...lineGhostLayerProps} />
          <Layer {...fillGhostLayerProps} layout={inExploreMode ? { visibility: "none" } : {}} />
        </Source>
      )}
      {overlay && (
        <>
          {!inExploreMode && isMapLoaded && (
            <MapPins
              features={currentView.geoJSON.features}
              ghostFeatures={currentView.ghostGeoJSON ? currentView.ghostGeoJSON.features : null}
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
              <MapBreadcrumb feature={currentView.feature} handleClick={changeZone} />
            </div>
            <div className="navigation__bottom">
              <MapFilters zoneDeputies={currentView.deputies} />
            </div>
          </div>
        </>
      )}
    </InteractiveMap>
  )
}
