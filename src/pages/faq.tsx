import React from "react"

import SEO, { PageType } from "../components/seo/seo"
import Question from "components/faq/Question"

type IContent = {
  title: string
  description: React.ReactNode
}[]

// Content
const contentAbout: IContent = [
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
    title: "Qu'est-ce qu'un amendement ?",
    description: (
      <>
        <p>
          Un amendement est est une modification pour corriger, compléter ou annuler une loi ou un projet de loi. L'amendement
          peut porter sur une partie ou l'ensemble de la-dite loi.
        </p>
      </>
    ),
  },
  {
    title: "C'est quoi une commission parlementaire ?",
    description: (
      <>
        <p>Une commission est un groupe de député spécialisé dans un domaine. Il existe 8 commissions dites permanentes :</p>
        <ul>
          <li>Affaires culturelles et éducation</li>
          <li>Affaires économiques</li>
          <li>Affaires étrangères</li>
          <li>Affaires sociales</li>
          <li>Défense nationale et forces armées</li>
          <li>Développement durable et aménagement du territoire</li>
          <li>Finances</li>
          <li>Lois</li>
        </ul>
        <p>
          Elles sont composées de membres désignés à la proportionnelle des groupes parlementaires. Un député ne peut appartenir
          qu'à une seule commission. Les projets et propositions de loi sont renvoyés à la commission compétente.
        </p>
        <p>
          Pour plus d'informations, se référer à la page des{" "}
          <a href="https://www.assemblee-nationale.fr/13/commissions/commissions-index.asp" target="_blank" rel="noreferrer">
            commissions
          </a>{" "}
          sur le site de l'Assemblée Nationale.
        </p>
      </>
    ),
  },
  {
    title: "C'est quoi une commission d'enquête ?",
    description: (
      <>
        <p>
          Il ne s’agit pas d’une procédure judiciaire. Pendant six mois, le député a le rôle d’enquêteur pour vérifier s’il n’y a
          pas de lacunes dans les politiques publiques sur un sujet précis. A l’issue de ces six mois, un rapport est publié.
        </p>
        <p>
          Ils peuvent procéder à des auditions, demander des documents. Les séances en commissions sont filmées et les
          comptes-rendus publics. Une commission d’enquête ne peut porter sur une affaire judiciaire en instruction, sauf si le
          sujet est assez large.
        </p>
        <p>
          Chaque groupe peut demander la création d’une commission d’enquête une fois par an. Les conséquences d’une commission
          peuvent être de :
        </p>
        <ul>
          <li> Influencer l’action du Gouvernement</li>
          <li>Déboucher sur une procédure judiciaire</li>
          <li>Préparer le terrain à une loi</li>
        </ul>
      </>
    ),
  },
  {
    title: "C'est quoi une mission d'information ?",
    description: (
      <>
        <p>
          Une mission d'information est une commission d'enquête, avec plus de souplesse. Il n'y a en effet pas de limitation de
          durée et de nombre de membre. IL est également possible de travailler, même s'il y a une enquête judiciaire en cours.
        </p>
        <p>
          Dans certains cas, en plus d’aider à légiférer, les missions permettent d’évaluer les politiques et contrôler
          l’exécutif. Chaque mission est libre de s’organiser comme elle le souhaite. Les rapports associés aux missions ne sont
          pas disponibles sur le site de l’assemblée nationale. Parfois ils ne sont même pas sur la page personnelle d’un député.
        </p>
      </>
    ),
  },
  {
    title: "C'est quoi un groupe d'étude ?",
    description: (
      <>
        <p>
          En théorie, les groupes d’études ont un rôle de complément lors de la production législative, du contrôle de l’exécutif
          et de l’évaluation des politiques publiques. A la différence des missions et des commissions d’enquêtes, il n’y a pas de
          rapport à restituer.
        </p>
        <p>
          On ne sait pas ce qui se déroule au sein de ces groupes d’études. Il n’y a pas de réel suivi, ni d’agenda, ni de
          personnel dédié pour ces groupes.
        </p>
        <p>
          Contrairement à d’autres structures, il n’y a pas de parité à respecter entre groupes parlementaires pour intégrer un
          groupe d’étude. C’est également une manière de faire du lobbying pour sa région. Notamment pour des députés de zones
          montagneuses, être inscrit dans le groupe d’études sur la montagne.
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
        Nous utilisons plusieurs technologies dont : NextJS, React, FaunaDB, Github, Mapbox, Visx. <br />
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
      <>
        <p>
          Avant toutes choses, les données utilisées pour les cartes sont dans des fichiers au format <strong>geojson</strong>.
          <br />
        </p>
        <ul>
          <li>
            Pour les départements et régions, nous utilisons :{" "}
            <a href="https://github.com/gregoiredavid/france-geojson" target="_blank" rel="noreferrer">
              https://github.com/gregoiredavid/france-geojson
            </a>
          </li>
          <li>
            Pour les circonscriptions, nous utilisons :{" "}
            <a
              href="https://www.data.gouv.fr/en/datasets/contours-detailles-des-circonscriptions-des-legislatives/"
              target="_blank"
              rel="noreferrer"
            >
              https://www.data.gouv.fr/en/datasets/contours-detailles-des-circonscriptions-des-legislatives/
            </a>
          </li>
          <li>
            Enfin, pour les zones géographiques des députés des français établis hors de France, nous utilisons :{" "}
            <a href="https://github.com/datasets/geo-countries" target="_blank" rel="noreferrer">
              https://github.com/datasets/geo-countries
            </a>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Qu'est-ce que les DROM-COM ?",
    description: (
      <p>
        Ce nouveau sigle désigne les territoires "Départements, Régions d'Outre-Mer et Collectivités d'Outre-Mer". Avant,
        l'acronyme utilisé était "DOM-TOM".
      </p>
    ),
  },
  {
    title: "A quoi correspondent les Français établis hors de France ?",
    description: (
      <p>
        Les députés des "français établis hors de France", sont les représentants des français qui habitent plus de 6 mois dans un
        pays à l'étranger. Il faut qu'ils aient réalisés une{" "}
        <a href="https://www.service-public.fr/particuliers/vosdroits/F33307" target="_blank" rel="noreferrer">
          inscription consulaire
        </a>
        .
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

export default function FAQ() {
  return (
    <>
      <SEO pageType={PageType.FAQ} />
      <div className="page page__faq">
        {contentAbout.map((question, index) => (
          <Question key={`faq-question-${index}`} title={question.title}>
            {question.description}
          </Question>
        ))}
      </div>
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      title: "Foire aux Questions",
      PageType: PageType.FAQ,
    },
  }
}
