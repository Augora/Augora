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

interface IGroupButton {
  group: Group.Group
  onClick(arg: string): void
  checked?: boolean
  children?: React.ReactNode
}

interface ISexButton {
  sex: "H" | "F"
  onClick(): void
  checked?: boolean
  children?: React.ReactNode
}

interface IResetButton extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  onClick(): void
}

interface ISearchForm {
  keyword?: string
  search?: {
    (arg: string): void
    flush(): void
  }
}

export const ResetButton = (props: IResetButton) => {
  const { onClick, className = "reset__btn", title = "Réinitialiser les filtres", ...restProps } = props

  return (
    <Button className={className} title={title} onClick={() => onClick()} {...restProps}>
      <div className="icon-wrapper">
        <IconReset />
      </div>
    </Button>
  )
}

export const GroupButton = (props: IGroupButton) => {
  const { checked = true, group, onClick, children, ...restProps } = props
  const GroupeLogo = getGroupLogo(group.Sigle)

  return (
    <ButtonInput
      key={`groupe--${group.Sigle}`}
      className={`groupe--${group.Sigle.toLowerCase()}`}
      category="groupe"
      style={{
        order: group.Ordre,
        borderColor: group.Couleur,
        backgroundColor: group.Couleur,
      }}
      color={group.Couleur}
      onClick={() => onClick(group.Sigle)}
      type="checkbox"
      checked={checked}
    >
      <div className="groupe__img-container">
        <div className="icon-wrapper">
          <GroupeLogo style={{ fill: group.Couleur }} />
        </div>
      </div>
      {children}
    </ButtonInput>
  )
}

export const SearchForm = ({ keyword, search }: ISearchForm) => {
  const [isSearchInteracted, setIsSearchInteracted] = useState(false)
  const [value, setValue] = useState("")

  const searchField = useRef<HTMLInputElement>()

  useEffect(() => {
    setValue(keyword)
  }, [keyword])

  /**
   * Pour update les différents states de la recherche
   * @param {string} [value] Reset le state si la valeur manque
   */
  const handleTextInput = search
    ? useCallback((value?: string) => {
        if (value && value.length > 0) {
          search(value)
          setValue(value)
        } else {
          search("")
          search.flush()
          setValue("")
        }
      }, [])
    : setValue

  return (
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
      <div className={`search__clear ${value.length > 0 ? "search__clear--visible" : ""}`}>
        <input className="search__clear-btn" type="reset" value="" title="Effacer" onClick={() => handleTextInput("")} />
        <div className="icon-wrapper">
          <IconClose />
        </div>
      </div>
    </form>
  )
}

export const SexButton = (props: ISexButton) => {
  const { sex, onClick, checked, children } = props
  const gender = sex === "F" ? "female" : "male"

  return (
    <Button
      className={`sexes__btn ${gender} ${checked ? "checked" : ""}`}
      onClick={onClick}
      color={`${sex === "F" ? "main" : "secondary"}`}
    >
      <div className={`sexe__icon--${gender}-symbol icon-wrapper`}>{sex === "F" ? <IconFemaleSymbol /> : <IconMaleSymbol />}</div>
      {children}
    </Button>
  )
}

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
