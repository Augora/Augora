import React, { Component } from 'react';
import {
  getDeputies,
} from 'lbp-wrapper';

class Home extends Component {
  render() {
    getDeputies().subscribe(d => console.log(d), err => console.error('Error:', err));
    return <h1>Home</h1>;
  }
}

export default Home;
