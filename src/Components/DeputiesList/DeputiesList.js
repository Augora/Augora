import React, { useState } from "react"
import Deputy from "./Deputy/Deputy"
import "./DeputiesList.css"
import BarChart from "./BarChart/BarChart"
import PieChart from "./PieChart/PieChart"

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

const DeputiesList = props => {
  const [s_searchValue, setSearchValue] = useState("")
  const [s_groupeValue, setGroupeValue] = useState({
    MODEM: true,
    LREM: true,
    SOC: true,
    LR: true,
    LFI: true,
    LT: true,
    NI: true,
    GDR: true,
    UAI: true,
    NG: true,
  })
  const [s_sex, setSex] = useState({
    H: true,
    F: true,
  })
  const listDeputies = props.data

  const calculateNbDepute = (type, value) => {
    const filteredList = listDeputies.filter(depute => {
      return depute.Nom.toLowerCase().search(s_searchValue.toLowerCase()) !== -1
    })
    switch (type) {
      case "groupe":
        return filteredList
          .filter(depute => {
            return s_sex[depute.Sexe] ? true : false
          })
          .filter(depute => {
            return depute.SigleGroupePolitique === value.groupe ? true : false
          }).length
      case "sexe":
        return filteredList
          .filter(depute => {
            return s_groupeValue[depute.SigleGroupePolitique] ? true : false
          })
          .filter(depute => {
            return depute.Sexe === value ? true : false
          }).length
      default:
        return filteredList.length
    }
  }

  const groupesData = Object.keys(s_groupeValue).map(groupe => {
    return Object.assign(
      {},
      {
        name: groupe,
        value: s_groupeValue[groupe],
        number: calculateNbDepute("groupe", { groupe }),
        color: couleursGroupeParlementaire[groupe],
      }
    )
  })

  const filterListByName = value => {
    setSearchValue(value)
  }
  const clickOnAllGroupes = (target, bool) => {
    const allGroupesNewValues = Object.keys(s_groupeValue).forEach(groupe => {
      s_groupeValue[groupe] = bool
    })
    setGroupeValue(Object.assign({}, s_groupeValue, allGroupesNewValues))
  }
  const clickOnGroupe = event => {
    setGroupeValue(
      Object.assign({}, s_groupeValue, {
        [event.target.name]: event.target.checked,
      })
    )
  }
  const clickOnSex = event => {
    setSex(
      Object.assign({}, s_sex, {
        [event.target.name]: event.target.checked,
      })
    )
  }

  const allGroupes = Object.keys(s_groupeValue).map(groupe => {
    return (
      <label className={`groupe groupe--${groupe}`} key={`groupe--${groupe}`}>
        {groupe}({calculateNbDepute("groupe", { groupe })})
        <input
          type="checkbox"
          name={groupe}
          checked={s_groupeValue[groupe] ? "checked" : ""}
          onChange={clickOnGroupe}
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
      <PieChart data={groupesData} width={450} height={450} />
      <BarChart data={groupesData} width={450} height={200} />
      <div className="filters">
        <input
          className="filters__search"
          type="text"
          placeholder="Recherche"
          value={s_searchValue}
          onChange={e => filterListByName(e.target.value)}
        />
        <div className="filters__groupe">
          <div className="groupes__allornone">
            <button onClick={e => clickOnAllGroupes(e.target, true)}>
              Tous
            </button>
            <button onClick={e => clickOnAllGroupes(e.target, false)}>
              Aucun
            </button>
          </div>
          <br />
          {allGroupes}
        </div>
        <div className="filters__sexes">
          <label>
            Homme({calculateNbDepute("sexe", "H")})
            <input
              className="filters__sexe"
              type="checkbox"
              name="H"
              checked={s_sex.H ? "checked" : ""}
              onChange={clickOnSex}
            />
          </label>
          <label>
            Femme({calculateNbDepute("sexe", "F")})
            <input
              className="filters__sexe"
              type="checkbox"
              name="F"
              checked={s_sex.F ? "checked" : ""}
              onChange={clickOnSex}
            />
          </label>
        </div>
        <div className="deputies__number">
          Nombre de député filtrés : {filteredList().length}
        </div>
      </div>
      <ul className="deputies__list">{filteredList()}</ul>
    </>
  )
}

export default DeputiesList
