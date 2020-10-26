import React, { useContext } from "react"
import CustomControl from "components/maps/CustomControl"
import GroupBar from "components/maps/GroupBar"
import Frame from "components/frames/Frame"
import Button from "components/buttons/Button"
import IconReset from "images/ui-kit/icon-refresh.svg"
import IconArrow from "images/ui-kit/icon-arrow.svg"
import { DeputiesListContext } from "context/deputies-filters/deputiesFiltersContext"

interface IMapMiniFilter {
  zoneList: AugoraMap.DeputiesList
  onClick: (args?: any) => any
}

export default function MapMiniFilter({ zoneList, onClick }: IMapMiniFilter) {
  const {
    state: { GroupesList, DeputiesList },
    handleReset,
  } = useContext(DeputiesListContext)

  return (
    <CustomControl>
      <Frame
        className="map__mini-filter"
        title={`${zoneList.length} / ${DeputiesList.length}`}
        right={`
        ${
          Math.round(((zoneList.length * 100) / DeputiesList.length) * 10) / 10
        }%
      `}
      >
        <GroupBar deputiesList={zoneList} groupList={GroupesList} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            className="mini-filter__btn"
            title="Réinitialiser les filtres"
            onClick={() => handleReset()}
          >
            <div className="icon-wrapper">
              <IconReset />
            </div>
          </Button>
          <Button
            className="mini-filter__btn"
            title="Agrandir les filtres"
            onClick={() => onClick()}
          >
            <div className="icon-wrapper">
              <IconArrow
                style={{
                  transform: "rotate(-135deg)",
                  position: "absolute",
                  right: "-10px",
                  top: "-13px",
                }}
              />
            </div>
          </Button>
        </div>
      </Frame>
    </CustomControl>
  )
}
