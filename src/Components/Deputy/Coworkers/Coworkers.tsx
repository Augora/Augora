import React, { FunctionComponent, useState } from "react";
import styled from "styled-components";
import Coworker, { ICoworker } from "./Coworker/Coworker";
import { slugify } from 'Utils/utils'

// use it to resize the box as you wish, maybe with default values ?
interface CssValues {}

export interface ICoworkers {
  coworkers: Array<ICoworker>;
}

function Coworkers(props : ICoworkers) {
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
      {props.coworkers.map((coworker: ICoworker) => {
        return (
          <Coworker
            key={slugify(coworker.coworker)}
            {...coworker}
          />
        );
      })}
    </Block>
  );
};

export default Coworkers;
