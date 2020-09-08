import React from "react"

import SEO from "../components/seo"
import { Link } from "gatsby"
import Question from "components/faq/Question"

// Content
const contentAbout = [
  {
    title: "Qui sommes-nous ?",
    description: (
      <p>
        Nous sommes une association à but non lucratif qui a pour vocation de
        mettre à disposition des outils d'informations statistiques sur les
        députés via <strong>Augora.fr</strong>.
        <br />
      </p>
    ),
  },
  {
    title: "Qu’est-ce qu’un groupe parlementaire ?",
    description: (
      <p>
        Un groupe parlementaire est un ensemble composé de minimum 15 députés.
        Il permet de s'organiser au sein de l'Assemblée Nationale. Les députés
        qui composent un groupe peuvent faire partie de différents mouvements
        politiques.
        <br />
        Lorsqu'un député fait parti d'un groupe parlementaire de moins de 15
        députés, il est assigné aux non-inscrits.
        <br />
        Il est à noter que le temps de parole est distribué en fonction de
        l'effectif des groupes. De plus, les commissions parlementaires sont
        composées en proportion de l'importance des groupes.
        <br />
        En général, un député d'un groupe politique est dans le groupe
        parlementaire du même nom. Mais il se peut que certains parties
        politiques s'allient pour être dans un même groupe parlementaire.
        <br />
        Pour plus d'informations, vous pouvez vous référer à la{" "}
        <a
          href="http://www2.assemblee-nationale.fr/decouvrir-l-assemblee/role-et-pouvoirs-de-l-assemblee-nationale/les-organes-de-l-assemblee-nationale/les-groupes-politiques"
          target="_blank"
          rel="noopener"
        >
          fiche de synthèse de l'Assemblée Nationale
        </a>
        .
      </p>
    ),
  },
  {
    title: "Comment les députés sont-ils triés ?",
    description: (
      <p>
        Nous avons choisit un affichage aléatoire des députés pour éviter de
        mettre certains groupes en avant, dans un soucis de transparence. Tous
        les jours, l'ordre des députés affichés change.
      </p>
    ),
  },
  {
    title: "Quelles sont nos sources ?",
    description: (
      <p>
        Nous utilisons des données publiques (open-data) venant de :{" "}
        <a
          href="https://www.regardscitoyens.org"
          target="_blank"
          rel="noopener"
        >
          https://www.regardscitoyens.org
        </a>
      </p>
    ),
  },
  {
    title: "Quels sont nos outils et nos méthodes ?",
    description: (
      <p>
        Nous utilisons plusieurs technologies dont : Gatsby/React, FaunaDB,
        Github, Mapbox. <br />
        Nous communiquons exclusivement via Twitter.
      </p>
    ),
  },
  {
    title: "Quelles données collectons-nous sur les utilisateurs du site ?",
    description: (
      <p>
        Souhaitant établir une démarche de transparence avec nos utilisateurs,
        le site Augora ne souhaite collecter aucune données.
        <br />
        Pour plus d'informations, se référer à la page des mentions légales.
      </p>
    ),
  },
  {
    title: "Comment nous soutenir ?",
    description: (
      <p>
        Nous avons ouvert une page <strong>Tipeee</strong> afin de recueillir
        des dons, étant une association à but non lucratif, nous ne retirons
        aucuns avantages personnels aux dons.
      </p>
    ),
  },
  {
    title: "Quels sont nos projets pour le futur ?",
    description: (
      <p>
        Grâce à vos dons, nous avons l'ambition de créer des outils toujours
        plus accessible et variés pour offrir à nos utilisateur une expérience
        fluide et accessible sur différentes plateforme de diffusion.
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
