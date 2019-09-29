import calculateBlockSize from "./utils";
// import { RouterProps } from "../../../Utils/utils";
import styled from "styled-components";

export default function block(_this : any) {
    return styled.div`
      /* display: grid;
      grid-gap: 20px;
      grid-template-columns: repeat(${calculateBlockSize.bind(_this, _this.state.blockSize)}, 1fr); */
      display: flex;
      justify-content: space-between;
      grid-column-end: span ${calculateBlockSize.bind(_this, _this.state.blockSize)};
      background-color: rgba(0,0,0,0.15);
      border: solid 2px rgba(0,0,0,0.25);
      border-radius: 2px;
      padding: 10px;
    `;
}