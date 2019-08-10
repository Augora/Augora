//// Imports
// React
import React, { Component } from "react";
// import DeputyName from "./deputyName/deputyName";
// import DeputySex from "./deputySex/deputySex";
// import DeputyGroup from "./deputyGroup/deputyGroup";
// import DeputyBtnSocial from "./deputyBtnSocial/deputyBtnSocial";
// import DeputyBtnLink from "./deputyBtnLink/deputyBtnLink";
// import ExpandBtn from "./expandBtn/expandBtn";
// import DeputyInformatin from "../../../Components/Deputy/DeputyInformation/DeputyInformation";
import { Link } from 'react-router-dom'
// Style
import "./Deputy.css";

// Images
// import twitter from "./Assets/twitter.svg";
// import envelope from "./Assets/envelope.svg";
import homme from "./Assets/homme.svg";
import femme from "./Assets/femme.svg";
// import downArrow from "./Assets/down-arrow.svg";

const couleursGroupeParlementaire = {
  LREM: {
    couleur: "hsl(199, 100%, 58%)",
    nom_complet: "La République En Marche"
  },
  LR: {
    couleur: "hsl(223, 45%, 23%)",
    nom_complet: "Les Républicains"
  },
  MODEM: {
    couleur: "hsl(25, 81%, 54%)",
    nom_complet: "Mouvement Démocrate et apparentés"
  },
  SOC: {
    couleur: "hsl(354, 84%, 43%)",
    nom_complet: "Socialistes et apparentés"
  },
  UAI: {
    couleur: "hsl(194, 81%, 55%)",
    nom_complet: "UDI, Agir et Indépendants"
  },
  LFI: {
    couleur: "hsl(11, 66%, 47%)",
    nom_complet: "La France insoumise"
  },
  GDR: {
    couleur: "hsl(0, 100%, 43%)",
    nom_complet: "Gauche démocrate et républicaine"
  },
  LT: {
    couleur: "hsl(0, 0%, 50%)",
    nom_complet: "Libertés et Territoires"
  },
  NI: {
    couleur: "hsl(0, 0%, 80%)",
    nom_complet: "Non inscrits"
  },
  UDI: {
    couleur: "hsl(261, 29%, 48%)",
    nom_complet: "Union des démocrates et indépendants"
  }
};
const sexSelector = {
  H: {
    nom_complet: "Homme",
    svg: homme
  },
  F: {
    nom_complet: "Femme",
    svg: femme
  }
};

class OneDeputy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
      actualColor:
        couleursGroupeParlementaire[this.props.data.groupe_sigle].couleur,
      actualSigleComplet:
        couleursGroupeParlementaire[this.props.data.groupe_sigle].nom_complet,
      actualSex: sexSelector[this.props.data.sexe].nom_complet,
      actualSexSvg: sexSelector[this.props.data.sexe].svg,
      actualBirthDate: new Date(this.props.data.date_naissance),
      actualAge: 0
    };

    this.expand = this.expand.bind(this);
  }

  getAge(birthdayDate) {
    const dateToday = Date.now();
    const ageDate = birthdayDate.getTime();
    const age = Math.abs(new Date(dateToday - ageDate).getUTCFullYear() - 1970);
    this.setState(function(state) {
      return {
        actualAge: age
      };
    });
  }

  expand(e) {
    e.preventDefault();
    this.setState(function(state) {
      return {
        opened: !this.state.opened
      };
    });
  }

  componentWillMount() {
    this.getAge(this.state.actualBirthDate);
  }

  render() {
    return (
      <Link
        to={`/deputy/${this.props.data.slug}`}
        id={"depute-" + this.props.data.id}
        key={this.props.data.id}
        className={"depute depute--opened-" + this.state.opened}
        style={{
          backgroundColor: this.state.actualColor
        }}
      >
        <h2>{this.props.data.nom}</h2>
        {/* <div className="depute__name-wrapper">
          <DeputySex
            sex={this.state.actualSex}
            sexSvg={this.state.actualSexSvg}
          />
          <DeputyName
            color={this.state.actualColor}
            name={this.props.data.nom}
            idAn={this.props.data.id_an}
            id={this.props.data.slug}
            age={this.state.actualAge}
          />
        </div>
        <DeputyGroup
          color={this.state.actualColor}
          group={this.state.actualSigleComplet}
        /> */}
        {/* <div className="depute__rs-wrapper">
          <DeputyBtnSocial
            type={"twitter"}
            startingUrl={"https://twitter.com/"}
            link={this.props.data.twitter}
            color={this.state.actualColor}
            image={twitter}
          />
          <DeputyBtnSocial
            type={"email"}
            startingUrl={"mailto:"}
            link={this.props.data.emails[0]}
            color={this.state.actualColor}
            image={envelope}
          />
        </div>
        <div className="depute__link-wrapper">
          <DeputyBtnLink
            type={"an"}
            link={this.props.data.url_an}
            content={"Lien AN"}
          />
          <DeputyBtnLink
            type={"nosdeputes"}
            link={this.props.data.url_nosdeputes}
            content={"Lien nosdeputes.fr"}
          />
        </div>
        <div className="depute__circo">
          Circo : {this.props.data.nom_circo} ({this.props.data.num_deptmt} -{" "}
          {this.props.data.num_circo})
        </div>
        <DeputyInformation type="adresses" data={this.props.data} />
        <DeputyInformation
          type="anciens_autres_mandats"
          data={this.props.data}
        /> */}
        {/* <DeputyInformation type="anciens_mandats" data={this.props.data} /> */}
        {/* <DeputyInformation type="collaborateurs" data={this.props.data} /> */}
        {/* <DeputyInformation type="date_naissance" data={this.props.data} /> */}
        {/* <DeputyInformation type="emails" data={this.props.data} /> */}
        {/* <DeputyInformation type="groupe_sigle" data={this.props.data} /> */}
        {/* <DeputyInformation type="id_an" data={this.props.data} /> */}
        {/* <DeputyInformation type="lieu_naissance" data={this.props.data} /> */}
        {/* <DeputyInformation type="mandat_debut" data={this.props.data} /> */}
        {/* <DeputyInformation type="nb_mandats" data={this.props.data} /> */}
        {/* <DeputyInformation type="nom" data={this.props.data} /> */}
        {/* <DeputyInformation type="nom_circo" data={this.props.data} /> */}
        {/* <DeputyInformation type="nom_de_famille" data={this.props.data} /> */}
        {/* <DeputyInformation type="num_circo" data={this.props.data} /> */}
        {/* <DeputyInformation type="num_deptmt" data={this.props.data} /> */}
        {/* <DeputyInformation type="parti_ratt_financier" data={this.props.data} /> */}
        {/* <DeputyInformation type="place_en_hemicycle" data={this.props.data} /> */}
        {/* <DeputyInformation type="prenom" data={this.props.data} /> */}
        {/* <DeputyInformation type="sexe" data={this.props.data} /> */}
        {/* <DeputyInformation type="site_web" data={this.props.data} /> */}
        {/* <DeputyInformation type="twitter" data={this.props.data} /> */}
        {/* <DeputyInformation type="url_an" data={this.props.data} /> */}
        {/* <DeputyInformation type="url_nosdeputes" data={this.props.data} /> */}
        {/* <DeputyInformation type="url_nosdeputes_api" data={this.props.data} /> */}
        {/* <ExpandBtn action={this.expand} icon={downArrow} /> */}
      </Link>
    );
  }
}

export default OneDeputy;
