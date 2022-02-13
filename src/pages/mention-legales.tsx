import React from "react"

import SEO, { PageType } from "../components/seo/seo"

const Mentions = () => {
  return (
    <>
      <SEO pageType={PageType.MentionsLegales} />
      <div className="page page__mentions-legales">
        <h2>Données personnelles</h2>
        <p>
          Nous ne souhaitons pas collecter les données de nos utilisateurs. Nous n’utilisons pas non plus de cookies.
          <br />
          Les services que nous utilisons peuvent utiliser des données. Ci-dessous les liens vers leurs mentions légales :
          <br />
        </p>
        <ul>
          <li>
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer">
              https://vercel.com/legal/privacy-policy
            </a>
          </li>
          <li>
            <a href="https://www.cloudflare.com/privacypolicy" target="_blank" rel="noreferrer">
              https://www.cloudflare.com/privacypolicy
            </a>
          </li>
        </ul>

        <h2>Contenu du site</h2>
        <p>
          Le site d’Augora est un service de communication au public en ligne édité par l’association Augora. Elle est domiciliée
          à Strasbourg. Le directeur de la publication est Pierre Tusseau.
          <br />
          En cas de réclamation sur le contenu de ces sites, il est recommandé de nous adresser un courrier électronique :
          Association Augora - <a href="mailto:contact@augora.fr">contact@augora.fr</a>.
          <br />
          Sauf mention contraire les contenus proposés sur ces différents sites sont mis à disposition sous licence{" "}
          <a href="https://creativecommons.org/licenses/by-sa/2.0/" target="_blank" rel="noreferrer">
            Creative Commons BY-SA
          </a>{" "}
          et les{" "}
          <a href="https://opendatacommons.org/licenses/odbl/" target="_blank" rel="noreferrer">
            données sous licence ODBL.
          </a>
          <br />
          Les photos des parlementaires sont utilisées à titre gratuit à partir des données officielles des sites officiels de l’
          <a href="http://www.assemblee-nationale.fr/" target="_blank" rel="noreferrer">
            Assemblée Nationale
          </a>{" "}
          et restent donc soumises aux conditions légales de réutilisation de ces sites.
        </p>
        <h2>Hébergeur</h2>
        <h3>Nos données sont hébergées chez :</h3>
        <p>
          Supabase <br /> Singapore, SG (HQ) <br /> 970 Toa Payoh N, #07-04
        </p>
        <h3>Notre site est hébergé chez :</h3>
        <p>
          Vercel Inc. <br /> 340 S Lemon Ave #4133 <br /> Walnut CA 91789 <br /> United States <br /> +1 951-383-6898
        </p>
      </div>
    </>
  )
}

export default Mentions

export async function getStaticProps() {
  return {
    props: {
      title: "Mentions Légales",
      PageType: PageType.MentionsLegales,
    },
  }
}
