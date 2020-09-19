import React, { useState } from "react"

import IconOk from "../../../images/ui-kit/icon-ok.svg"
import IconClose from "../../../images/ui-kit/icon-close.svg"
import IconSearch from "../../../images/ui-kit/icon-loupe.svg"
import IconMaleSymbol from "../../../images/ui-kit/icon-male.svg"
import IconFemaleSymbol from "../../../images/ui-kit/icon-female.svg"
import IconReset from "../../../images/ui-kit/icon-refresh.svg"

import PieChart from "../pie-chart/PieChart"
import BarChart from "../bar-chart/BarChart"
import ComplexBarChart from "../complexe-bar-chart/ComplexBarChart"
import AgeSlider from "../slider/Slider"
import Tooltip from "components/tooltip/Tooltip"
import Frame from "../../frames/Frame"

function Filters(props) {
  const [HasPieChart, setHasPieChart] = useState(true)
  const [isSomethingSearched, setIsSomethingSearched] = useState(false)
  const [isSearchInteracted, setIsSearchInteracted] = useState(false)

  const handleChartSelection = (event) => {
    setHasPieChart(!HasPieChart)
  }

  return (
    <section className="filters">
      {/* <div className="complex-barchart chart">
            <div className="chart-wrapper">
              <ComplexBarChart
              data={props.groupesByAge}
              ageDomain={props.AgeDomain}
                totalNumberDeputies={props.deputes.length}
                groupesDetails={props.groupesDetails}
                />
            </div>*/}
      <Frame
        className="frame-filters"
        title="Filtres"
        center={`${props.filteredList.length} Députés`}
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
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="search__icon icon-wrapper">
            <IconSearch />
          </div>
          <input
            className="search__input"
            type="text"
            placeholder="Chercher..."
            value={props.keyword}
            onChange={(e) => {
              props.handleSearchValue(e.target.value)
              e.target.value.length > 0
                ? setIsSomethingSearched(true)
                : setIsSomethingSearched(false)
            }}
            onFocus={() => setIsSearchInteracted(true)}
            onBlur={() => setIsSearchInteracted(false)}
          />
          <div
            className={`search__clear ${
              isSomethingSearched ? "search__clear--visible" : ""
            }`}
          >
            <input
              className="search__clear-btn"
              type="reset"
              value=""
              title="Effacer"
              onClick={() => {
                props.handleSearchValue("")
                setIsSomethingSearched(false)
              }}
            />
            <div className="icon-wrapper">
              <IconClose />
            </div>
          </div>
        </form>
        <div className="filters__middle-line">
          <div className="filters__sexes">
            <button
              className={`sexes__btn sexes_btn--female ${
                props.SexValue["F"] ? "selected" : ""
              }`}
              onClick={(e) => props.handleClickOnSex("F")}
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
              />
            </button>
            <button
              className={`sexes__btn sexes_btn--male ${
                props.SexValue["H"] ? "selected" : ""
              }`}
              onClick={(e) => props.handleClickOnSex("H")}
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
              />
            </button>
          </div>
          <div className="filters__groupe">{props.allGroupes}</div>
          <div className="filters__reset">
            <button
              onClick={props.handleReset}
              title="Réinitialiser les filtres"
            >
              <IconReset />
            </button>
          </div>

          {/* <div className="filters__allornone">
            <button onClick={() => props.handleClickOnAllGroupes(true)}>
              <div className="icon-wrapper">
                <IconOk />
              </div>
              Tous
            </button>
            <button onClick={() => props.handleClickOnAllGroupes(false)}>
              <div className="icon-wrapper">
                <IconClose />
              </div>
              Aucun
            </button>
          </div> */}
        </div>
        <AgeSlider
          selectedDomain={props.AgeDomain}
          domain={props.calculateAgeDomain(props.deputes)}
          callback={props.handleAgeSelection}
        >
          <span className="filters__slider-label">ÂGE</span>
        </AgeSlider>
      </Frame>
      <Frame className="frame-chart" title="Répartition">
        {props.filteredList.length > 0 ? (
          <div className="filters__charts">
            {HasPieChart ? (
              <div
                className="piechart chart"
                onClick={handleChartSelection}
                onKeyDown={handleChartSelection}
                role="button"
                tabIndex={0}
              >
                <PieChart
                  data={props.groupesData}
                  filteredDeputies={props.filteredList.length}
                  groupesDetails={props.groupesDetails}
                />
              </div>
            ) : (
              <div
                className="barchart chart"
                onClick={handleChartSelection}
                onKeyDown={handleChartSelection}
                role="button"
                tabIndex={0}
              >
                <BarChart
                  data={props.groupesData}
                  filteredDeputies={props.filteredList.length}
                  groupesDetails={props.groupesDetails}
                />
              </div>
            )}
          </div>
        ) : null}
      </Frame>
    </section>
  )
}

export default Filters
