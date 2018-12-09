import React, { Component } from 'react'
import './deputyBtnLink.css'

class DeputyBtnLink extends Component {
    render() {
        return <a
            href={this.props.link}
            className={"depute__link depute__" + this.props.type + "-link"}
            target="_blank">
                {this.props.content}
        </a>
    }
}

export default DeputyBtnLink;