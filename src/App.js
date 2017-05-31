import React from 'react';

import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import Home from './components/home/home';
import ListDeputy from './components/listDeputy/listDeputy';
import SingleDeputy from './components/singleDeputy/singleDeputy';

const BasicExample = () => (
  <Router>
    <div>
      <Route exact path="/" component={Home} />
      <Route exact path="/deputes" component={ListDeputy} />
      <Route path="/deputes/:id" component={SingleDeputy} />
    </div>
  </Router>
);

export default BasicExample;
