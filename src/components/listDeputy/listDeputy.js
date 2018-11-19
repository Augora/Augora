import React, { Component } from "react";
import "./listDeputy.css";
import { getDeputiesInOffice } from "lbp-wrapper";

class ListDeputy extends Component {
  constructor(...props) {
    super(...props)
    this.state = {
      loaded: false,
      deputes: null,
    }
  }
  componentDidMount() {
    getDeputiesInOffice()
    .then(
      depute => this.setState(function (state) {
        return {
          loaded: true,
          deputes: depute,
        }
      })
    )
    .catch(err => console.error("Error:", err));
  }
  render() {
    if (!this.state.loaded) { // Pendant que je charge
      return null
    } else { // Si mes députés ont chargé
      console.log(this.state.deputes) // Récupéré mon objet dans la console
      var that = this // Redéfinir le this pour dans une fonction de haute priorité
      const deputeNames = this.state.deputes.result.map(function (deputeID) {
        return <a
          href={that.state.deputes.entities.depute[deputeID].url_an}
          id={"depute-" + deputeID} key={deputeID}
          class="depute"
          target="_blank">
            {that.state.deputes.entities.depute[deputeID].nom}
          </a>
      })
      return (
        deputeNames
      )
    }
  }
}

export default ListDeputy;
