import React, { Component } from "react";
import styled from "styled-components";

const DeputyNameHeader = styled.h2`
  background: white;
  padding: 10px;
  margin: 0;
  width: calc(90% - 2px);
  text-transform: uppercase;
  font-size: 15px;
  font-weight: bold;
  line-height: 1.5;
`;

const DeputyLink = styled.a`
  color: ${props => props.color};
`;

const DeputyAge = styled.span`
  color: ${props => props.color};
`;

class DeputyName extends Component {
  render() {
    return (
      <DeputyNameHeader>
        <DeputyLink href={`/depute/${this.props.id}`} color={this.props.color}>
          {this.props.name} (id: {this.props.idAn})
        </DeputyLink>
        <br />
        <DeputyAge color={this.props.color}>{this.props.age}</DeputyAge>
      </DeputyNameHeader>
    );
  }
}

export default DeputyName;
