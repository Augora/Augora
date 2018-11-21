import React, { Component } from "react"
import DeputyInformation from "../../../deputyInformation/deputyInformation"
import "./oneDeputy.css"
import "../../../home/home.css"

class OneDeputy extends Component {
    render() {
        return <a
            href={this.props.data.url_an}
            id={"depute-" + this.props.data.id} key={this.props.data.id}
            className="depute"
            target="_blank">
                <h2 className="depute__name">{this.props.data.nom}</h2>
                <DeputyInformation type="adresses" data={this.props.data} />
                <DeputyInformation type="anciens_autres_mandats" data={this.props.data} />
                <DeputyInformation type="anciens_mandats" data={this.props.data} />
                {/* <DeputyInformation type="collaborateurs" data={this.props.data} /> */}
                <DeputyInformation type="date_naissance" data={this.props.data} />
                <DeputyInformation type="emails" data={this.props.data} />
                <DeputyInformation type="groupe_sigle" data={this.props.data} />
                <DeputyInformation type="id_an" data={this.props.data} />
                <DeputyInformation type="lieu_naissance" data={this.props.data} />
                <DeputyInformation type="mandat_debut" data={this.props.data} />
                <DeputyInformation type="nb_mandats" data={this.props.data} />
                <DeputyInformation type="nom" data={this.props.data} />
                <DeputyInformation type="nom_circo" data={this.props.data} />
                <DeputyInformation type="nom_de_famille" data={this.props.data} />
                <DeputyInformation type="num_circo" data={this.props.data} />
                <DeputyInformation type="num_deptmt" data={this.props.data} />
                <DeputyInformation type="parti_ratt_financier" data={this.props.data} />
                <DeputyInformation type="place_en_hemicycle" data={this.props.data} />
                <DeputyInformation type="prenom" data={this.props.data} />
                <DeputyInformation type="sexe" data={this.props.data} />
                {/* <DeputyInformation type="site_web" data={this.props.data} /> */}
                <DeputyInformation type="twitter" data={this.props.data} />
                <DeputyInformation type="url_an" data={this.props.data} />
                <DeputyInformation type="url_nosdeputes" data={this.props.data} />
                <DeputyInformation type="url_nosdeputes_api" data={this.props.data} />
        </a>
    }
}

export default OneDeputy