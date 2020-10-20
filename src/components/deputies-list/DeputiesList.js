import React, { useContext, useState } from "react"
import { calculateNbDepute } from "./deputies-list-utils"
import { DeputiesListContext } from "../../context/deputies-filters/deputiesFiltersContext"
import Filters from "./filters/Filters"
import Deputy from "./deputy/Deputy"
import Frame from "components/frames/Frame"
import PieChart from "./pie-chart/PieChart"
import BarChart from "./bar-chart/BarChart"
import { LazyLoadComponent } from "react-lazy-load-image-component"

const DeputiesList = (props) => {
  const { state } = useContext(DeputiesListContext)
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

  /**
   * Reliquat de la complex bar chart
   */
  // let ages = []
  // for (let i = state.AgeDomain[0]; i <= state.AgeDomain[1]; i++) {
  //   ages.push(i)
  // }

  // const groupesByAge = ages.map((age) => {
  //   const valueOfDeputesByAge = state.DeputiesList.filter((depute) => {
  //     return depute.Age === age
  //   })
  //   const groupeValueByAge = () =>
  //     Object.keys(state.GroupeValue).reduce((acc, groupe) => {
  //       return Object.assign(acc, {
  //         [groupe]: valueOfDeputesByAge.filter(
  //           (depute) => depute.GroupeParlementaire.Sigle === groupe
  //         ).length,
  //       })
  //     }, {})
  //   const groupeColorByAge = () =>
  //     Object.keys(state.GroupeValue).reduce((acc, groupe) => {
  //       return Object.assign(acc, {
  //         [groupe + "Color"]: state.GroupesList.filter(
  //           (groupeFiltered) => groupeFiltered.Sigle === groupe
  //         )[0].Couleur,
  //       })
  //     }, {})
  //   return Object.assign(
  //     {},
  //     {
  //       age: age.toString(),
  //       ...groupeValueByAge(),
  //       ...groupeColorByAge(),
  //     }
  //   )
  // })

  return (
    <>
      <section className="filters">
        <Filters />
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
