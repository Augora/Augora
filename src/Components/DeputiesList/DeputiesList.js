import React, { useState } from "react"
import Deputy from "./Deputy/Deputy"
import "./DeputiesList.css"
// import BarChart from "./BarChart/D3BarChart"
import BarChart from "./BarChart/BarChart"
// import PieChart from "./PieChart/D3PieChart"
import PieChart from "./PieChart/PieChart"
import * as moment from "moment"
import AgeSlider from "./Slider/Slider"
import { calculatePercentage } from "Utils/utils"

const couleursGroupeParlementaire = {
  LREM: {
    couleur: "hsl(199, 100%, 58%)",
    nom_complet: "La République En Marche",
  },
  LR: {
    couleur: "hsl(223, 45%, 23%)",
    nom_complet: "Les Républicains",
  },
  MODEM: {
    couleur: "hsl(25, 81%, 54%)",
    nom_complet: "Mouvement Démocrate et apparentés",
  },
  SOC: {
    couleur: "hsl(354, 84%, 43%)",
    nom_complet: "Socialistes et apparentés",
  },
  UAI: {
    couleur: "hsl(194, 81%, 55%)",
    nom_complet: "UDI, Agir et Indépendants",
  },
  LFI: {
    couleur: "hsl(11, 66%, 47%)",
    nom_complet: "La France insoumise",
  },
  GDR: {
    couleur: "hsl(0, 100%, 43%)",
    nom_complet: "Gauche démocrate et républicaine",
  },
  LT: {
    couleur: "hsl(0, 0%, 50%)",
    nom_complet: "Libertés et Territoires",
  },
  NI: {
    couleur: "hsl(0, 0%, 80%)",
    nom_complet: "Non inscrits",
  },
  NG: {
    couleur: "hsl(0, 0%, 80%)",
    nom_complet: "Non inscrits",
  },
  UDI: {
    couleur: "hsl(261, 29%, 48%)",
    nom_complet: "Union des démocrates et indépendants",
  },
}

const calculateNbDepute = (list, type, value, state) => {
  if (list.length > 0) {
    const filteredList = list.filter(depute => {
      return (
        depute.Nom.toLowerCase().search(state.SearchValue.toLowerCase()) !== -1
      )
    })
    switch (type) {
      case "groupe":
        return filteredList
          .filter(depute => {
            return state.SexValue[depute.Sexe] ? true : false
          })
          .filter(depute => {
            return calculateAge(depute) >= state.AgeDomain[0] &&
              calculateAge(depute) <= state.AgeDomain[1]
              ? true
              : false
          })
          .filter(depute => {
            return depute.SigleGroupePolitique === value.groupe ? true : false
          }).length
      case "sexe":
        return filteredList
          .filter(depute => {
            return state.GroupeValue[depute.SigleGroupePolitique] ? true : false
          })
          .filter(depute => {
            return calculateAge(depute) >= state.AgeDomain[0] &&
              calculateAge(depute) <= state.AgeDomain[1]
              ? true
              : false
          })
          .filter(depute => {
            return depute.Sexe === value ? true : false
          }).length
      default:
        return filteredList.length
    }
  } else {
    return list
  }
}
const calculateAge = depute => {
  return parseInt(moment(depute.DateDeNaissance).fromNow(true))
}
const calculateAgeDomain = list => {
  let listAge = []
  list.forEach(depute => {
    listAge.push(calculateAge(depute))
  })
  return [Math.min(...listAge), Math.max(...listAge)]
}

const groupesArrayToObject = (array, value = true) => {
  return array.reduce((a, b) => ((a[b] = value), a), {})
}
const filterList = (list, state) => {
  return list
    .filter(depute => {
      return (
        depute.Nom.toLowerCase().search(state.SearchValue.toLowerCase()) !== -1
      )
    })
    .filter(depute => {
      return state.GroupeValue[depute.SigleGroupePolitique] ? true : false
    })
    .filter(depute => {
      return state.SexValue[depute.Sexe] ? true : false
    })
    .filter(depute => {
      return calculateAge(depute) >= state.AgeDomain[0] &&
        calculateAge(depute) <= state.AgeDomain[1]
        ? true
        : false
    })
}

const DeputiesList = props => {
  // States
  const [SearchValue, setSearchValue] = useState("")
  const [GroupeValue, setGroupeValue] = useState(
    groupesArrayToObject(props.groupes)
  )
  const [SexValue, setSexValue] = useState({
    H: true,
    F: true,
  })
  const [AgeDomain, setAgeDomain] = useState(calculateAgeDomain(props.deputes))
  const state = {
    SearchValue,
    SexValue,
    GroupeValue,
    AgeDomain,
  }

  const groupesData = Object.keys(GroupeValue)
    .filter(groupe => {
      // Retire le groupe "NG" en attendant de savoir quoi en faire
      return groupe === "NG" ? false : true
    })
    .map(groupe => {
      return Object.assign({
        id: groupe,
        label: couleursGroupeParlementaire[groupe].nom_complet,
        value: calculateNbDepute(
          filterList(props.deputes, state),
          "groupe",
          { groupe },
          state
        ),
        percent: calculatePercentage(
          props.deputes.length,
          calculateNbDepute(
            filterList(props.deputes, state),
            "groupe",
            { groupe },
            state
          )
        ),
        color: couleursGroupeParlementaire[groupe].couleur,
      })
    })
    .filter(groupe => groupe.value !== 0)

  // Handlers
  const handleSearchValue = value => {
    setSearchValue(value)
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
    setSearchValue("")
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
      return (
        <label className={`groupe groupe--${groupe}`} key={`groupe--${groupe}`}>
          {groupe}
          <span style={{ display: "block" }}>
            ({calculateNbDepute(props.deputes, "groupe", { groupe }, state)} -{" "}
            {parseInt(
              calculatePercentage(
                props.deputes.length,
                groupesData[indexInData].value
              )
            )}
            %)
          </span>
          <input
            type="checkbox"
            name={groupe}
            checked={GroupeValue[groupe] ? "checked" : ""}
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
          value={SearchValue}
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
            {calculateNbDepute(props.deputes, "sexe", "H", state)}
            )
            <input
              className="filters__sexe"
              type="checkbox"
              name="H"
              checked={SexValue.H ? "checked" : ""}
              onChange={handleClickOnSex}
            />
          </label>
          <label>
            Femme(
            {calculateNbDepute(props.deputes, "sexe", "F", state)}
            )
            <input
              className="filters__sexe"
              type="checkbox"
              name="F"
              checked={SexValue.F ? "checked" : ""}
              onChange={handleClickOnSex}
            />
          </label>
        </div>
        <div className="deputies__number">
          Nombre de député filtrés : {filterList(props.deputes, state).length}
          <br />
          <button onClick={handleReset}>Réinitialiser</button>
        </div>
      </div>
      <ul className="deputies__list">
        {filterList(props.deputes, state).map(depute => {
          return <Deputy key={depute.Slug} data={depute} />
        })}
      </ul>
    </>
  )
}

export default DeputiesList
