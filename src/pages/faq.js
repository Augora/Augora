import React from "react"

import SEO from "../components/seo"
import { Link } from "gatsby"
import Question from "components/faq/Question"

// Content
const contentAbout = [
  {
    title: "Qu’est-ce qu’un groupe parlementaire ?",
    description: (
      <p>
        Un groupe parlementaire n'est pas un parti politique à proprement
        parler.
      </p>
    ),
  },
  {
    title: "Qui sommes nous ?",
    description: (
      <p>
        Nous sommes une association à but non lucratif qui a pour vocation de
        mettre à disposition des outils d'informations statistiques sur les
        députés via Augora.fr
        <br />
        Si vous souhaitez en savoir plus sur l'association, consultez le lien{" "}
        <Link to="/about">A propos de nous</Link>
      </p>
    ),
  },
  {
    title: "Quelles sont nos sources ?",
    description: (
      <p>
        Nous utilisons des données publiques (open-data) venant de plusieurs
        sources :<br />
        <ul>
          <li>
            <Link
              target="_blank"
              to="https://www.regardscitoyens.org"
              rel="noopener"
            >
              https://www.regardscitoyens.org
            </Link>
          </li>
        </ul>
      </p>
    ),
  },
  {
    title: "Quels sont nos outils et nos méthodes ?",
    description: (
      <p>
        Nous utilisons plusieurs technologies dont : Gatsby/React, FaunaDB,
        Github, <br />
        Nos méthodes de communication sont Twitter, Facebook, Instagram,
      </p>
    ),
  },
  {
    title: "Quels données collectons-nous sur les utilisateurs du site ?",
    description: (
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
    ),
  },
  {
    title: "Comment nous soutenir ?",
    description: (
      <p>
        Nous avons ouvert une page Tipeee afin de recueillir des dons, étant une
        association à but non lucratif, nous ne retirons aucun avantages
        personnel aux dons.
      </p>
    ),
  },
  {
    title: "Quels sont nos projets pour le futur ?",
    description: (
      <p>
        Grâce à vos dons, nous avons l'ambition de créer des outils toujours
        plus accessible et variés pour offrir à nos utilisateur une expérience
        fluide et accessible sur différentes plateforme de diffusion
        <br />
        Nous souhaitons développer un ensemble d’outils autour de la
        visualisation de données (data-visualisation) en association avec des
        données publiques.
      </p>
    ),
  },
]

const About = () => {
  return (
    <>
      <SEO title="FAQ" />
      <div className="page page__faq">
        <h1>Foire aux Questions</h1>

        {contentAbout.map((question, index) => (
          <Question
            key={`faq-question-${index}`}
            title={question.title}
            description={question.description}
          />
        ))}
      </div>
    </>
  )
}

export default About
