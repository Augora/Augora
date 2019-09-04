import React, { Component } from "react"
import { getDeputiesInOffice } from "lbp-wrapper"
import Deputy from "./Deputy/Deputy"
import LoadingSpinner from "../../Components/Spinners/LoadingSpinner/LoadingSpinner"
import "./DeputiesList.css"

class DeputiesList extends Component {
  constructor(...props) {
    super(...props)
    this.state = {
      searchValue: "",
    }
  }

  filterList(event) {
    this.setState(
      Object.assign({}, this.state, { searchValue: event.target.value })
    )
  }

  render() {
    const listDeputies = this.props.data
    const updatedList = listDeputies
      .filter(depute => {
        return (
          depute.nom
            .toLowerCase()
            .search(this.state.searchValue.toLowerCase()) !== -1
        )
      })
      .map(depute => {
        return <Deputy key={depute.slug} data={depute} />
      })
    return (
      <>
        <input
          className="search"
          type="text"
          placeholder="Recherche"
          value={this.state.searchValue}
          onChange={this.filterList.bind(this)}
        />
        {updatedList}
      </>
    )
  }
}

export default DeputiesList
