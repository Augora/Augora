import React, { Component } from 'react';
import ListDeputies from './listDeputies/listDeputies';
import './listDeputy.css';
import '../home/home.css';

class ListDeputy extends Component {
    render() {
        return (
            <div className="pageListing">
                <header className="header">
                    <h1>Liste des députés</h1>
                    <a href="/">Retour à l'accueil</a>
                </header>
                <section className="deputes__wrapper">
                    <ListDeputies />
                </section>
            </div>
        );
    }
}

export default ListDeputy;
