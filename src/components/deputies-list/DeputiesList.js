import React from "react"

import {
  calculateAgeDomain,
  calculateNbDepute,
  groupeIconByGroupeSigle,
} from "./deputies-list-utils"
import useDeputiesFilters from "hooks/deputies-filters/useDeputiesFilters"
import Filters from "./filters/Filters"
import Deputy from "./deputy/Deputy"
import { Tooltip } from "components/tooltip/Tooltip"

const DeputiesList = (props) => {
  const {
    state,
    handleSearchValue,
    handleClickOnAllGroupes,
    handleClickOnGroupe,
    handleClickOnSex,
    handleAgeSelection,
    handleReset,
  } = useDeputiesFilters(props.deputes, props.groupesDetails)

  const groupesData = props.groupesDetails
    .map((groupe) => {
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
    })
    .filter((groupe) => groupe.value !== 0)

  const allGroupes = props.groupesDetails.map((groupe) => {
    return (
      <button
        className={`groupe groupe--${groupe.Sigle} ${
          state.GroupeValue[groupe.Sigle] ? "selected" : ""
        }`}
        key={`groupe--${groupe.Sigle}`}
        onClick={(e) => handleClickOnGroupe(groupe.Sigle, e)}
        style={{ order: groupe.Ordre }}
      >
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
          totalDeputes={props.deputes.length}
          color={groupe.Couleur}
        />
      </button>
    )
  })

  let ages = []
  for (
    let i = calculateAgeDomain(props.deputes)[0];
    i <= calculateAgeDomain(props.deputes)[1];
    i++
  ) {
    ages.push(i)
  }
  const groupesByAge = ages.map((age) => {
    const valueOfDeputesByAge = props.deputes.filter((depute) => {
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
          [groupe + "Color"]: props.groupesDetails.filter(
            (groupeFiltered) => groupeFiltered.Sigle === groupe
          )[0].Couleur,
        })
      }, {})
    return Object.assign(
      {},
      {
        age: age,
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
        groupesDetails={props.groupesDetails}
        deputes={props.deputes}
      />
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
