import React from "react";
import ReactDOM from "react-dom";
import ListDeputy from "./DeputiesWrapper";

it("renders ListDeputy without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<ListDeputy />, div);
});
