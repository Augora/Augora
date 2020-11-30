import React, { useEffect, useState } from "react"
import { Popup } from "react-map-gl"
import { Code, compareFeatures, getDeputies, getZoneCode } from "components/maps/maps-utils"
import DeputyImage from "components/deputy/general-information/deputy-image/DeputyImage"
import orderBy from "lodash/orderBy"
import Tooltip from "components/tooltip/Tooltip"
import GroupBar from "components/deputies-list/GroupBar"
import IconMissing from "images/ui-kit/icon-missingmale.svg"
import useDeputiesFilters from "src/hooks/deputies-filters/useDeputiesFilters"

interface IMapPins {
  features: AugoraMap.Feature[]
  deputies: AugoraMap.DeputiesList
  hoveredFeature?: mapboxgl.MapboxGeoJSONFeature
  handleHover?: (args?: any) => any
  handleClick?: (args?: any) => any
}

interface IMapPin extends Omit<IMapPins, "features" | "hoveredFeature"> {
  feature: AugoraMap.Feature
  coords: AugoraMap.Coordinates
  isHovered?: boolean
}

interface IPinDeputy {
  deputy: AugoraMap.Depute
  feature: AugoraMap.Feature
  isOpen?: boolean
}

interface IPinNumber {
  deputies: AugoraMap.DeputiesList
  feature: AugoraMap.Feature
  isOpen?: boolean
}

/**
 * Renvoie le contenu d'un pin député
 */
function PinDeputy({ deputy, feature, isOpen }: IPinDeputy) {
  return deputy ? (
    <div className={`deputy__visuals ${isOpen ? "deputy__visuals--opened" : ""}`}>
      <DeputyImage src={deputy.URLPhotoAugora} alt={deputy.Nom} sex={deputy.Sexe} />
      {isOpen && (
        <div className="deputy__info">
          <div className="info__circ">{`${feature.properties.nom_dpt} ${feature.properties[Code.Circ]}`}</div>
          <div className="info__separator" />
          <div className="info__name">
            <div>{deputy.Prenom}</div>
            <div>{deputy.NomDeFamille}</div>
          </div>
          <div className="info__separator" style={{ backgroundColor: deputy.GroupeParlementaire.Couleur }} />
          <div className="info__group" style={{ color: deputy.GroupeParlementaire.Couleur }}>
            {deputy.GroupeParlementaire.Sigle}
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className={`deputy__visuals deputy__visuals--missing ${isOpen ? "deputy__visuals--opened" : ""}`}>
      {!isOpen ? (
        <div className="icon-wrapper">
          <IconMissing />
        </div>
      ) : (
        <div className="deputy__info">Pas de député trouvé</div>
      )}
    </div>
  )
}

/**
 * Renvoie le contenu d'un pin nombre
 */
function PinNumber({ deputies, feature, isOpen }: IPinNumber) {
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
 */
export function MapPin(props: IMapPin) {
  const [isOpen, setIsOpen] = useState(props.isHovered)
  const zoneCode = getZoneCode(props.feature)

  useEffect(() => {
    setIsOpen(props.isHovered)
  }, [props.isHovered])

  return (
    <Popup
      className="pins__popup"
      longitude={props.coords[0]}
      latitude={props.coords[1]}
      closeButton={false}
      tipSize={0}
      anchor={"bottom"}
      dynamicPosition={false}
    >
      <div className="pins__container">
        <button
          className="pins__btn"
          onClick={() => props.handleClick(props.feature)}
          onMouseOver={() => {
            props.handleHover(props.feature)
            if (!isOpen) setIsOpen(true)
          }}
          onMouseLeave={() => {
            if (!props.isHovered) setIsOpen(false)
          }}
        />
        {zoneCode === Code.Circ ? (
          <PinDeputy deputy={props.deputies[0]} feature={props.feature} isOpen={isOpen} />
        ) : (
          <PinNumber deputies={props.deputies} feature={props.feature} isOpen={isOpen} />
        )}
        <div
          className="pins__arrowdown"
          style={{
            borderTopColor: props.deputies.length && zoneCode === Code.Circ ? props.deputies[0].GroupeParlementaire.Couleur : "",
          }}
        />
      </div>
    </Popup>
  )
}

/**
 * Renvoie un pin pour chaque zone affichée
 * @param {AugoraMap.Feature[]} features Array des features
 * @param {AugoraMap.DeputiesList} deputies Liste des députés à filtrer
 * @param {Function} handleClick Fonction appelée quand le pin est cliqué
 * @param {Function} handleHover Fonction appelée quand le pin est hover
 */
export default function MapPins(props: IMapPins) {
  return (
    <div className="map__pins">
      {orderBy(props.features, (feat) => feat.properties.center[1], "desc").map((feature, index) => {
        const featureDeputies = getDeputies(feature, props.deputies)

        return (
          <MapPin
            key={`${index}-${getZoneCode(feature)}-${
              feature.properties.nom ? feature.properties.nom : feature.properties.nom_dpt
            }`}
            deputies={featureDeputies}
            feature={feature}
            coords={feature.properties.center}
            handleClick={props.handleClick}
            handleHover={props.handleHover}
            isHovered={compareFeatures(feature, props.hoveredFeature)}
          />
        )
      })}
    </div>
  )
}
