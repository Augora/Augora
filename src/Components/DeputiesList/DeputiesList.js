import React, { useState } from "react"
import Deputy from "./Deputy/Deputy"
// import LoadingSpinner from "Components/Spinners/LoadingSpinner/LoadingSpinner"
import "./DeputiesList.css"

const DeputiesList = props => {
  const [s_searchValue, setSearchValue] = useState("")
  const listDeputies = props.data
  const updatedList = listDeputies
    .filter(depute => {
      return depute.Nom.toLowerCase().search(s_searchValue.toLowerCase()) !== -1
    })
    .map(depute => {
      return <Deputy key={depute.Slug} data={depute} />
    })

  const filterList = value => {
    setSearchValue(value)
  }

  return (
    <>
      <input
        className="search"
        type="text"
        placeholder="Recherche"
        value={s_searchValue}
        onChange={e => filterList(e.target.value)}
      />
      <ul className="deputies__list">{updatedList}</ul>
    </>
  )
}

export default DeputiesList
