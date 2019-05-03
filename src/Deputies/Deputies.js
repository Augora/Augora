import React, { Component } from "react";
import styled from "styled-components";

import DeputiesList from "./DeputiesList/DeputiesList";

const DeputiesStyles = styled.section`
  margin-top: 120px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px;
`;

class Deputies extends Component {
  render() {
    return (
      <div className="pageListing">
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
