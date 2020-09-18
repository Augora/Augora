import React, { useContext } from "react"

import {
  calculateAgeDomain,
  calculateNbDepute,
  groupeIconByGroupeSigle,
} from "./deputies-list-utils"
import { DeputiesListContext } from "../../context/deputies-filters/deputiesFiltersContext"
import Filters from "./filters/Filters"
import Deputy from "./deputy/Deputy"
import Tooltip from "components/tooltip/Tooltip"

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
      <div
        className={`groupe groupe--${groupe.Sigle} ${
          state.GroupeValue[groupe.Sigle] ? "selected" : ""
        }`}
        key={`groupe--${groupe.Sigle}`}
        style={{ order: groupe.Ordre }}
      >
        <input
          className="groupe__checkbox"
          type="checkbox"
          checked={state.GroupeValue[groupe.Sigle]}
          onChange={(e) => handleClickOnGroupe(groupe.Sigle)}
        />
        <div className="groupe__img-container">
          <img
            src={groupeIconByGroupeSigle(groupe.Sigle)}
            alt={`Icône groupe parlementaire ${groupe.Sigle}`}
          />
        </div>
        <div
          className={`groupe__background-color ${
            state.GroupeValue[groupe.Sigle] ? "selected" : ""
          }`}
          style={{ backgroundColor: groupe.Couleur }}
        ></div>
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
      </div>
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
      {/* <div className="filters__order">Trier par :</div> */}
      <section className="deputies__list">
        {state.FilteredList.length > 0 ? (
          state.FilteredList.map((depute) => {
            return <Deputy key={depute.Slug} data={depute} />
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
