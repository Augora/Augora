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
import { Tooltip } from "components/tooltip/Tooltip"

function Filters(props) {
  const [HasPieChart, setHasPieChart] = useState(true)

  const handleChartSelection = (event) => {
    setHasPieChart(!HasPieChart)
  }

  return (
    <div className="filters">
      <section className="filters__line filters__line--charts">
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
          <div className="complex-barchart chart">
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
          </div>
        </div>
      </section>
      <section className="filters__line filters__line--groupe">
        <div className="filters__groupe">
          <div className="groupes__allornone">
            <button onClick={() => props.handleClickOnAllGroupes(true)}>
              Tous
              <div
                className="icon-wrapper"
                style={{
                  pointerEvents: `none`,
                  width: 12,
                  height: 12,
                  margin: `0 0 0 5px`,
                }}
              >
                <IconOk />
              </div>
            </button>
            <button onClick={() => props.handleClickOnAllGroupes(false)}>
              Aucun
              <div
                className="icon-wrapper"
                style={{
                  pointerEvents: `none`,
                  width: 12,
                  margin: `0 0 0 5px`,
                }}
              >
                <IconClose />
              </div>
            </button>
          </div>
          <br />
          {props.allGroupes}
        </div>
      </section>
      <section className="filters__line filters__line--advanced">
        <div className="filters__search">
          <div className="search__icon icon-wrapper">
            <IconSearch />
          </div>
          <input
            className="search__input"
            type="text"
            placeholder="Chercher..."
            value={props.keyword}
            onChange={(e) => props.handleSearchValue(e.target.value)}
          />
        </div>
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
            <div className="sexe__icon--female icon-wrapper">
              <IconFemale />
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
          <div className="filters__total-results">
            <h2>
              <strong>{props.filteredList.length}</strong> Députés
            </h2>
            <Tooltip
              nbDeputes={props.filteredList.length}
              totalDeputes={props.deputes.length}
              hideNbDeputes={true}
            />
          </div>
          <button
            className={`sexes__btn sexes_btn--male ${
              props.SexValue["H"] ? "selected" : ""
            }`}
            onClick={(e) => props.handleClickOnSex("H", e)}
          >
            <div className="sexe__icon--male icon-wrapper">
              <IconMale />
            </div>
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
        <div className="filters__reset">
          <button onClick={props.handleReset}>
            Réinitialiser les filtres <IconReset />
          </button>
        </div>
        {/* <div className="filters__order">Trier par :</div> */}
      </section>
    </div>
  )
}

export default Filters
