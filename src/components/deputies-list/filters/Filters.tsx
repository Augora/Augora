import React, { useState, useRef, useEffect, useCallback } from "react"

import IconClose from "images/ui-kit/icon-close.svg"
import IconSearch from "images/ui-kit/icon-loupe.svg"
import IconMaleSymbol from "images/ui-kit/icon-male.svg"
import IconFemaleSymbol from "images/ui-kit/icon-female.svg"
import IconReset from "images/ui-kit/icon-refresh.svg"

import AgeSlider from "components/deputies-list/slider/Slider"
import Tooltip from "components/tooltip/Tooltip"
import Frame from "components/frames/Frame"
import Button from "components/buttons/Button"
import ButtonInput from "components/buttons/ButtonInput"
import useDeputiesFilters from "hooks/deputies-filters/useDeputiesFilters"
import { getAgeDomain, getNbDeputiesGroup, getNbDeputiesGender, getGroupLogo } from "components/deputies-list/deputies-list-utils"

interface IFilters {
  filteredDeputes?: Deputy.DeputiesList
}

export default function Filters(props: IFilters) {
  const { state, handleSearch, handleGroupClick, handleSexClick, handleAgeSlider, handleReset } = useDeputiesFilters()

  const { filteredDeputes = state.FilteredList } = props

  const [isSearchInteracted, setIsSearchInteracted] = useState(false)
  const [value, setValue] = useState("")
  const searchField = useRef<HTMLInputElement>()

  useEffect(() => {
    setValue(state.Keyword)
  }, [state.Keyword])

  const groupButtons = state.GroupesList.map((groupe) => {
    const GroupeLogo = getGroupLogo(groupe.Sigle)
    return (
      <ButtonInput
        className={`groupe groupe--${groupe.Sigle.toLowerCase()}`}
        key={`groupe--${groupe.Sigle}`}
        style={{
          order: groupe.Ordre,
          borderColor: groupe.Couleur,
          backgroundColor: groupe.Couleur,
        }}
        color={groupe.Couleur}
        onClick={() => handleGroupClick(groupe.Sigle)}
        type="checkbox"
        checked={state.GroupeValue[groupe.Sigle]}
      >
        <div className="groupe__img-container">
          <div className="icon-wrapper">
            <GroupeLogo style={{ fill: groupe.Couleur }} />
          </div>
        </div>
        <Tooltip
          title={groupe.NomComplet}
          nbDeputes={getNbDeputiesGroup(filteredDeputes, groupe.Sigle)}
          totalDeputes={filteredDeputes.length}
          color={groupe.Couleur}
        />
      </ButtonInput>
    )
  })

  /** Pour update les différents states de la recherche */
  const handleTextInput = useCallback((value: string) => {
    handleSearch(value)
    setValue(value)
  }, [])

  return (
    <Frame
      className="frame-filters"
      title="Filtres"
      center={`${filteredDeputes.length} ${filteredDeputes.length > 1 ? "Députés" : "Député"}`}
      right={`
        ${Math.round(((filteredDeputes.length * 100) / state.DeputiesList.length) * 10) / 10}%
      `}
    >
      <form
        className={`filters__search ${isSearchInteracted ? "filters__search--focus" : ""}`}
        onSubmit={(e) => {
          e.preventDefault()
          searchField.current.blur()
        }}
      >
        <div className="search__icon icon-wrapper">
          <IconSearch />
        </div>
        <input
          className="search__input"
          ref={searchField}
          type="text"
          placeholder="Chercher..."
          value={value}
          onChange={(e) => handleTextInput(e.target.value)}
          onFocus={() => setIsSearchInteracted(true)}
          onBlur={() => setIsSearchInteracted(false)}
        />
        <div className={`search__clear ${state.Keyword.length > 0 ? "search__clear--visible" : ""}`}>
          <input className="search__clear-btn" type="reset" value="" title="Effacer" onClick={() => handleTextInput("")} />
          <div className="icon-wrapper">
            <IconClose />
          </div>
        </div>
      </form>
      <div className="filters__middle-line">
        <div className="filters__sexes">
          <Button
            className={`sexes__btn female ${state.SexValue["F"] ? "checked" : ""}`}
            onClick={() => handleSexClick("F")}
            color="main"
            checked={state.SexValue.F}
          >
            <div className="sexe__icon--female-symbol icon-wrapper">
              <IconFemaleSymbol />
            </div>
            <Tooltip
              title="Femmes"
              nbDeputes={getNbDeputiesGender(filteredDeputes, "F")}
              totalDeputes={filteredDeputes.length}
              color="secondary"
            />
          </Button>
          <Button
            className={`sexes__btn male ${state.SexValue["H"] ? "checked" : ""}`}
            onClick={(e) => handleSexClick("H")}
            color="secondary"
            checked={state.SexValue.H}
          >
            <div className="sexe__icon--male-symbol icon-wrapper">
              <IconMaleSymbol />
            </div>
            <Tooltip
              title="Hommes"
              nbDeputes={getNbDeputiesGender(filteredDeputes, "H")}
              totalDeputes={filteredDeputes.length}
              color="secondary"
            />
          </Button>
        </div>
        <div className="filters__groupe">{groupButtons}</div>
        <Button className="reset__btn" onClick={() => handleReset()} title="Réinitialiser les filtres">
          <div className="icon-wrapper">
            <IconReset />
          </div>
        </Button>
      </div>
      <AgeSlider selectedDomain={state.AgeDomain} domain={getAgeDomain(state.DeputiesList)} callback={handleAgeSlider}>
        <span className="filters__slider-label">ÂGE</span>
      </AgeSlider>
    </Frame>
  )
}
