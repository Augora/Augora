import React from "react"
import AgeSlider from "components/deputies-list/slider/Slider"
import Tooltip from "components/tooltip/Tooltip"
import Frame from "components/frames/Frame"
import ResetButton from "components/deputies-list/filters/ResetButton"
import GroupButton from "components/deputies-list/filters/GroupButton"
import SexButton from "components/deputies-list/filters/SexButton"
import SearchForm from "components/deputies-list/filters/SearchForm"
import useDeputiesFilters from "hooks/deputies-filters/useDeputiesFilters"
import { getAgeDomain, getNbDeputiesGroup, getNbDeputiesGender } from "components/deputies-list/deputies-list-utils"

interface IFilters {
  filteredDeputes?: Deputy.DeputiesList
}

/**
 * Renvoie le bloc de filtres
 * @param {Deputy.DeputiesList} [filteredDeputes] Liste des députés à utiliser dans le bloc. Si omis, récupère state.FilteredList
 */
export default function Filters(props: IFilters) {
  const { state, handleSearch, handleGroupClick, handleSexClick, handleAgeSlider, handleReset } = useDeputiesFilters()
  const { filteredDeputes = state.FilteredList } = props

  return (
    <Frame
      className="frame-filters"
      title="Filtres"
      center={`${filteredDeputes.length} ${filteredDeputes.length > 1 ? "Députés" : "Député"}`}
      right={`
        ${Math.round(((filteredDeputes.length * 100) / state.DeputiesList.length) * 10) / 10}%
      `}
    >
      <SearchForm keyword={state.Keyword} search={handleSearch} />
      <div className="filters__middle-line">
        <div className="filters__sexes">
          <SexButton sex={"F"} onClick={() => handleSexClick("F")} checked={state.SexValue["F"]}>
            <Tooltip
              title="Femmes"
              nbDeputes={getNbDeputiesGender(filteredDeputes, "F")}
              totalDeputes={filteredDeputes.length}
              color="secondary"
            />
          </SexButton>
          <SexButton sex={"H"} onClick={() => handleSexClick("H")} checked={state.SexValue["H"]}>
            <Tooltip
              title="Hommes"
              nbDeputes={getNbDeputiesGender(filteredDeputes, "H")}
              totalDeputes={filteredDeputes.length}
              color="secondary"
            />
          </SexButton>
        </div>
        <div className="filters__groupe">
          {state.GroupesList.map((groupe) => {
            return (
              <GroupButton
                key={`groupe--${groupe.Sigle}`}
                group={groupe}
                onClick={handleGroupClick}
                checked={state.GroupeValue[groupe.Sigle]}
              >
                <Tooltip
                  title={groupe.NomComplet}
                  nbDeputes={getNbDeputiesGroup(filteredDeputes, groupe.Sigle)}
                  totalDeputes={filteredDeputes.length}
                  color={groupe.Couleur}
                />
              </GroupButton>
            )
          })}
        </div>
        <ResetButton onClick={handleReset} />
      </div>
      <AgeSlider selectedDomain={state.AgeDomain} domain={getAgeDomain(state.DeputiesList)} callback={handleAgeSlider}>
        <span className="filters__slider-label">ÂGE</span>
      </AgeSlider>
    </Frame>
  )
}
