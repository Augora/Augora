import React, { Component } from "react";
import "./oneDeputy.css";
import "../../home/home.css";

class OneDeputy extends Component {
    constructor(...props) {
        super(...props)
    }
    render() {
        return <a
        href={this.props.data.deputes.entities.depute[deputeID].url_an}
        id={"depute-" + deputeID} key={deputeID}
        class="depute"
        target="_blank">
          {this.props.data.deputes.entities.depute[deputeID].nom}
        </a>
    }
}

export default OneDeputyInList;