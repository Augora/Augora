import React, { FunctionComponent, useState } from "react";
import { RouterProps } from "../../../Utils/utils";
import Coworker, { ICoworker } from "./Coworker/Coworker";

// use it to resize the box as you wish, maybe with default values ?
interface CssValues {}

export interface ICoworkers {
  coworkers: Array<ICoworker>;
}

function Coworkers(props : ICoworkers) {
  // Declare only one state, refresh all properties in once

  return (
    <div>
      {props.coworkers.map((coworker: ICoworker) => {
        return (
          <Coworker {...coworker} />
        );
      })}
    </div>
  );
};

export default Coworkers;
