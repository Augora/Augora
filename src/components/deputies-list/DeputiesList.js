import React, { useState } from "react"
import "./deputies-list.scss"
// import BarChart from "./BarChart/D3BarChart"
// import PieChart from "./PieChart/D3PieChart"
import { useFuzzy } from "react-use-fuzzy"
import { deburr } from "lodash"
import IconOk from "../../images/ui-kit/iconok.svg"
import IconClose from "../../images/ui-kit/iconclose.svg"
import IconSearch from "../../images/ui-kit/iconloupe.svg"
import IconMale from "../../images/ui-kit/iconpersontie.svg"
import IconMaleSymbol from "../../images/ui-kit/iconmale.svg"
import IconFemale from "../../images/ui-kit/iconpersonw.svg"
import IconFemaleSymbol from "../../images/ui-kit/iconfemale.svg"
import IconReset from "../../images/ui-kit/iconrefresh.svg"

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

  const handleClickOnSex = (clickedSex, event) => {
    // setSexValue(
    //   Object.assign({}, SexValue, {
    //     [event.target.name]: event.target.checked,
    //   })
    // )
    const actualValueOfSex = SexValue[clickedSex]
    setSexValue(
      Object.assign({}, SexValue, {
        [clickedSex]: !actualValueOfSex,
      })
    )
  }

  const handleReset = () => {
    search("")
    setGroupeValue(
      groupesArrayToObject(props.groupesDetails.map((g) => g.Sigle))
    )
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
        <section className="filters__line filters__line--charts">
          <div className="filters__charts">
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
              <ComplexBarChart
                data={groupesByAge}
                ageDomain={AgeDomain}
                totalNumberDeputies={props.deputes.length}
              />
              <AgeSlider
                selectedDomain={AgeDomain}
                domain={calculateAgeDomain(props.deputes)}
                callback={handleAgeSelection}
              />
            </div>
          </div>
        </section>
        <section className="filters__line filters__line--groupe">
          <div className="filters__groupe">
            <div className="groupes__allornone">
              <button onClick={(e) => handleClickOnAllGroupes(e.target, true)}>
                Tous
                <div
                  className="icon-wrapper"
                  style={{
                    pointerEvents: `none`,
                    width: 12,
                    height: 12,
                    opacity: `0.5`,
                    margin: `0 0 0 5px`,
                  }}
                >
                  <IconOk />
                </div>
              </button>
              <button onClick={(e) => handleClickOnAllGroupes(e.target, false)}>
                Aucun{" "}
                <div
                  className="icon-wrapper"
                  style={{
                    pointerEvents: `none`,
                    width: 12,
                    opacity: `0.5`,
                    margin: `0 0 0 5px`,
                  }}
                >
                  <IconClose />
                </div>
              </button>
            </div>
            <br />
            {allGroupes}
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
              value={keyword}
              onChange={(e) => handleSearchValue(e.target.value)}
            />
          </div>
          <div className="filters__sexes">
            <button
              className={`sexes__btn sexes_btn--female ${
                SexValue["F"] ? "selected" : ""
              }`}
              onClick={(e) => handleClickOnSex("F", e)}
            >
              <div className="sexe__icon--female-symbol icon-wrapper">
                <IconFemaleSymbol />
              </div>
              <div className="sexe__icon--female icon-wrapper">
                <IconFemale />
              </div>
              <div className="sexe__tooltip">
                <h2>Femmes</h2>
                <p className="sexe__numbers">
                  <div className="sexe__number">
                    <strong>
                      {calculateNbDepute(filteredList, "sexe", "F")}
                    </strong>{" "}
                    Députés
                  </div>
                  <div className="sexe__percentage">
                    {Math.round(
                      calculatePercentage(
                        filteredList.length,
                        calculateNbDepute(filteredList, "sexe", "F")
                      ) * 10
                    ) / 10}
                    %
                  </div>
                </p>
              </div>
            </button>
            <div className="filters__total-results">
              <h2>
                <strong>{filteredList.length}</strong> Députés
              </h2>
              <div className="total-results__tooltip">
                {Math.round(
                  calculatePercentage(
                    props.deputes.length,
                    filteredList.length
                  ) * 10
                ) / 10}
                %
              </div>
            </div>
            <button
              className={`sexes__btn sexes_btn--male ${
                SexValue["H"] ? "selected" : ""
              }`}
              onClick={(e) => handleClickOnSex("H", e)}
            >
              <div className="sexe__icon--male icon-wrapper">
                <IconMale />
              </div>
              <div className="sexe__icon--male-symbol icon-wrapper">
                <IconMaleSymbol />
              </div>
              <div className="sexe__tooltip">
                <h2>Hommes</h2>
                <p className="sexe__numbers">
                  <div className="sexe__number">
                    <strong>
                      {calculateNbDepute(filteredList, "sexe", "H")}
                    </strong>{" "}
                    Députés
                  </div>
                  <div className="sexe__percentage">
                    {Math.round(
                      calculatePercentage(
                        filteredList.length,
                        calculateNbDepute(filteredList, "sexe", "H")
                      ) * 10
                    ) / 10}
                    %
                  </div>
                </p>
              </div>
            </button>
          </div>
          <div className="filters__order">Trier par :</div>
        </section>
        <section className="filters__line filters__line--reset">
          <div className="filters__reset">
            <button onClick={handleReset}>
              Réinitialiser les filtres <IconReset />
            </button>
          </div>
        </section>
      </div>
      <section className="deputies__list">
        {filteredList.length > 0 ? (
          filteredList.map((depute) => {
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
