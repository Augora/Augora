import React, { useState } from "react"
import CustomControl from "components/maps/CustomControl"
import GroupBar from "components/deputies-list/GroupBar"
import Tooltip from "components/tooltip/Tooltip"
import Filters from "components//deputies-list/filters/Filters"
import Button from "components/buttons/Button"
import IconReset from "images/ui-kit/icon-refresh.svg"
import IconClose from "images/ui-kit/icon-close.svg"
import useDeputiesFilters from "src/hooks/deputies-filters/useDeputiesFilters"

interface IMapFilters {
  zoneDeputies: Deputy.DeputiesList
}

/**
 * Renvoie le mini filtre et filtre qui s'intervertissent au clic
 * @param {Deputy.DeputiesList} zoneDeputies La liste de députés dans la zone visible actuellement
 */
export default function MapFilters({ zoneDeputies }: IMapFilters) {
  const [isBigFilter, setIsBigFilter] = useState(false)

  const {
    state: { DeputiesList },
    handleReset,
  } = useDeputiesFilters()

  return (
    <CustomControl className="map__filters">
      {!isBigFilter ? (
        <Tooltip className="filters__mini">
          <button className="mini__btn" title="Agrandir les filtres" onClick={() => setIsBigFilter(true)} />
          <div className="mini__number">{`${zoneDeputies.length} / ${DeputiesList.length}`}</div>
          <GroupBar className="mini__bar" deputiesList={zoneDeputies} />
          <Button className="mini__reset" title="Réinitialiser les filtres" onClick={() => handleReset()}>
            <div className="icon-wrapper">
              <IconReset />
            </div>
          </Button>
        </Tooltip>
      ) : (
        <div className="filters">
          <Filters filteredDeputes={zoneDeputies} />
          <button className="big__close" onClick={() => setIsBigFilter(false)} title="Cacher les filtres">
            <div className="icon-wrapper">
              <IconClose />
            </div>
          </button>
        </div>
      )}
    </CustomControl>
  )
}
