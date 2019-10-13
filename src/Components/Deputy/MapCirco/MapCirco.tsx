import React, { FunctionComponent, useState } from "react";
import styled from "styled-components";
import { NullLiteral } from "typescript";

// use it to resize the box as you wish, maybe with default values ?
interface CssValues {}

export interface Geodata {
  coworkers: String;
}

function MapCirco(props : Geodata) {
  // Declare only one state, refresh all properties in once

  const Block = styled.div`
    display: flex;
    flex-direction: column;
    grid-column-end: span 1;
    background-color: rgba(0,0,0,0.15);
    border: solid 2px rgba(0,0,0,0.25);
    border-radius: 2px;
    padding: 10px;
  `;
  return (
    <Block>
        <div className="map">
            Je suis une map
        </div>
    </Block>
  );
};

export default MapCirco;
