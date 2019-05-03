import React, { Component } from "react";
import { getDeputiesInOffice } from "lbp-wrapper";
import Deputy from "./Deputy/Deputy";
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
      .then(deputes =>
        this.setState(function(state) {
          return {
            loaded: true,
            deputes
          };
        })
      )
      .catch(err => console.error("Error:", err));
  }

  render() {
    if (!this.state.loaded) {
      return null;
    } else {
      const listDeputies = this.state.deputes.map(function(depute) {
        return <Deputy key={depute.id} data={depute} />;
      });
      return listDeputies;
    }
  }
}

export default DeputiesList;
