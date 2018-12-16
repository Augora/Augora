import React, { Component } from "react";
import { getDeputiesInOffice } from "lbp-wrapper";
import LoadingSpinner from '../loadingSpinner/loadingSpinner';
import "./home.css";

const content = (
  <div>
    <h1>Home</h1>
    <a href="/deputes">Liste des députés</a>
    <LoadingSpinner />
  </div>
)

class Home extends Component {
  render() {
    getDeputiesInOffice()
      .then(d => console.log(d))
      .catch(err => console.error("Error:", err));
    return (content)
  }
}

export default Home;
