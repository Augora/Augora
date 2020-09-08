//// Imports
// React
import React, { Component } from "react"
import { Link } from "gatsby"
import { groupeIconByGroupeSigle } from "../deputies-list-utils"
import missingFemale from "images/ui-kit/missingfemale.png"
import missingMale from "images/ui-kit/missingmale.png"

class OneDeputy extends Component {
  constructor(props) {
    super(props)
    this.state = {
      opened: false,
      color: this.props.data.GroupeParlementaire.Couleur,
      sigle: this.props.data.GroupeParlementaire.NomComplet,
      src: this.props.data.URLPhotoAugora,
      errored: false,
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

  deputeImageBySexe = (sexe) => {
    var deputyImageByDefault
    if (!this.state.errored) {
      if (sexe === "H") {
        deputyImageByDefault = missingMale
      } else {
        deputyImageByDefault = missingFemale
      }

      this.setState({
        src: deputyImageByDefault,
        errored: true,
      })
    }
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
        <img
          className={`deputy__photo ${
            this.state.errored ? "deputy__photo--errored" : null
          }`}
          src={this.state.src}
          alt={this.props.data.Slug}
          onError={() => this.deputeImageBySexe(this.props.data.Sexe)}
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
