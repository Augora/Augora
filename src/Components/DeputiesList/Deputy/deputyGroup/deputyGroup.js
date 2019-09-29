import React, { Component } from "react";
import "./deputyGroup.css";

class DeputyGroup extends Component {
  render() {
    return (
      <h3 className="depute__groupe" style={{ color: this.props.color }}>
        {this.props.group}
      </h3>
    );
  }
}

export default DeputyGroup;
