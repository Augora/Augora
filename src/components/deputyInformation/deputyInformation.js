import React, { Component } from "react"
import "./deputyInformation.css"
import "../home/home.css"

const nameEquivalent = {
    "adresses": "Adresse physique",
    "anciens_autres_mandats": "Anciens autres mandats",
    "anciens_mandats": "Date(s) des anciens mandats",
    "collaborateurs": "Collaborateurs",
    "date_naissance": "Date de naissance",
    "emails": "E-mails",
    "groupe_sigle": "Sigle du groupe parlementaire",
    "id_an": "Identifiant Assemblée Nationale",
    "lieu_naissance": "Lieu de naissance",
    "mandat_debut": "Date du début de mandat",
    "nb_mandats": "Nombre de mandats",
    "nom": "Nom complet",
    "nom_circo": "Nom de circonscription",
    "nom_de_famille": "Nom de famille",
    "num_circo": "Numéro de circonscription",
    "num_deptmt": "Numéro de département",
    "parti_ratt_financier": "Rattachement au titre du financement de la vie politique",
    "place_en_hemicycle": "Numéro de place dans l'hémicycle",
    "prenom": "Prénom",
    "profession": "Profession",
    "sexe": "Sexe",
    "site_web": "Adresse URL du site web personnel",
    "twitter": "Identifiant twitter",
    "url_an": "Adresse URL sur le site de l'Assemblée Nationale",
    "url_nosdeputes": "Adresse URL sur le site nosdeputes.fr",
    "url_nosdeputes_api": "Adresse URL sur l'api nosdepute.fr"
}

class DeputyInformation extends Component {
    render() {
    return  <div className={"depute__" + this.props.type}>
        <h3>{ nameEquivalent[this.props.type] }</h3>
        { this.props.data[this.props.type] }
    </div>
    }
}

export default DeputyInformation
