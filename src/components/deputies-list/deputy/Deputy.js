//// Imports
// React
import React, { Component } from "react"
import { Link } from "gatsby"
import { groupeIconByGroupeSigle } from "../deputies-list-utils"
import DeputyImage from "components/deputy/general-information/deputy-image/DeputyImage"

class OneDeputy extends Component {
  constructor(props) {
    super(props)
    this.state = {
      opened: false,
      color: this.props.data.GroupeParlementaire.Couleur,
      sigle: this.props.data.GroupeParlementaire.NomComplet,
    }

    this.expand = this.expand.bind(this)
  }

  expand(e) {
    e.preventDefault()
    this.setState((state) => {
      return {
        opened: !this.state.opened,
      }
    })
  }

  render() {
    return (
      <Link
        to={`/depute/${this.props.data.Slug}`}
        id={"depute-" + this.props.data.Slug}
        key={this.props.data.Slug}
        className={"depute depute--opened-" + this.state.opened}
        style={{
          backgroundColor: this.state.color,
        }}
      >
        <h2>{this.props.data.Nom}</h2>
        <DeputyImage
          src={this.props.data.URLPhotoAugora}
          alt={this.props.data.Slug}
          sex={this.props.data.Sexe}
        />
        <div className="deputy__icon-container">
          <img
            className="deputy__groupe-icon"
            src={groupeIconByGroupeSigle(
              this.props.data.GroupeParlementaire.Sigle
            )}
            alt={`Icône du groupe ${this.props.data.GroupeParlementaire.Sigle}`}
          />
        </div>
      </Link>
    )
  }
}

export default OneDeputy
