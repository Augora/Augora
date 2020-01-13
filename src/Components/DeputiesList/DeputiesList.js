import React, { useState } from "react"
// import { useStaticQuery, graphql } from "gatsby"
import Deputy from "./Deputy/Deputy"
import "./DeputiesList.css"

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
      <label className="groupe">
        {groupe}
        <input
          type="checkbox"
          key={`groupe--${groupe}`}
          name={groupe}
          checked={s_groupeValue[groupe] ? "checked" : ""}
          onChange={clickOnGroupe}
        />
      </label>
    )
  })

  const updatedList = listDeputies
    .filter(depute => {
      return depute.Nom.toLowerCase().search(s_searchValue.toLowerCase()) !== -1
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

  return (
    <>
      <div className="filters">
        <input
          className="filters__search"
          type="text"
          placeholder="Recherche"
          value={s_searchValue}
          onChange={e => filterListByName(e.target.value)}
        />
        <div className="filters__groupe">
          <button onClick={e => clickOnAllGroupes(e.target, true)}>Tous</button>
          <button onClick={e => clickOnAllGroupes(e.target, false)}>
            Aucun
          </button>
          {allGroupes}
        </div>
        <div className="filters__sexes">
          <label>
            Homme
            <input
              className="filters__sexe"
              type="checkbox"
              name="H"
              checked={s_sex.H ? "checked" : ""}
              onChange={clickOnSex}
            />
          </label>
          <label>
            Femme
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
          Nombre de député filtrés : {updatedList.length}
        </div>
      </div>
      <ul className="deputies__list">{updatedList}</ul>
    </>
  )
}

export default DeputiesList
