import React, { Component } from 'react';
import {
  getDeputiesInOffice,
} from 'lbp-wrapper';

class Home extends Component {
  render() {
    getDeputiesInOffice().subscribe(d => console.log(d), err => console.error('Error:', err));
    return <h1>Home</h1>;
  }
}

export default Home;
