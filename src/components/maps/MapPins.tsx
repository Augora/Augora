import React, { useEffect, useState } from "react"
import { Popup } from "react-map-gl"
import { Code, compareFeatures, getDeputies, getZoneCode, getPolygonCenter } from "components/maps/maps-utils"
import DeputyImage from "components/deputy/general-information/deputy-image/DeputyImage"
import orderBy from "lodash/orderBy"
import Tooltip from "components/tooltip/Tooltip"
import GroupBar from "components/deputies-list/GroupBar"
import IconMissing from "images/ui-kit/icon-missingmale.svg"
import useDeputiesFilters from "src/hooks/deputies-filters/useDeputiesFilters"

interface IMapPins {
  features: AugoraMap.Feature[]
  deputies: Deputy.DeputiesList
  ghostFeatures?: AugoraMap.Feature[]
  hoveredFeature?: mapboxgl.MapboxGeoJSONFeature
  handleHover?: (args?: any) => any
  handleClick?: (args?: any) => any
}

interface IMapPin extends Omit<IMapPins, "features" | "hoveredFeature" | "ghostFeatures"> {
  feature: AugoraMap.Feature
  isExpanded?: boolean
}

interface IMissingContent {
  feature: AugoraMap.Feature
  isOpen?: boolean
}

interface IDeputyContent extends IMissingContent {
  deputy: Deputy.Deputy
}

interface INumberContent extends IMissingContent {
  deputies: Deputy.DeputiesList
}

/**
 * Renvoie le contenu d'un pin député si pas de député trouvé
 */
function MissingContent({ feature, isOpen }: IMissingContent) {
  return (
    <div className={`deputy__visuals deputy__visuals--missing ${isOpen ? "deputy__visuals--opened" : ""}`}>
      <div className="deputy__info">
        <div>{`${feature.properties.nom_dpt} ${feature.properties[Code.Circ]}`}</div>
        <div>Pas de député trouvé</div>
      </div>
    </div>
  )
}

/**
 * Renvoie le contenu d'un pin député
 */
function DeputyContent({ deputy, feature, isOpen }: IDeputyContent) {
  return (
    <div className={`deputy__visuals ${isOpen ? "deputy__visuals--opened" : ""}`}>
      <DeputyImage src={deputy.URLPhotoAugora} alt={deputy.Nom} sex={deputy.Sexe} />
      {isOpen && (
        <div className="deputy__info" style={{ backgroundColor: deputy.GroupeParlementaire.Couleur }}>
          <div className="info__circ">{`${feature.properties.nom_dpt} ${feature.properties[Code.Circ]}`}</div>
          <div className="info__separator" />
          <div className="info__name">
            <div>{deputy.Prenom}</div>
            <div>{deputy.NomDeFamille}</div>
          </div>
          <div className="info__separator" />
          <div className="info__group">{deputy.GroupeParlementaire.Sigle}</div>
        </div>
      )}
    </div>
  )
}

/**
 * Renvoie le contenu d'un pin nombre
 */
function NumberContent({ deputies, feature, isOpen }: INumberContent) {
  const {
    state: { FilteredList },
  } = useDeputiesFilters()

  return (
    <div className={`number__visuals ${isOpen ? "number__visuals--opened" : ""}`}>
      {!isOpen ? (
        <div className="number__number">{deputies.length}</div>
      ) : (
        <Tooltip
          className="number__info"
          title={feature.properties.nom}
          nbDeputes={deputies.length}
          totalDeputes={FilteredList.length}
        >
          <GroupBar className="tooltip__bar" deputiesList={deputies} />
        </Tooltip>
      )}
    </div>
  )
}

/**
 * Render un pin
 * @param {AugoraMap.Feature} feature La feature du pin
 * @param {Deputy.DeputiesList} deputies Les / le député(s) de la feature
 * @param {boolean} [isExpanded] Si le pin est en version expanded ou non. Default: true
 * @param {Function} [handleClick] Le click handler du bouton, optionel
 * @param {Function} [handleHover] Le hover handler du bouton, optionel
 */
export function MapPin(props: IMapPin) {
  const { isExpanded = true } = props

  const zoneCode = getZoneCode(props.feature)
  const coords = props.feature.properties.center ? props.feature.properties.center : getPolygonCenter(props.feature)
  const isHidden = !isExpanded && zoneCode === Code.Circ && props.deputies.length === 0

  return (
    !isHidden && (
      <Popup
        className={`pins__popup ${isExpanded && "pins__popup--expanded"}`}
        longitude={coords[0]}
        latitude={coords[1]}
        closeButton={false}
        tipSize={0}
        anchor={"bottom"}
        dynamicPosition={false}
      >
        <div className="pins__container">
          {props.handleClick || props.handleHover ? (
            <button
              className="pins__btn"
              onClick={() => {
                if (props.handleClick) props.handleClick()
              }}
              onMouseOver={() => {
                if (props.handleHover) props.handleHover()
              }}
            />
          ) : null}
          {zoneCode === Code.Circ ? (
            props.deputies.length > 0 ? (
              <DeputyContent deputy={props.deputies[0]} feature={props.feature} isOpen={isExpanded} />
            ) : (
              <MissingContent feature={props.feature} isOpen={isExpanded} />
            )
          ) : (
            <NumberContent deputies={props.deputies} feature={props.feature} isOpen={isExpanded} />
          )}
          <div
            className="pins__arrowdown"
            style={{
              borderTopColor:
                props.deputies.length && zoneCode === Code.Circ ? props.deputies[0].GroupeParlementaire.Couleur : "",
            }}
          />
        </div>
      </Popup>
    )
  )
}

/**
 * Renvoie un pin pour chaque zone affichée
 * @param {AugoraMap.Feature[]} features Array des features
 * @param {Deputy.DeputiesList} deputies Liste des députés à filtrer
 * @param {mapboxgl.MapboxGeoJSONFeature} hoveredFeature La zone de la map hovered s'il y a actuellement un hover
 * @param {Function} [handleClick] Fonction appelée quand le pin est cliqué
 * @param {Function} [handleHover] Fonction appelée quand le pin est hover
 */
export default function MapPins(props: IMapPins) {
  const activeGhostFeature = props.hoveredFeature
    ? props.ghostFeatures.find((feature) => compareFeatures(feature, props.hoveredFeature))
    : null

  return (
    <div className="map__pins">
      {orderBy(props.features, (feat) => feat.properties.center[1], "desc").map((feature, index) => {
        const featureDeputies = getDeputies(feature, props.deputies)
        const zoneCode = getZoneCode(feature)

        return (
          <MapPin
            key={`${index}-${zoneCode}-${feature.properties.nom ? feature.properties.nom : feature.properties.nom_dpt}`}
            deputies={featureDeputies}
            feature={feature}
            handleClick={() => {
              if (props.handleClick) props.handleClick(feature)
            }}
            handleHover={() => {
              if (props.handleHover) props.handleHover(feature)
            }}
            isExpanded={compareFeatures(feature, props.hoveredFeature)}
          />
        )
      })}
      {activeGhostFeature && <MapPin feature={activeGhostFeature} deputies={getDeputies(activeGhostFeature, props.deputies)} />}
    </div>
  )
}
