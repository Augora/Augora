//// Imports
// React
import React, { Component } from "react"
// import DeputyName from "./deputyName/deputyName";
// import DeputySex from "./deputySex/deputySex";
// import DeputyGroup from "./deputyGroup/deputyGroup";
// import DeputyBtnSocial from "./deputyBtnSocial/deputyBtnSocial";
// import DeputyBtnLink from "./deputyBtnLink/deputyBtnLink";
// import ExpandBtn from "./expandBtn/expandBtn";
// import DeputyInformatin from "../../../Components/Deputy/DeputyInformation/DeputyInformation";
import { Link } from "gatsby"

// Style
import "./Deputy.css"

// Images
// import twitter from "./Assets/twitter.svg";
// import envelope from "./Assets/envelope.svg";
import homme from "./Assets/homme.svg"
import femme from "./Assets/femme.svg"
// import downArrow from "./Assets/down-arrow.svg";

const couleursGroupeParlementaire = {
  LREM: {
    couleur: "hsl(199, 100%, 58%)",
    nom_complet: "La République En Marche",
  },
  LR: {
    couleur: "hsl(223, 45%, 23%)",
    nom_complet: "Les Républicains",
  },
  MODEM: {
    couleur: "hsl(25, 81%, 54%)",
    nom_complet: "Mouvement Démocrate et apparentés",
  },
  SOC: {
    couleur: "hsl(354, 84%, 43%)",
    nom_complet: "Socialistes et apparentés",
  },
  UAI: {
    couleur: "hsl(194, 81%, 55%)",
    nom_complet: "UDI, Agir et Indépendants",
  },
  LFI: {
    couleur: "hsl(11, 66%, 47%)",
    nom_complet: "La France insoumise",
  },
  GDR: {
    couleur: "hsl(0, 100%, 43%)",
    nom_complet: "Gauche démocrate et républicaine",
  },
  LT: {
    couleur: "hsl(0, 0%, 50%)",
    nom_complet: "Libertés et Territoires",
  },
  NI: {
    couleur: "hsl(0, 0%, 80%)",
    nom_complet: "Non inscrits",
  },
  NG: {
    couleur: "hsl(0, 0%, 80%)",
    nom_complet: "Non inscrits",
  },
  UDI: {
    couleur: "hsl(261, 29%, 48%)",
    nom_complet: "Union des démocrates et indépendants",
  },
}
const sexSelector = {
  H: {
    nom_complet: "Homme",
    svg: homme,
  },
  F: {
    nom_complet: "Femme",
    svg: femme,
  },
}

class OneDeputy extends Component {
  constructor(props) {
    super(props)
    this.state = {
      opened: false,
      actualColor:
        couleursGroupeParlementaire[this.props.data.SigleGroupePolitique]
          .couleur,
      actualSigleComplet:
        couleursGroupeParlementaire[this.props.data.SigleGroupePolitique]
          .nom_complet,
      actualSex: sexSelector[this.props.data.Sexe].nom_complet,
      actualSexSvg: sexSelector[this.props.data.Sexe].svg,
      actualBirthDate: new Date(this.props.data.DateDeNaissance),
      actualAge: 0,
    }

    this.expand = this.expand.bind(this)
  }

  getAge(birthdayDate) {
    const dateToday = Date.now()
    const ageDate = birthdayDate.getTime()
    const age = Math.abs(new Date(dateToday - ageDate).getUTCFullYear() - 1970)
    this.setState(function(state) {
      return {
        actualAge: age,
      }
    })
  }

  expand(e) {
    e.preventDefault()
    this.setState(function(state) {
      return {
        opened: !this.state.opened,
      }
    })
  }

  getDerivedStateFromProps(props, state) {
    this.getAge(state.actualBirthDate)
  }

  render() {
    return (
      <Link
        to={`/deputy/${this.props.data.Slug}`}
        id={"depute-" + this.props.data.Slug}
        key={this.props.data.Slug}
        className={"depute depute--opened-" + this.state.opened}
        style={{
          backgroundColor: this.state.actualColor,
        }}
      >
        <h2>{this.props.data.Nom}</h2>
      </Link>
    )
  }
}

export default OneDeputy
