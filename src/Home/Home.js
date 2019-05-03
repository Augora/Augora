import React, { Component } from "./node_modules/react";
import { getDeputiesInOffice } from "./node_modules/lbp-wrapper";
import Helmet from "./node_modules/react-helmet";
import LoadingSpinner from "../Components/Spinners/LoadingSpinner/LoadingSpinner";
import "./Home.css";

const content = (
  <div>
    <Helmet>
      <title>Accueil</title>
    </Helmet>
    <h1>Home</h1>
    <a href="/deputies">Liste des députés</a>
    <LoadingSpinner />
  </div>
);

class Home extends Component {
  render() {
    getDeputiesInOffice()
      .then(d => console.log(d))
      .catch(err => console.error("Error:", err));
    return content;
  }
}

export default Home;
