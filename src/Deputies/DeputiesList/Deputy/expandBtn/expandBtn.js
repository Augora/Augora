import React, { Component } from "react";
import "./expandBtn.css";

class ExpandBtn extends Component {
  render() {
    return (
      <button className="depute__open-btn btn" onClick={this.props.action}>
        <img src={this.props.icon} alt="Icône flèche" />
      </button>
    );
  }
}

export default ExpandBtn;
