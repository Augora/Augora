import React, { Component } from "react";
import { getDeputy } from "lbp-wrapper";

class SingleDeputy extends Component {
  constructor(...props) {
    super(...props);

    this.state = {
      isLoading: true,
      data: null,
      error: null
    };
  }

  getSex() {
    if (this.state.data.sexe === 'H') {
      return('Député')
    } else if (this.state.data.sexe === 'F') {
      return('Députée')
    } else {
      return('Députée')
    }
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
    if (!this.props.match) {
      throw new Error("SingleDeputy: please provide a match parameter.");
    }
    if (this.state.isLoading) {
      return <h1>Loading...</h1>;
    }
    console.log(this.state.data)
    return (
      <div>
        <img
          src={this.state.data.imageDynamic(200)}
          alt=""
        />
        <h1>{this.state.data.prenom} {this.state.data.nom_de_famille}</h1>
        <p>
          {this.getSex() + ' ' + this.state.data['groupe_sigle']}
        </p>
        <p>
          {this.state.data['nom_circo']} ({this.state.data['num_circo']})
        </p>
      </div>
    );
  }
}

export default SingleDeputy;
