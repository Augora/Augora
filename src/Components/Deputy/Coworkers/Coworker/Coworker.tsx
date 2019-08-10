import React, { FunctionComponent, useState } from "react";
import { RouterProps } from "../../../../Utils/utils";

// use it to resize the box as you wish, maybe with default values ?
interface CssValues {}

export interface ICoworker {
  coworker: string;
}

function Coworker(props: ICoworker) {
  return (
    <div>
      <p> {props.coworker}</p>
    </div>
  );
}

export default Coworker;
