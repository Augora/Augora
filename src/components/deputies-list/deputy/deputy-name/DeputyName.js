import React, { Component } from "react"

class DeputyName extends Component {
  render() {
    return (
      <h2
        style={{
          background: "white",
          padding: "10px",
          margin: 0,
          width: "calc(90% - 2px)",
          textTransform: "uppercase",
          fontSize: "15px",
          fontWeight: "bold",
          lineHeight: 1.5,
        }}
      >
        <a
          href={`/deputy/${this.props.id}`}
          color={this.props.color}
          style={{ color: this.props.color }}
        >
          {this.props.name} (id: {this.props.idAn})
        </a>
        <br />
        <span color={this.props.color} style={{ color: this.props.color }}>
          {this.props.age}
        </span>
      </h2>
    )
  }
}

export default DeputyName
