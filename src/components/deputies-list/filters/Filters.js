import React, { useState } from "react"

import IconOk from "../../../images/ui-kit/icon-ok.svg"
import IconClose from "../../../images/ui-kit/icon-close.svg"
import IconSearch from "../../../images/ui-kit/icon-loupe.svg"
import IconMale from "../../../images/ui-kit/icon-persontie.svg"
import IconMaleSymbol from "../../../images/ui-kit/icon-male.svg"
import IconFemale from "../../../images/ui-kit/icon-personw.svg"
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
  const [isSearchHovered, setIsSearchHovered] = useState(false)

  const handleChartSelection = (event) => {
    setHasPieChart(!HasPieChart)
  }

  return (
    <section
      className="filters"
      style={{ display: "flex", justifyContent: "space-between" }}
    >
      {/* <div className="complex-barchart chart">
            <div className="chart-wrapper">
              <ComplexBarChart
              data={props.groupesByAge}
              ageDomain={props.AgeDomain}
                totalNumberDeputies={props.deputes.length}
                groupesDetails={props.groupesDetails}
                />
            </div>
            <div className="slider-wrapper">
            <AgeSlider
                selectedDomain={props.AgeDomain}
                domain={props.calculateAgeDomain(props.deputes)}
                callback={props.handleAgeSelection}
                />
                </div>
                <p className="axis xValue">Âge</p>
                <p className="axis yValue">Nombre de députés</p>
          </div> */}
      <Frame
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
        {/* <div className="filters__total-results">
          <h2>
            <strong>{props.filteredList.length}</strong> Députés
          </h2>
          <Tooltip
            nbDeputes={props.filteredList.length}
            totalDeputes={props.deputes.length}
            hideNbDeputes={true}
          />
        </div> */}
        <div
          className={`filters__search ${
            isSearchHovered ? "filters__search--focus" : ""
          }`}
        >
          <div className="search__icon icon-wrapper">
            <IconSearch />
          </div>
          <input
            className="search__input"
            type="text"
            placeholder="Chercher..."
            value={props.keyword}
            onChange={(e) => props.handleSearchValue(e.target.value)}
            onMouseEnter={() => setIsSearchHovered(true)}
            onMouseLeave={() => setIsSearchHovered(false)}
          />
        </div>
        <div style={{ display: "flex", marginTop: 20 }}>
          <div className="filters__sexes">
            <button
              className={`sexes__btn sexes_btn--female ${
                props.SexValue["F"] ? "selected" : ""
              }`}
              onClick={(e) => props.handleClickOnSex("F", e)}
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
                totalDeputes={props.deputes.length}
              />
            </button>
            <button
              className={`sexes__btn sexes_btn--male ${
                props.SexValue["H"] ? "selected" : ""
              }`}
              onClick={(e) => props.handleClickOnSex("H", e)}
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
                totalDeputes={props.deputes.length}
              />
            </button>
          </div>
          <div className="filters__groupe">{props.allGroupes}</div>
          <div className="filters__allornone">
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
          </div>
        </div>
        <AgeSlider
          selectedDomain={props.AgeDomain}
          domain={props.calculateAgeDomain(props.deputes)}
          callback={props.handleAgeSelection}
        >
          <span
            style={{
              position: "absolute",
              right: -80,
              top: 16,
              fontWeight: "bold",
            }}
          >
            ÂGE
          </span>
        </AgeSlider>
        <div className="filters__reset">
          <button onClick={props.handleReset}>
            <IconReset />
          </button>
        </div>
      </Frame>
      <Frame className="frame-chart" title="Répartition">
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
                totalNumberDeputies={props.deputes.length}
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
                totalNumberDeputies={props.deputes.length}
                groupesDetails={props.groupesDetails}
              />
            </div>
          )}
        </div>
      </Frame>
    </section>
  )
}

export default Filters
