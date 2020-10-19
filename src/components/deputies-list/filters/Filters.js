import React, { useState, useRef } from "react"

import IconClose from "../../../images/ui-kit/icon-close.svg"
import IconSearch from "../../../images/ui-kit/icon-loupe.svg"
import IconMaleSymbol from "../../../images/ui-kit/icon-male.svg"
import IconFemaleSymbol from "../../../images/ui-kit/icon-female.svg"
import IconReset from "../../../images/ui-kit/icon-refresh.svg"

import AgeSlider from "../slider/Slider"
import Tooltip from "components/tooltip/Tooltip"
import Frame from "components/frames/Frame"
import Button from "components/buttons/Button"

function Filters(props) {
  const [isSearchInteracted, setIsSearchInteracted] = useState(false)
  const searchField = useRef(null)

  return (
    <Frame
      className="frame-filters"
      title="Filtres"
      center={`${props.filteredList.length} ${
        props.filteredList.length > 1 ? "Députés" : "Député"
      }`}
      right={`
        ${
          Math.round(
            ((props.filteredList.length * 100) / props.deputes.length) * 10
          ) / 10
        }%
      `}
    >
      <form
        className={`filters__search ${
          isSearchInteracted ? "filters__search--focus" : ""
        }`}
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
          value={props.keyword}
          onChange={(e) => {
            props.handleSearchValue(e.target.value)
          }}
          onFocus={() => setIsSearchInteracted(true)}
          onBlur={() => setIsSearchInteracted(false)}
        />
        <div
          className={`search__clear ${
            props.keyword.length > 0 ? "search__clear--visible" : ""
          }`}
        >
          <input
            className="search__clear-btn"
            type="reset"
            value=""
            title="Effacer"
            onClick={() => {
              props.handleSearchValue("")
            }}
          />
          <div className="icon-wrapper">
            <IconClose />
          </div>
        </div>
      </form>
      <div className="filters__middle-line">
        <div className="filters__sexes">
          <Button
            className={`sexes__btn female ${
              props.SexValue["F"] ? "checked" : ""
            }`}
            onClick={(e) => props.handleClickOnSex("F")}
            color="main"
            checked={props.SexValue}
          >
            <div className="sexe__icon--female-symbol icon-wrapper">
              <IconFemaleSymbol />
            </div>
            <Tooltip
              title="Femmes"
              nbDeputes={props.calculateNbDepute(
                props.filteredList,
                "sexe",
                "F"
              )}
              totalDeputes={props.filteredList.length}
              color="secondary"
            />
          </Button>
          <Button
            className={`sexes__btn male ${
              props.SexValue["H"] ? "checked" : ""
            }`}
            onClick={(e) => props.handleClickOnSex("H")}
            color="secondary"
            checked={props.SexValue}
          >
            <div className="sexe__icon--male-symbol icon-wrapper">
              <IconMaleSymbol />
            </div>
            <Tooltip
              title="Hommes"
              nbDeputes={props.calculateNbDepute(
                props.filteredList,
                "sexe",
                "H"
              )}
              totalDeputes={props.filteredList.length}
              color="secondary"
            />
          </Button>
        </div>
        <div className="filters__groupe">{props.allGroupes}</div>
        <Button
          className="reset__btn"
          onClick={props.handleReset}
          title="Réinitialiser les filtres"
        >
          <div className="icon-wrapper">
            <IconReset />
          </div>
        </Button>
      </div>
      <AgeSlider
        selectedDomain={props.AgeDomain}
        domain={props.calculateAgeDomain(props.deputes)}
        callback={props.handleAgeSelection}
      >
        <span className="filters__slider-label">ÂGE</span>
      </AgeSlider>
    </Frame>
  )
}

export default Filters
