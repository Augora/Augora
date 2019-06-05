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
      deputes: null
    };
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
      const listDeputies = this.state.deputes.map(function(depute) {
        return <Deputy key={depute.id} data={depute} />;
      });
      return listDeputies;
    }
  }
}

export default DeputiesList;
