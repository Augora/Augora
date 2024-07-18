import React from "react"
import { Marker, MapboxGeoJSONFeature } from "react-map-gl"
import { Code, compareFeatures, getDeputies, getZoneCode, getPolygonCenter, getZoneName } from "components/maps/maps-utils"
import DeputyImage from "components/deputy/general-information/deputy-image/DeputyImage"
import orderBy from "lodash/orderBy"
import Tooltip from "components/tooltip/Tooltip"
import GroupBar from "components/deputies-list/GroupBar"
import useDeputiesFilters from "src/hooks/deputies-filters/useDeputiesFilters"
import { slugify } from "utils/utils"

interface IMapPins {
  features: AugoraMap.Feature[]
  deputies: Deputy.DeputiesList
  ghostFeatures?: AugoraMap.Feature[]
  hoveredFeature?: MapboxGeoJSONFeature
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

/** Renvoie le contenu d'un pin député si pas de député trouvé */
function MissingContent({ feature, isOpen }: IMissingContent) {
  return (
    <div className={`deputy__visuals deputy__visuals--missing ${isOpen ? "deputy__visuals--opened" : ""}`}>
      {!isOpen ? (
        <div className="missing__image">?</div>
      ) : (
        <div className="deputy__info missing__info">
          <div className="missing__zone">{`${feature.properties.nom_dpt} (${feature.properties[Code.Circ]})`}</div>
          <div className="missing__text">Pas de député trouvé</div>
          <div className="missing__ps">Vérifiez les filtres !</div>
        </div>
      )}
    </div>
  )
}

/** Renvoie le contenu d'un pin député */
function DeputyContent({ deputy, feature, isOpen }: IDeputyContent) {
  return (
    <div className={`deputy__visuals ${isOpen ? "deputy__visuals--opened" : ""}`}>
      <DeputyImage src={deputy.URLPhotoAssembleeNationale} alt={deputy.Nom} sex={deputy.Sexe} />
      {isOpen && (
        <div className="deputy__info" style={{ backgroundColor: deputy.GroupeParlementaire.Couleur }}>
          <div className="info__circ">{`${feature.properties.nom_dpt} (${feature.properties[Code.Circ]})`}</div>
          <div className="info__name">
            <div>{deputy.Prenom}</div>
            <div>{deputy.NomDeFamille}</div>
          </div>
          <div className="info__group">{deputy.GroupeParlementaire.NomComplet}</div>
          {!deputy.GroupeParlementaire.NomComplet.toUpperCase().includes(deputy.RattachementFinancier.toUpperCase()) &&
            deputy.RattachementFinancier !== "Non déclaré(s)" && (
              <div className="info__parti">({deputy.RattachementFinancier})</div>
            )}
        </div>
      )}
    </div>
  )
}

/** Renvoie le contenu d'un pin nombre */
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

  return (
    <Marker longitude={coords[0]} latitude={coords[1]} anchor={"bottom"} style={{ zIndex: isExpanded ? 1 : 0 }}>
      <div className="pins__container">
        {props.handleClick || props.handleHover ? (
          <button
            className="pins__btn"
            aria-label={"Informations"}
            onClick={() => props.handleClick && props.handleClick()}
            onMouseOver={() => props.handleHover && props.handleHover()}
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
            borderTopColor: props.deputies.length && zoneCode === Code.Circ ? props.deputies[0].GroupeParlementaire.Couleur : "",
          }}
        />
      </div>
    </Marker>
  )
}

/**
 * Renvoie un pin pour chaque zone affichée
 * @param {AugoraMap.Feature[]} features Array des features
 * @param {Deputy.DeputiesList} deputies Liste des députés à filtrer
 * @param {MapboxGeoJSONFeature} hoveredFeature La zone de la map hovered s'il y a actuellement un hover
 * @param {Function} [handleClick] Fonction appelée quand le pin est cliqué
 * @param {Function} [handleHover] Fonction appelée quand le pin est hover
 */
export default function MapPins(props: IMapPins) {
  const activeGhostFeature =
    props.hoveredFeature && props.ghostFeatures
      ? props.ghostFeatures.find((feature) => compareFeatures(feature, props.hoveredFeature))
      : null

  return (
    <>
      {orderBy(props.features, (feat) => feat.properties.center[1], "desc").map((feature, index) => {
        const featureDeputies = getDeputies(feature, props.deputies)

        return (
          <MapPin
            key={`pin${feature.properties.nom_dpt ? `-${slugify(feature.properties.nom_dpt)}` : ""}-${slugify(
              getZoneName(feature)
            )}${props.features.length <= 1 ? "-solo" : ""}`}
            deputies={featureDeputies}
            feature={feature}
            handleClick={() => props.handleClick && props.handleClick({ feature: feature })}
            handleHover={() => props.handleHover && props.handleHover(feature)}
            isExpanded={compareFeatures(feature, props.hoveredFeature)}
          />
        )
      })}
      {activeGhostFeature && <MapPin feature={activeGhostFeature} deputies={getDeputies(activeGhostFeature, props.deputies)} />}
    </>
  )
}
