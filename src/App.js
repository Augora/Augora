import React from "react";

import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./Home/Home";
import Deputies from "./Deputies/Deputies";
import Deputy from "./Deputy/Deputy";

const BasicExample = () => (
  <Router>
    <div>
      <Route exact path="/" component={Home} />
      <Route exact path="/deputies" component={Deputies} />
      <Route path="/deputy/:id" component={Deputy} />
    </div>
  </Router>
);

export default BasicExample;
