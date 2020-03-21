import styled from "styled-components";


export interface MyState {
  blockSize: string;
}

export default function block(_this: any) {
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

function calculateBlockSize(size: string) {
  switch (size) {
    case "line":
      return 4
    case "halfLine":
      return 2
    case "block":
      return 1
    default:
      return 1
  }
}