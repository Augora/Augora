import React from "react";
import ReactDOM from "react-dom";
import SingleDeputy from "./singleDeputy";

it("renders SingleDeputy without params without crashing", () => {
  const div = document.createElement("div");
  expect(() => ReactDOM.render(<SingleDeputy />, div)).toThrow(
    "SingleDeputy: please provide a match parameter."
  );
});

it("renders SingleDeputy without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<SingleDeputy match={{ params: { id: "a" } }} />, div);
});
