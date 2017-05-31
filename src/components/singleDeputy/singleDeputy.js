import React, { Component } from 'react';

class SingleDeputy extends Component {
  render() {
    if (!this.props.match) {
      throw new Error('SingleDeputy: please provide a match parameter.');
    }
    return <h1>SingleDeputy: {this.props.match.params.id}</h1>;
  }
}

export default SingleDeputy;
