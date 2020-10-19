import React, { useContext, useState } from "react"

import {
  calculateAgeDomain,
  calculateNbDepute,
  groupeIconByGroupeSigle,
} from "./deputies-list-utils"
import { DeputiesListContext } from "../../context/deputies-filters/deputiesFiltersContext"
import Filters from "./filters/Filters"
import Deputy from "./deputy/Deputy"
import Tooltip from "components/tooltip/Tooltip"
import Input from "components/buttons/Input"
import Frame from "components/frames/Frame"
import PieChart from "./pie-chart/PieChart"
import BarChart from "./bar-chart/BarChart"
import { LazyLoadComponent } from "react-lazy-load-image-component"

const DeputiesList = (props) => {
  const {
    state,
    handleSearchValue,
    handleClickOnAllGroupes,
    handleClickOnGroupe,
    handleClickOnSex,
    handleAgeSelection,
    handleReset,
  } = useContext(DeputiesListContext)
  const [HasPieChart, setHasPieChart] = useState(true)

  const handleChartSelection = (event) => {
    setHasPieChart(!HasPieChart)
  }

  const groupesData = state.GroupesList.map((groupe) => {
    const nbDeputeGroup = calculateNbDepute(
      state.FilteredList,
      "groupe",
      groupe.Sigle
    )
    return Object.assign({
      id: groupe.Sigle,
      label: groupe.NomComplet,
      value: nbDeputeGroup,
      color: groupe.Couleur,
    })
  }).filter((groupe) => groupe.value !== 0)

  const allGroupes = state.GroupesList.map((groupe) => {
    return (
      <Input
        className={`groupe groupe--${groupe.Sigle.toLowerCase()}`}
        key={`groupe--${groupe.Sigle}`}
        style={{
          order: groupe.Ordre,
          borderColor: groupe.Couleur,
          backgroundColor: groupe.Couleur,
        }}
        color={groupe.Couleur}
        onClick={() => handleClickOnGroupe(groupe.Sigle)}
        type="checkbox"
        checked={state.GroupeValue[groupe.Sigle]}
      >
        <div className="groupe__img-container">
          <img
            src={groupeIconByGroupeSigle(groupe.Sigle, false)}
            alt={`Icône groupe parlementaire ${groupe.Sigle}`}
          />
          <img
            src={groupeIconByGroupeSigle(groupe.Sigle, true)}
            alt={`Icône groupe parlementaire ${groupe.Sigle} en couleur`}
          />
        </div>
        <Tooltip
          title={groupe.NomComplet}
          nbDeputes={calculateNbDepute(
            state.FilteredList,
            "groupe",
            groupe.Sigle
          )}
          totalDeputes={state.FilteredList.length}
          color={groupe.Couleur}
        />
      </Input>
    )
  })

  let ages = []
  for (let i = state.AgeDomain[0]; i <= state.AgeDomain[1]; i++) {
    ages.push(i)
  }
  const groupesByAge = ages.map((age) => {
    const valueOfDeputesByAge = state.DeputiesList.filter((depute) => {
      return depute.Age === age
    })
    const groupeValueByAge = () =>
      Object.keys(state.GroupeValue).reduce((acc, groupe) => {
        return Object.assign(acc, {
          [groupe]: valueOfDeputesByAge.filter(
            (depute) => depute.GroupeParlementaire.Sigle === groupe
          ).length,
        })
      }, {})
    const groupeColorByAge = () =>
      Object.keys(state.GroupeValue).reduce((acc, groupe) => {
        return Object.assign(acc, {
          [groupe + "Color"]: state.GroupesList.filter(
            (groupeFiltered) => groupeFiltered.Sigle === groupe
          )[0].Couleur,
        })
      }, {})
    return Object.assign(
      {},
      {
        age: age.toString(),
        ...groupeValueByAge(),
        ...groupeColorByAge(),
      }
    )
  })

  return (
    <>
      <section className="filters">
        <Filters
          handleAgeSelection={handleAgeSelection}
          handleClickOnAllGroupes={handleClickOnAllGroupes}
          handleSearchValue={handleSearchValue}
          handleClickOnSex={handleClickOnSex}
          handleReset={handleReset}
          calculateAgeDomain={calculateAgeDomain}
          calculateNbDepute={calculateNbDepute}
          groupesData={groupesData}
          groupesByAge={groupesByAge}
          AgeDomain={state.AgeDomain}
          allGroupes={allGroupes}
          keyword={state.Keyword}
          SexValue={state.SexValue}
          filteredList={state.FilteredList}
          groupesDetails={state.GroupesList}
          deputes={state.DeputiesList}
        />

        <Frame className="frame-chart" title="Répartition">
          {state.FilteredList.length > 0 ? (
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
                    data={groupesData}
                    filteredDeputies={state.FilteredList.length}
                    groupesDetails={state.GroupesList}
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
                    data={groupesData}
                    filteredDeputies={state.FilteredList.length}
                    groupesDetails={state.GroupesList}
                  />
                </div>
              )}
            </div>
          ) : null}
        </Frame>
      </section>

      <section className="deputies__list">
        {state.FilteredList.length > 0 ? (
          state.FilteredList.map((depute) => {
            return (
              <LazyLoadComponent key={depute.Slug}>
                <Deputy data={depute} />
              </LazyLoadComponent>
            )
          })
        ) : (
          <div className="deputies__no-result">
            Aucun résultat ne correspond à votre recherche
          </div>
        )}
      </section>
    </>
  )
}

export default DeputiesList
