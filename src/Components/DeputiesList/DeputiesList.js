import React, { useState } from "react"
import Deputy from "./Deputy/Deputy"
import "./DeputiesList.css"
// import BarChart from "./BarChart/D3BarChart"
import BarChart from "./BarChart/BarChart"
// import PieChart from "./PieChart/D3PieChart"
import PieChart from "./PieChart/PieChart"
import AgeSlider from "./Slider/Slider"
import { calculatePercentage } from "Utils/utils"
import { useFuzzy } from 'react-use-fuzzy';

import {
  couleursGroupeParlementaire,
  calculateAgeDomain,
  calculateNbDepute,
  filterList,
  groupesArrayToObject
} from './DeputiesListUtils'

const DeputiesList = props => {
  // States
  const [GroupeValue, setGroupeValue] = useState(
    groupesArrayToObject(props.groupes)
  )
  const [SexValue, setSexValue] = useState({
    H: true,
    F: true,
  })
  const [AgeDomain, setAgeDomain] = useState(calculateAgeDomain(props.deputes))
  const { result, keyword, search } = useFuzzy(props.deputes, {
    keys: ['Nom'],
  });

  const state = {
    SexValue,
    GroupeValue,
    AgeDomain,
  }

  const filteredList = filterList(result, state)

  const groupesData = Object.keys(GroupeValue)
    .filter(groupe => {
      // Retire le groupe "NG" en attendant de savoir quoi en faire
      return groupe === "NG" ? false : true
    })
    .map(groupe => {
      const nbDeputeGroup = calculateNbDepute(
        filteredList,
        "groupe",
        { groupe }
      )
      return Object.assign({
        id: groupe,
        label: couleursGroupeParlementaire[groupe].nom_complet,
        value: nbDeputeGroup,
        percent: calculatePercentage(
          props.deputes.length,
          nbDeputeGroup
        ),
        color: couleursGroupeParlementaire[groupe].couleur,
      })
    })
    .filter(groupe => groupe.value !== 0)

  // Handlers
  const handleSearchValue = value => {
    search(value)
  }

  const handleClickOnAllGroupes = (target, bool) => {
    const allGroupesNewValues = Object.keys(GroupeValue).forEach(groupe => {
      GroupeValue[groupe] = bool
    })
    setGroupeValue(Object.assign({}, GroupeValue, allGroupesNewValues))
  }

  const handleClickOnGroupe = event => {
    setGroupeValue(
      Object.assign({}, GroupeValue, {
        [event.target.name]: event.target.checked,
      })
    )
  }

  const handleClickOnSex = event => {
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

  const handleAgeSelection = domain => {
    setAgeDomain(domain)
  }

  console.log(groupesData)

  const allGroupes = Object.keys(GroupeValue)
    .filter(groupe => groupe !== "NG")
    .map(groupe => {
      const indexInData = groupesData.findIndex(
        element => element.id === groupe
      )
      const nbDeputeGroup = calculateNbDepute(filteredList, "groupe", { groupe })
      const percentDeputeGroup = groupesData[indexInData] ? parseInt(groupesData[indexInData].percent) : 0
      return (
        <label className={`groupe groupe--${groupe}`} key={`groupe--${groupe}`}>
          {groupe}
          <span style={{ display: "block" }}>
            ({nbDeputeGroup} - {percentDeputeGroup}%)
          </span>
          <input
            type="checkbox"
            name={groupe}
            checked={GroupeValue[groupe] ? true : false}
            onChange={handleClickOnGroupe}
          />
        </label>
      )
    })

  return (
    <>
      <div className="filters">
        <div className="chart-wrapper">
          <div className="piechart chart">
            <PieChart data={groupesData} />
          </div>
          <div className="barchart chart">
            <BarChart data={groupesData} />
          </div>
        </div>
        <AgeSlider
          selectedDomain={AgeDomain}
          domain={calculateAgeDomain(props.deputes)}
          callback={handleAgeSelection}
        />
        <input
          className="filters__search"
          type="text"
          placeholder="Recherche"
          value={keyword}
          onChange={e => handleSearchValue(e.target.value)}
        />
        <div className="filters__groupe">
          <div className="groupes__allornone">
            <button onClick={e => handleClickOnAllGroupes(e.target, true)}>
              Tous
            </button>
            <button onClick={e => handleClickOnAllGroupes(e.target, false)}>
              Aucun
            </button>
          </div>
          <br />
          {allGroupes}
        </div>
        <div className="filters__sexes">
          <label>
            Homme(
            {calculateNbDepute(filteredList, "sexe", "H")}
            )
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
            {calculateNbDepute(filteredList, "sexe", "F")}
            )
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
          Nombre de député filtrés : {filteredList.length}
          <br />
          <button onClick={handleReset}>Réinitialiser</button>
        </div>
      </div>
      <ul className="deputies__list">
        {filteredList.map(depute => {
          return <Deputy key={depute.Slug} data={depute} />
        })}
      </ul>
    </>
  )
}

export default DeputiesList
