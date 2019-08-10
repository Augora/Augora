import React from "react";
import ReactDOM from "react-dom";
import Deputy from "./Deputy";

it("renders Deputy without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Deputy match={{ params: { id: "a" } }} />, div);
});
