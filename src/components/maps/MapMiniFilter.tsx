import React, { useContext } from "react"
import CustomControl from "components/maps/CustomControl"
import GroupBar from "components/deputies-list/GroupBar"
import Tooltip from "components/tooltip/Tooltip"
import Button from "components/buttons/Button"
import IconReset from "images/ui-kit/icon-refresh.svg"
import { DeputiesListContext } from "context/deputies-filters/deputiesFiltersContext"

interface IMapMiniFilter {
  zoneList: AugoraMap.DeputiesList
  onClick: (args?: any) => any
}

export default function MapMiniFilter({ zoneList, onClick }: IMapMiniFilter) {
  const {
    state: { DeputiesList },
    handleReset,
  } = useContext(DeputiesListContext)

  return (
    <CustomControl>
      <Tooltip className="map__mini-filter">
        <button className="mini-filter__btn" title="Agrandir les filtres" onClick={() => onClick()} />
        <div className="mini-filter__number">{`${zoneList.length} / ${DeputiesList.length}`}</div>
        <GroupBar className="mini-filter__bar" deputiesList={zoneList} />
        <Button className="mini-filter__reset" title="Réinitialiser les filtres" onClick={() => handleReset()}>
          <div className="icon-wrapper">
            <IconReset />
          </div>
        </Button>
      </Tooltip>
    </CustomControl>
  )
}
