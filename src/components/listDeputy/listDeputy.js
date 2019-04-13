import React, { Component } from "react";
import styled from "styled-components";

import ListDeputies from "./listDeputies/listDeputies";

const DeputesWrapper = styled.section`
  margin-top: 120px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px;
`;

class ListDeputy extends Component {
  render() {
    return (
      <div className="pageListing">
        <header className="header">
          <h1>Liste des députés</h1>
          <a href="/">Retour à l'accueil</a>
        </header>
        <DeputesWrapper>
          <ListDeputies />
        </DeputesWrapper>
      </div>
    );
  }
}

export default ListDeputy;
