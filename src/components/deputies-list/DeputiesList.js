import React, { useState } from "react"
import "./deputies-list.scss"
// import BarChart from "./BarChart/D3BarChart"
// import PieChart from "./PieChart/D3PieChart"
import { useFuzzy } from "react-use-fuzzy"
import { deburr } from "lodash"
import svgOk from "../../images/ui-kit/iconok.svg"
import svgClose from "../../images/ui-kit/iconclose.svg"

import {
  calculateAgeDomain,
  calculateNbDepute,
  filterList,
  groupesArrayToObject,
  groupeIconByGroupeSigle,
} from "./deputies-list-utils"
import { calculatePercentage } from "utils/math/percentage"
import PieChart from "./pie-chart/PieChart"
import BarChart from "./bar-chart/BarChart"
import ComplexBarChart from "./complexe-bar-chart/ComplexBarChart"
import AgeSlider from "./slider/Slider"
import Deputy from "./deputy/Deputy"

const DeputiesList = (props) => {
  // States
  const [GroupeValue, setGroupeValue] = useState(
    groupesArrayToObject(props.groupesDetails.map((g) => g.Sigle))
  )
  const [SexValue, setSexValue] = useState({
    H: true,
    F: true,
  })
  const [AgeDomain, setAgeDomain] = useState(calculateAgeDomain(props.deputes))
  const [HasPieChart, setHasPieChart] = useState(true)
  const { result, keyword, search } = useFuzzy(
    props.deputes.map((d) =>
      Object.assign({}, d, { NomToSearch: deburr(d.Nom) })
    ),
    {
      keys: ["NomToSearch"],
    }
  )

  const state = {
    SexValue,
    GroupeValue,
    AgeDomain,
  }

  const filteredList = filterList(result, state)

  const groupesData = props.groupesDetails
    .map((groupe) => {
      const nbDeputeGroup = calculateNbDepute(
        filteredList,
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

  // Handlers
  const handleSearchValue = (value) => {
    search(value)
  }

  const handleClickOnAllGroupes = (target, bool) => {
    const allGroupesNewValues = Object.keys(GroupeValue).forEach((groupe) => {
      GroupeValue[groupe] = bool
    })
    setGroupeValue(Object.assign({}, GroupeValue, allGroupesNewValues))
  }

  const handleClickOnGroupe = (sigle, event) => {
    const actualValueOfGroupe = GroupeValue[sigle]
    setGroupeValue(
      Object.assign({}, GroupeValue, {
        [sigle]: !actualValueOfGroupe,
      })
    )
  }

  const handleClickOnSex = (event) => {
    setSexValue(
      Object.assign({}, SexValue, {
        [event.target.name]: event.target.checked,
      })
    )
  }

  const handleReset = () => {
    search("")
    setGroupeValue(groupesArrayToObject(props.groupes))
    setSexValue({ H: true, F: true })
    setAgeDomain(calculateAgeDomain(props.deputes))
  }

  const handleAgeSelection = (domain) => {
    setAgeDomain(domain)
  }

  const handleChartSelection = (event) => {
    setHasPieChart(!HasPieChart)
  }

  const allGroupes = props.groupesDetails.map((groupe) => {
    // const nbDeputeGroup = calculateNbDepute(
    //   filteredList,
    //   "groupe",
    //   groupe.Sigle
    // )
    // const deputePercent =
    //   Math.round(
    //     calculatePercentage(
    //       filteredList.length,
    //       calculateNbDepute(filteredList, "groupe", groupe.Sigle)
    //     ) * 10
    //   ) / 10
    return (
      <button
        className={`groupe groupe--${groupe.Sigle} ${
          GroupeValue[groupe.Sigle] ? "selected" : ""
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
            GroupeValue[groupe.Sigle] ? "selected" : ""
          }`}
          style={{ backgroundColor: groupe.Couleur }}
        ></div>
        {/* <span>
          ({nbDeputeGroup} - {deputePercent}
          %)
        </span> */}
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
      Object.keys(GroupeValue).reduce((acc, groupe) => {
        return Object.assign(acc, {
          [groupe]: valueOfDeputesByAge.filter(
            (depute) => depute.GroupeParlementaire.Sigle === groupe
          ).length,
        })
      }, {})
    const groupeColorByAge = () =>
      Object.keys(GroupeValue).reduce((acc, groupe) => {
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
      <div className="filters">
        <div className="chart-wrapper">
          {HasPieChart ? (
            <div className="piechart chart" onClick={handleChartSelection}>
              <PieChart data={groupesData} />
            </div>
          ) : (
            <div className="barchart chart" onClick={handleChartSelection}>
              <BarChart data={groupesData} />
            </div>
          )}
          <div className="complex-barchart chart">
            <ComplexBarChart data={groupesByAge} ageDomain={AgeDomain} />
            <AgeSlider
              selectedDomain={AgeDomain}
              domain={calculateAgeDomain(props.deputes)}
              callback={handleAgeSelection}
            />
          </div>
        </div>
        <input
          className="filters__search"
          type="text"
          placeholder="Recherche"
          value={keyword}
          onChange={(e) => handleSearchValue(e.target.value)}
        />
        <div className="filters__groupe">
          <div className="groupes__allornone">
            <button onClick={(e) => handleClickOnAllGroupes(e.target, true)}>
              Tous <img className="groupe__svg" src={svgOk} alt="icon ok" />
            </button>
            <button onClick={(e) => handleClickOnAllGroupes(e.target, false)}>
              Aucun{" "}
              <img className="groupe__svg" src={svgClose} alt="icon close" />
            </button>
          </div>
          <br />
          {allGroupes}
        </div>
        <div className="filters__sexes">
          <label>
            Homme(
            {calculateNbDepute(filteredList, "sexe", "H")} /{" "}
            {Math.round(
              calculatePercentage(
                filteredList.length,
                calculateNbDepute(filteredList, "sexe", "H")
              ) * 10
            ) / 10}
            %)
            <input
              className="filters__sexe"
              type="checkbox"
              name="H"
              checked={SexValue.H ? true : false}
              onChange={handleClickOnSex}
            />
          </label>
          <label>
            Femme(
            {calculateNbDepute(filteredList, "sexe", "F")} /{" "}
            {Math.round(
              calculatePercentage(
                filteredList.length,
                calculateNbDepute(filteredList, "sexe", "F")
              ) * 10
            ) / 10}
            %)
            <input
              className="filters__sexe"
              type="checkbox"
              name="F"
              checked={SexValue.F ? true : false}
              onChange={handleClickOnSex}
            />
          </label>
        </div>
        <div className="deputies__number">
          Nombre de député filtrés : {filteredList.length} /{" "}
          {Math.round(
            calculatePercentage(props.deputes.length, filteredList.length) * 10
          ) / 10}
          %
          <br />
          <button onClick={handleReset}>Réinitialiser</button>
        </div>
      </div>
      <ul className="deputies__list">
        {filteredList.map((depute) => {
          return <Deputy key={depute.Slug} data={depute} />
        })}
      </ul>
    </>
  )
}

export default DeputiesList
