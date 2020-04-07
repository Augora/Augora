//// Imports
// React
import React, { Component } from "react"
import { Link } from "gatsby"
import { groupeIconByGroupeSigle } from "../deputies-list-utils"
// Style
import "./deputy.scss"

// images
// import twitter from "./assets/twitter.svg";
// import envelope from "./assets/envelope.svg";
// import homme from "./assets/homme.svg"
// import femme from "./assets/femme.svg"
// import downArrow from "./assets/down-arrow.svg";

// const sexSelector = {
//   H: {
//     nom_complet: "Homme",
//     svg: homme,
//   },
//   F: {
//     nom_complet: "Femme",
//     svg: femme,
//   },
// }

class OneDeputy extends Component {
  constructor(props) {
    super(props)
    this.state = {
      opened: false,
      color: this.props.data.GroupeParlementaire.Couleur,
      sigle: this.props.data.GroupeParlementaire.NomComplet,
      // actualSex: sexSelector[this.props.data.Sexe].nom_complet,
      // actualSexSvg: sexSelector[this.props.data.Sexe].svg,
      // actualBirthDate: new Date(this.props.data.DateDeNaissance),
      // actualAge: 0,
    }

    this.expand = this.expand.bind(this)
  }

  expand(e) {
    e.preventDefault()
    this.setState(function (state) {
      return {
        opened: !this.state.opened,
      }
    })
  }

  render() {
    return (
      <Link
        to={`/deputy/${this.props.data.Slug}`}
        id={"depute-" + this.props.data.Slug}
        key={this.props.data.Slug}
        className={"depute depute--opened-" + this.state.opened}
        style={{
          backgroundColor: this.state.color,
        }}
      >
        <h2>{this.props.data.Nom}</h2>
        <img
          className="deputy__photo"
          src={this.props.data.URLPhotoAugora}
          alt={this.props.data.Slug}
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
