import React from "react"

import SEO from "../components/seo"
import { Link } from "gatsby"

const About = () => (
  <>
    <SEO title="FAQ" />
    <div className="page page__faq">
      <h1>FAQ</h1>

      <div className="faq__question">
        <h2>Qu’est-ce qu’un groupe parlementaire ?</h2>
        <p>
          Un groupe parlementaire c'est pas parti politique à proprement parler.
        </p>
      </div>
      <div className="faq__question">
        <h2>Qui sommes nous ?</h2>
        <p>
          Nous sommes une association à but non lucratif qui a pour vocation de
          mettre à disposition des outils d'informations statistiques sur les
          députés via Augora.fr
          <br />
          Si vous souhaitez en savoir plus sur l'associtation, consultez le lien{" "}
          <Link to="/about">A propos de nous</Link>
        </p>
      </div>
      <div className="faq__question">
        <h2>Quels sont nos sources ?</h2>
        <p>
          Nous utilisons des données publiques (open-data) venant de plusieurs
          sources :<br />
          <ul>
            <li>
              <Link to="https://www.regardscitoyens.org">
                https://www.regardscitoyens.org
              </Link>
            </li>
          </ul>
        </p>
      </div>
      <div className="faq__question">
        <h2>Quels sont nos outils et nos méthodes ?</h2>
        <p>
          Nous utilisons plusieurs technologies dont : Gatsby/React, FaunaDB,
          Github, <br />
          Nos méthodes de communication sont Twitter, Facebook, Instagram,
        </p>
      </div>
      <div className="faq__question">
        <h2>Quels données collectons-nous sur les utilisateurs du site ?</h2>
        <p>
          Souhaitant établir une démarche de transparence avec nos utilisateurs,
          le site Augora ne souhaite collecter aucune données.
          <br />
          En revanche les outils que nous utilisons comme FaunaDB, ..., ...
          peuvent collecter certaines données, tel que ..., …<br />
          Il est possible que des services que nous utilisions récupèrent des
          données. Nous sommes en train de nous renseigner pour avoir plus de
          détails.
        </p>
      </div>
      <div className="faq__question">
        <h2>Comment nous soutenir ?</h2>
        <p>
          Nous avons ouvert une page Tipeee afin de recueillir des dons, étant
          une association à but non lucratif, nous ne retirons aucun avantages
          personnel aux dons.
        </p>
      </div>
      <div className="faq__question">
        <h2>Quels sont nos projets pour le futur ?</h2>
        <p>
          Grâce à vos dons, nous avons l'ambition de créer des outils toujours
          plus accessible et variés pour offrir à nos utilisateur une expérience
          fluide et accessible sur différentes plateforme de diffusion
          <br />
          Nous souhaitons développer un ensemble d’outils autour de la
          visualisation de données (data-visualisation) en association avec des
          données publiques.
        </p>
      </div>

      <h2></h2>
    </div>
  </>
)

export default About
