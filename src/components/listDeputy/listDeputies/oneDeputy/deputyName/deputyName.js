import React, { Component } from 'react'
import './deputyName.css'

class DeputyName extends Component {
    render() {
        return <div
            className="depute__name"
            style={{ color: this.props.color }}>
                {this.props.name} (id: {this.props.idAn})
                <br/>
                <span className="depute__age">{this.props.age}</span>
        </div>
    }
}

export default DeputyName;