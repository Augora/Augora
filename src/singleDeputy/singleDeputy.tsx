import React, { Component } from "react";
import { getDeputy } from "lbp-wrapper";

// Define the state shape
interface SingleDeputyState {
  isLoading: boolean;
  data: IDeputy | null;
}

// Define the props shape
interface SingleDeputyProps {
  match: {
    params: {
      id: string;
    };
  };
}

class SingleDeputy extends Component<SingleDeputyProps, SingleDeputyState> {
  constructor(props: SingleDeputyProps) {
    super(props);

    this.state = {
      isLoading: true,
      data: null
    };
  }

  componentDidMount() {
    const _this = this;
    getDeputy(this.props.match.params.id).then(d =>
      _this.setState(state =>
        Object.assign({}, state, { isLoading: false, data: d })
      )
    );
  }

  render() {
    if (this.state.isLoading) {
      return <h1>Loading...</h1>;
    }
    if (this.state.data === null) {
      return <h1>Loading...</h1>;
    }
    return (
      <div>
        <h1>SingleDeputy: {this.props.match.params.id}</h1>
        <img src={this.state.data.imageDynamic(200)} alt="" />
      </div>
    );
  }
}

export default SingleDeputy;
