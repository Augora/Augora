import React, { Component } from "react";
import "./oneDeputy.css";
import "../../../home/home.css";

class OneDeputy extends Component {
    render() {
        return <a
            href={this.props.data.url_an}
            id={"depute-" + this.props.data.id} key={this.props.data.id}
            className="depute"
            target="_blank">
                {this.props.data.nom}
        </a>
    }
}

export default OneDeputy