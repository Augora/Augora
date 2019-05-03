import React from './node_modules/react';
import ReactDOM from './node_modules/react-dom';
import Home from './Home';

it('renders Home without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Home />, div);
});
