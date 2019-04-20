import React, { Component } from 'react';
import './deputySex.css';

class DeputySex extends Component {
    render() {
        return (
            <div
                className={'depute__' + this.props.sex + ' depute__sex-wrapper'}
            >
                <img src={this.props.sexSvg} alt="Icône du sexe" />
            </div>
        );
    }
}

export default DeputySex;
