import React from "react"
import { Popup } from "react-map-gl"
import { Code, getDeputies, getZoneCode } from "components/maps/maps-utils"
import DeputyImage from "components/deputy/general-information/deputy-image/DeputyImage"
import orderBy from "lodash/orderBy"
import Tooltip from "components/tooltip/Tooltip"
import GroupBar from "components/deputies-list/GroupBar"
import useDeputiesFilters from "src/hooks/deputies-filters/useDeputiesFilters"

interface IMapPins {
  features: AugoraMap.Feature[]
  deputiesList: AugoraMap.DeputiesList
  handleHover?: (args?: any) => any
  handleClick?: (args?: any) => any
}

interface IMapPin {
  deputies: AugoraMap.DeputiesList
  feature: AugoraMap.Feature
  coords: AugoraMap.Coordinates
  handleClick?: (args?: any) => any
  handleHover?: (args?: any) => any
}

function MapPin({ deputies, feature, coords, handleClick, handleHover }: IMapPin) {
  const {
    state: { FilteredList },
  } = useDeputiesFilters()

  const zoneCode = getZoneCode(feature)

  return (
    <Popup
      className="pins__popup"
      longitude={coords[0]}
      latitude={coords[1]}
      closeButton={false}
      tipSize={0}
      anchor={"bottom"}
      dynamicPosition={false}
    >
      {zoneCode === Code.Circ ? (
        deputies.length ? (
          <div className="pins__deputy">
            <button className="deputy__btn" onClick={() => handleClick(feature)} onMouseOver={() => handleHover(feature)} />
            <div
              className="deputy__visuals"
              style={{
                borderColor: deputies[0].GroupeParlementaire.Couleur,
                boxShadow: `0px 0px 10px ${deputies[0].GroupeParlementaire.Couleur}`,
              }}
            >
              <DeputyImage src={deputies[0].URLPhotoAugora} alt={deputies[0].Nom} sex={deputies[0].Sexe} />
              <div className="deputy__info">
                <div className="info__circ">{`${feature.properties.nom_dpt} ${feature.properties[Code.Circ]}`}</div>
                <div className="info__separator" />
                <div className="info__name">
                  <div>{deputies[0].Prenom}</div>
                  <div>{deputies[0].NomDeFamille}</div>
                </div>
                <div className="info__separator" style={{ backgroundColor: deputies[0].GroupeParlementaire.Couleur }} />
                <div className="info__group" style={{ color: deputies[0].GroupeParlementaire.Couleur }}>
                  {deputies[0].GroupeParlementaire.Sigle}
                </div>
              </div>
            </div>
            <div
              className="pins__arrowdown arrowdown__deputy"
              style={{ borderTopColor: deputies[0].GroupeParlementaire.Couleur }}
            />
          </div>
        ) : null
      ) : (
        <div className="pins__deputies">
          <button className="deputies__btn" onClick={() => handleClick(feature)} onMouseOver={() => handleHover(feature)} />
          <div className="deputies__visuals">
            <div className="deputies__number">{deputies.length}</div>
            <Tooltip
              className="deputies__info"
              title={feature.properties.nom}
              nbDeputes={deputies.length}
              totalDeputes={FilteredList.length}
            >
              <GroupBar className="map__tooltip-bar" deputiesList={deputies} />
            </Tooltip>
          </div>
          <div className="pins__arrowdown arrowdown__deputies" />
        </div>
      )}
    </Popup>
  )
}

/**
 * Renvoie un pin pour chaque zone affichée
 * @param {AugoraMap.Feature[]} features Array des features
 * @param {AugoraMap.DeputiesList} deputiesList Liste des députés à filtrer
 */
export default function MapPins({ features, deputiesList, handleClick, handleHover }: IMapPins) {
  return (
    <div className="map__pins">
      {orderBy(features, (feat) => feat.properties.center[1], "desc").map((feature, index) => {
        const deputies = getDeputies(feature, deputiesList)

        return (
          <MapPin
            key={`${index}-${getZoneCode(feature)}-${
              feature.properties.nom ? feature.properties.nom : feature.properties.nom_dpt
            }`}
            deputies={deputies}
            feature={feature}
            coords={feature.properties.center}
            handleClick={handleClick}
            handleHover={handleHover}
          />
        )
      })}
    </div>
  )
}
