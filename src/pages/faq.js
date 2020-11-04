import React from "react"

import SEO, { PageType } from "../components/seo/seo"
// import { Link } from "gatsby"
import Question from "components/faq/Question"
import PageTitle from "../components/titles/PageTitle"

// Content
const contentAbout = [
  {
    title: "Qui sommes-nous ?",
    description: (
      <p>
        Nous sommes une association à but non lucratif qui a pour vocation de mettre à disposition des outils d'informations
        statistiques sur les députés via <strong>Augora.fr</strong>.
      </p>
    ),
  },
  {
    title: "Qu’est-ce qu’un groupe parlementaire ?",
    description: (
      <>
        <p>
          Un groupe parlementaire est un ensemble composé de minimum 15 députés. Il permet de s'organiser au sein de l'Assemblée
          Nationale. Les députés qui composent un groupe peuvent faire partie de différents mouvements politiques.
        </p>
        <p>Lorsqu'un député fait parti d'un groupe parlementaire de moins de 15 députés, il est assigné aux non-inscrits.</p>
        <p>
          Il faut bien différencier{" "}
          <a href="https://fr.wikipedia.org/wiki/Parti_politique" target="_blank" rel="noreferrer">
            parti politique
          </a>{" "}
          et{" "}
          <a href="https://fr.wikipedia.org/wiki/Groupe_parlementaire" target="_blank" rel="noreferrer">
            groupe parlementaire
          </a>
          , car l'assemblée nationale fonctionne uniquement avec les groupes parlementaires.
        </p>
        <p>
          Il est à noter que le temps de parole est distribué en fonction de l'effectif des groupes. De plus, les commissions
          parlementaires sont composées en proportion de l'importance des groupes.
        </p>
        <p>
          En général, un député d'un parti politique est dans le groupe parlementaire du même nom quand il existe. Mais il se peut
          que certains partis politiques s'allient pour être dans un même groupe parlementaire. Pour plus d'informations, vous
          pouvez vous référer à la{" "}
          <a
            href="http://www2.assemblee-nationale.fr/decouvrir-l-assemblee/role-et-pouvoirs-de-l-assemblee-nationale/les-organes-de-l-assemblee-nationale/les-groupes-politiques"
            target="_blank"
            rel="noreferrer"
          >
            fiche de synthèse de l'Assemblée Nationale
          </a>
          .
        </p>
      </>
    ),
  },
  {
    title: "Comment les députés sont-ils triés ?",
    description: (
      <p>
        Nous avons choisi un affichage aléatoire des députés pour éviter de mettre certains groupes en avant, dans un soucis de
        transparence. Tous les jours, l'ordre des députés affichés changera.
      </p>
    ),
  },
  {
    title: "Quelles sont nos sources ?",
    description: (
      <p>
        Nous utilisons des données publiques (open-data) venant de :{" "}
        <a href="https://www.regardscitoyens.org" target="_blank" rel="noreferrer">
          https://www.regardscitoyens.org
        </a>
      </p>
    ),
  },
  {
    title: "Quels sont nos outils et nos méthodes ?",
    description: (
      <p>
        Nous utilisons plusieurs technologies dont : Gatsby/React, FaunaDB, Github, Mapbox. <br />
        Nous communiquons exclusivement via Twitter.
      </p>
    ),
  },
  {
    title: "Quelles données collectons-nous sur les utilisateurs du site ?",
    description: (
      <p>
        Souhaitant établir une démarche de transparence avec nos utilisateurs, le site Augora ne souhaite collecter aucune donnée.
        <br />
        Pour plus d'informations, se référer à la page des mentions légales.
      </p>
    ),
  },
  {
    title: "Où récupérons-nous les données cartographiques ?",
    description: (
      <p>
        Avant toutes choses, les données utilisées pour les cartes sont dans des fichiers au format <strong>geojson</strong>.
        <br />
        <ul><li>
        Pour les départements et régions, nous utilisons : <a href="https://github.com/gregoiredavid/france-geojson" target="_blank" rel="noreferrer">
        https://github.com/gregoiredavid/france-geojson
        </a>
        </li><li>
        Pour les circonscriptions, nous utilisons : <a href="https://www.data.gouv.fr/en/datasets/contours-detailles-des-circonscriptions-des-legislatives/" target="_blank" rel="noreferrer">
        https://www.data.gouv.fr/en/datasets/contours-detailles-des-circonscriptions-des-legislatives/
        </a>
        </li><li>
        Enfin, pour les zones géographiques des députés des français établis hors de France, nous utilisons : <a href="https://github.com/datasets/geo-countries" target="_blank" rel="noreferrer">
        https://github.com/datasets/geo-countries
        </a>
        </li></ul>
      </p>
    ),
  },
  // {
  //   title: "Comment nous soutenir ?",
  //   description: (
  //     <p>
  //       Nous avons ouvert une page <strong>Tipeee</strong> afin de recueillir
  //       des dons, étant une association à but non lucratif, nous ne retirons
  //       aucuns avantages personnels aux dons.
  //     </p>
  //   ),
  // },
  {
    title: "Quels sont nos projets pour le futur ?",
    description: (
      <p>
        Nous avons l'ambition de créer des outils toujours plus accessibles et variés pour offrir à nos utilisateurs une
        expérience fluide et accessible sur différentes plateformes de diffusion.
        <br />
        Nous souhaitons développer un ensemble d’outils autour de la visualisation de données (data-visualisation) en association
        avec des données publiques.
      </p>
    ),
  },
]

const FAQPage = () => {
  return (
    <>
      <SEO pageType={PageType.FAQ} />
      <div className="page page__faq">
        <PageTitle title="Foire aux Questions" />

        {contentAbout.map((question, index) => (
          <Question key={`faq-question-${index}`} title={question.title} description={question.description} />
        ))}
      </div>
    </>
  )
}

export default FAQPage
