import React, { Component } from 'react'
import DeputyInformation from '../../../deputyInformation/deputyInformation'
import './oneDeputy.css'
import '../../../home/home.css'
import twitter from './twitter.svg'
import envelope from './envelope.svg'
import homme from './homme.svg'
import femme from './femme.svg'
import downArrow from './down-arrow.svg'

const couleursGroupeParlementaire = {
    "LREM": {
        'couleur': 'hsl(199, 100%, 58%)',
        'nom_complet': 'La République En Marche'
    },
    "LR": {
        'couleur': 'hsl(223, 45%, 23%)',
        'nom_complet': 'Les Républicains'
    },
    "MODEM": {
        'couleur': 'hsl(25, 81%, 54%)',
        'nom_complet': 'Mouvement Démocrate et apparentés'
    },
    "SOC": {
        'couleur': 'hsl(354, 84%, 43%)',
        'nom_complet': 'Socialistes et apparentés'
    },
    "UAI": {
        'couleur': 'hsl(194, 81%, 55%)',
        'nom_complet': 'UDI, Agir et Indépendants'
    },
    "LFI": {
        'couleur': 'hsl(11, 66%, 47%)',
        'nom_complet': 'La France insoumise'
    },
    "GDR": {
        'couleur': 'hsl(0, 100%, 43%)',
        'nom_complet': 'Gauche démocrate et républicaine'
    },
    "LT": {
        'couleur': 'hsl(0, 0%, 50%)',
        'nom_complet': 'Libertés et Territoires'
    },
    "NI": {
        'couleur': 'hsl(0, 0%, 80%)',
        'nom_complet': 'Non inscrits'
    }
}
const sexSelector = {
    'H': {
        'nom_complet': 'Homme',
        'svg': homme
    },
    'F': {
        'nom_complet': 'Femme',
        'svg': femme
    }
}

class OneDeputy extends Component {
    constructor(props) {
        super(props)
        this.state = {
            opened: false,
            actualColor: couleursGroupeParlementaire[this.props.data.groupe_sigle].couleur,
            actualSigleComplet: couleursGroupeParlementaire[this.props.data.groupe_sigle].nom_complet,
            actualSex: sexSelector[this.props.data.sexe].nom_complet,
            actualSexSvg: sexSelector[this.props.data.sexe].svg,
            actualBirthDate: new Date(this.props.data.date_naissance),
            actualAge: 0
        }
        // Je redéfinis le contexte de this dans ma méthode (fonction déclarée à la racine de la class)
        this.expand = this.expand.bind(this)
    }
    getAge(birthdayDate) {
        const dateToday = Date.now()
        const ageDate = birthdayDate.getTime()
        const age = Math.abs(
            new Date(dateToday - ageDate).getUTCFullYear() - 1970
        )
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
                opened: !this.state.opened
            }
        })
    }
    componentWillMount() {
        this.getAge(this.state.actualBirthDate)
    }
    render() {
        return <div
            href={this.props.data.url_an}
            id={'depute-' + this.props.data.id} key={this.props.data.id}
            className={'depute depute--opened-' + this.state.opened}
            target='_blank'
            style={{
                backgroundColor: this.state.actualColor
            }}>
                <div className="depute__name-wrapper">
                    <div className={'depute__' + this.state.actualSex + " depute__sex-wrapper"}>
                        <img src={this.state.actualSexSvg} alt="Icône du sexe"/>
                    </div>
                    <h2
                        className="depute__name"
                        style={{
                            color: this.state.actualColor
                        }}>
                        {this.props.data.nom} (id: {this.props.data.id_an})
                        <br/>
                        <span className="depute__age">{this.state.actualAge}</span>
                    </h2>
                </div>
                <h3
                    style={{
                        color: this.state.actualColor
                    }}>
                    {this.state.actualSigleComplet}
                </h3>
                <a 
                    href={"https://twitter.com/" + this.props.data.twitter}
                    className="depute__twitter depute__rs"
                    target="_blank"
                    style={{
                        borderColor: this.state.actualColor
                    }}>>
                        <img src={twitter} alt="Icône twitter"/>
                </a>
                <a 
                    href={"mailto:" + this.props.data.emails[0]}
                    className="depute__email depute__rs"
                    style={{
                        borderColor: this.state.actualColor
                    }}>>
                        <img src={envelope} alt="Icône envoyer un e-mail"/>
                </a>
                <div className="depute__link-wrapper">
                    <a href={this.props.data.url_an} className="depute__link depute__an-link" target="_blank">
                        Lien AN
                    </a>
                    <a href={this.props.data.url_nosdeputes} className="depute__link depute__nosdeputes-link" target="_blank">
                        Lien nosdeputes.fr
                    </a>
                </div>
                <div className="depute__circo">
                    Circo : {this.props.data.nom_circo} ({this.props.data.num_deptmt} - {this.props.data.num_circo})
                </div>
                <DeputyInformation type="adresses" data={this.props.data} />
                <DeputyInformation type="anciens_autres_mandats" data={this.props.data} />
                <DeputyInformation type="anciens_mandats" data={this.props.data} />
                {/* <DeputyInformation type="collaborateurs" data={this.props.data} /> */}
                {/* <DeputyInformation type="date_naissance" data={this.props.data} /> */}
                {/* <DeputyInformation type="emails" data={this.props.data} /> */}
                {/* <DeputyInformation type="groupe_sigle" data={this.props.data} /> */}
                {/* <DeputyInformation type="id_an" data={this.props.data} /> */}
                <DeputyInformation type="lieu_naissance" data={this.props.data} />
                <DeputyInformation type="mandat_debut" data={this.props.data} />
                <DeputyInformation type="nb_mandats" data={this.props.data} />
                {/* <DeputyInformation type="nom" data={this.props.data} /> */}
                {/* <DeputyInformation type="nom_circo" data={this.props.data} /> */}
                {/* <DeputyInformation type="nom_de_famille" data={this.props.data} /> */}
                {/* <DeputyInformation type="num_circo" data={this.props.data} /> */}
                {/* <DeputyInformation type="num_deptmt" data={this.props.data} /> */}
                <DeputyInformation type="parti_ratt_financier" data={this.props.data} />
                <DeputyInformation type="place_en_hemicycle" data={this.props.data} />
                {/* <DeputyInformation type="prenom" data={this.props.data} /> */}
                {/* <DeputyInformation type="sexe" data={this.props.data} /> */}
                {/* <DeputyInformation type="site_web" data={this.props.data} /> */}
                {/* <DeputyInformation type="twitter" data={this.props.data} /> */}
                {/* <DeputyInformation type="url_an" data={this.props.data} /> */}
                {/* <DeputyInformation type="url_nosdeputes" data={this.props.data} /> */}
                {/* <DeputyInformation type="url_nosdeputes_api" data={this.props.data} /> */}
                <button
                    className="depute__open-btn btn"
                    onClick={this.expand}>
                    <img src={downArrow} alt="Icône flèche" />
                </button>
        </div>
    }
}

export default OneDeputy