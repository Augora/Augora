import React from 'react';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './home/home';
import ListDeputy from './listDeputy/listDeputy';
import SingleDeputy from './singleDeputy/singleDeputy';

const BasicExample = () => (
    <Router>
        <div>
            <Route exact path="/" component={Home} />
            <Route exact path="/deputes" component={ListDeputy} />
            <Route path="/depute/:id" component={SingleDeputy} />
        </div>
    </Router>
);

export default BasicExample;
