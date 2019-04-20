import React, { Component } from 'react';
import { getDeputiesInOffice } from 'lbp-wrapper';
import Helmet from 'react-helmet';
import LoadingSpinner from '../components/Commons/loadingSpinner/loadingSpinner';
import './home.css';

const content = (
  <div>
    <Helmet>
      <title>Accueil</title>
    </Helmet>
    <h1>Home</h1>
    <a href="/deputes">Liste des députés</a>
    <LoadingSpinner />
  </div>
);

class Home extends Component {
  render() {
    getDeputiesInOffice()
      .then(d => console.log(d))
      .catch(err => console.error('Error:', err));
    return content;
  }
}

export default Home;
