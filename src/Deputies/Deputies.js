import React, { Component } from "react";
import styled from "styled-components";
import Helmet from "react-helmet";

import DeputiesList from "./DeputiesList/DeputiesList";

const DeputiesStyles = styled.section`
  margin-top: 120px;
  position: relative;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(4, 1fr);
  padding: 100px 10px 10px 10px;
`;

class Deputies extends Component {
  render() {
    return (
      <div className="pageListing">
        <Helmet>
          <title>Liste des députés</title>
        </Helmet>
        <header className="header">
          <h1>Liste des députés</h1>
          <a href="/">Retour à l'accueil</a>
        </header>
        <DeputiesStyles>
          <DeputiesList />
        </DeputiesStyles>
      </div>
    );
  }
}

export default Deputies;
