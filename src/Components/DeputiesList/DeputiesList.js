import React, { useState } from "react"
import Deputy from "./Deputy/Deputy"
import "./DeputiesList.css"
// import BarChart from "./BarChart/BarChart"
// import PieChart from "./PieChart/PieChart"

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
  const filteredList = list.filter(depute => {
    return (
      depute.Nom.toLowerCase().search(state.s_searchValue.toLowerCase()) !== -1
    )
  })
  switch (type) {
    case "groupe":
      return filteredList
        .filter(depute => {
          return state.s_sex[depute.Sexe] ? true : false
        })
        .filter(depute => {
          return depute.SigleGroupePolitique === value.groupe ? true : false
        }).length
    case "sexe":
      return filteredList
        .filter(depute => {
          return state.s_groupeValue[depute.SigleGroupePolitique] ? true : false
        })
        .filter(depute => {
          return depute.Sexe === value ? true : false
        }).length
    default:
      return filteredList.length
  }
}
// const calculateByGroupe = (list, groupe) => {
//   const filteredList = list.filter(depute => {
//     return depute.SigleGroupePolitique === groupe ? true : false
//   })
//   return filteredList.length
// }

const groupesArrayToObject = array => {
  return array.reduce((a, b) => ((a[b] = true), a), {})
}

const DeputiesList = props => {
  const [s_searchValue, setSearchValue] = useState("")
  const [s_groupeValue, setGroupeValue] = useState(
    groupesArrayToObject(props.data.GroupesParlementaires)
  )
  // const [s_groupes, setGroupes] = useState(
  //   initialGroupes.map(groupe => {
  //     return Object.assign({
  //       name: groupe,
  //       value: true,
  //       number: calculateByGroupe(props.data, groupe),
  //       color: couleursGroupeParlementaire[groupe],
  //     })
  //   })
  // )
  const [s_sex, setSex] = useState({
    H: true,
    F: true,
  })
  const listDeputies = props.data.Deputes.data

  const groupesData = Object.keys(s_groupeValue).map(groupe => {
    return Object.assign(
      {},
      {
        name: groupe,
        value: s_groupeValue[groupe],
        number: calculateNbDepute(
          listDeputies,
          "groupe",
          { groupe },
          { s_searchValue, s_sex, s_groupeValue }
        ),
        color: couleursGroupeParlementaire[groupe],
      }
    )
  })

  const handleSearchValue = value => {
    setSearchValue(value)
  }
  const handleClickOnAllGroupes = (target, bool) => {
    const allGroupesNewValues = Object.keys(s_groupeValue).forEach(groupe => {
      s_groupeValue[groupe] = bool
    })
    setGroupeValue(Object.assign({}, s_groupeValue, allGroupesNewValues))
  }
  const handleClickOnGroupe = event => {
    setGroupeValue(
      Object.assign({}, s_groupeValue, {
        [event.target.name]: event.target.checked,
      })
    )
  }
  const handleClickOnSex = event => {
    setSex(
      Object.assign({}, s_sex, {
        [event.target.name]: event.target.checked,
      })
    )
  }
  const handleReset = even => {
    setSearchValue("")
    setGroupeValue(groupesArrayToObject(props.data.GroupesParlementaires))
    setSex({ H: true, F: true })
  }

  const allGroupes = Object.keys(s_groupeValue).map(groupe => {
    return (
      <label className={`groupe groupe--${groupe}`} key={`groupe--${groupe}`}>
        {groupe}(
        {calculateNbDepute(
          listDeputies,
          "groupe",
          { groupe },
          { s_searchValue, s_sex, s_groupeValue }
        )}
        )
        <input
          type="checkbox"
          name={groupe}
          checked={s_groupeValue[groupe] ? "checked" : ""}
          onChange={handleClickOnGroupe}
        />
      </label>
    )
  })

  const filteredList = () => {
    return listDeputies
      .filter(depute => {
        return (
          depute.Nom.toLowerCase().search(s_searchValue.toLowerCase()) !== -1
        )
      })
      .filter(depute => {
        return s_groupeValue[depute.SigleGroupePolitique] ? true : false
      })
      .filter(depute => {
        return s_sex[depute.Sexe] ? true : false
      })
      .map(depute => {
        return <Deputy key={depute.Slug} data={depute} />
      })
  }

  return (
    <>
      {/* <PieChart data={groupesData} width={450} height={450} /> */}
      {/* <BarChart data={groupesData} width={450} height={200} /> */}
      <div className="filters">
        <input
          className="filters__search"
          type="text"
          placeholder="Recherche"
          value={s_searchValue}
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
            {calculateNbDepute(listDeputies, "sexe", "H", {
              s_searchValue,
              s_sex,
              s_groupeValue,
            })}
            )
            <input
              className="filters__sexe"
              type="checkbox"
              name="H"
              checked={s_sex.H ? "checked" : ""}
              onChange={handleClickOnSex}
            />
          </label>
          <label>
            Femme(
            {calculateNbDepute(listDeputies, "sexe", "F", {
              s_searchValue,
              s_sex,
              s_groupeValue,
            })}
            )
            <input
              className="filters__sexe"
              type="checkbox"
              name="F"
              checked={s_sex.F ? "checked" : ""}
              onChange={handleClickOnSex}
            />
          </label>
        </div>
        <div className="deputies__number">
          Nombre de député filtrés : {filteredList().length}
          <br />
          <button onClick={handleReset}>Réinitialiser</button>
        </div>
      </div>
      <ul className="deputies__list">{filteredList()}</ul>
    </>
  )
}

export default DeputiesList
