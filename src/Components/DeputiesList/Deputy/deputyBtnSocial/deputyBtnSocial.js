import React, { Component } from "react";
import "./deputyBtnSocial.css";

class DeputyBtnSocial extends Component {
  render() {
    return (
      <a
        href={this.props.startingUrl + this.props.link}
        className={"depute__" + this.props.type + " depute__rs"}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          borderColor: this.props.color
        }}
      >
        >
        <img src={this.props.image} alt="" />
      </a>
    );
  }
}

export default DeputyBtnSocial;
