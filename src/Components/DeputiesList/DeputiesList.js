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
  const listDeputies = props.data

  const filterList = value => {
    setSearchValue(value)
  }
  const clickOnGroupe = event => {
    setGroupeValue(
      Object.assign({}, s_groupeValue, {
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
          defaultChecked={s_groupeValue[groupe] ? "checked" : ""}
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
          onChange={e => filterList(e.target.value)}
        />
        <div className="filters__groupe">{allGroupes}</div>
        <div className="deputies__number">
          Nombre de député filtrés : {updatedList.length}
        </div>
      </div>
      <ul className="deputies__list">{updatedList}</ul>
    </>
  )
}

export default DeputiesList
