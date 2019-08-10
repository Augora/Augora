import React, { Component } from "react";
import { getDeputiesInOffice } from "lbp-wrapper";
import Deputy from "./Deputy/Deputy";
import LoadingSpinner from "../../Components/Spinners/LoadingSpinner/LoadingSpinner";
import "./DeputiesList.css";

class DeputiesList extends Component {
  constructor(...props) {
    super(...props);
    this.state = {
      loaded: false,
      deputes: null,
      searchValue: ''
    };
  }

  filterList(event) {
    this.setState(Object.assign({}, this.state, {searchValue: event.target.value}))
  }

  componentDidMount() {
    getDeputiesInOffice()
      .then(deputes => {
        this.setState(state => {
          return Object.assign({}, state, {
            loaded: true,
            deputes
          });
        });
      })
      .catch(err => console.error("Error:", err));
  }

  render() {
    if (!this.state.loaded) {
      return <LoadingSpinner />;
    } else {
      const listDeputies = this.state.deputes
      const updatedList = listDeputies.filter(depute => {
        return depute.nom.toLowerCase().search(this.state.searchValue.toLowerCase()) !== -1
      }).map(depute => {
        return <Deputy key={depute.id} data={depute} />;
      });
      return(
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
}

export default DeputiesList;
