import React from "react"

import SEO from "../components/seo"

// Content

const Mentions = () => {
  return (
    <>
      <SEO title="Mentions légales" />
      <div className="page page__mentions-legales">
        <h1>Mentions légales</h1>
        <h2>Données personnelles</h2>
        <p>
          Nous ne souhaitons pas collecter les données de nos utilisateurs. Nous
          n’utilisons pas non plus de cookies.
          <br />
          Les services que nous utilisons peuvent utiliser des données.
          Ci-dessous les liens vers leurs mentions légales :
          <br />
          <ul>
            <li>
              <a href="https://vercel.com/legal/privacy-policy" target="_blank">
                https://vercel.com/legal/privacy-policy
              </a>
            </li>
            <li>
              <a
                href="https://www.cloudflare.com/privacypolicy"
                target="_blank"
              >
                https://www.cloudflare.com/privacypolicy
              </a>
            </li>
          </ul>
        </p>
        <h2>Contenu du site</h2>
        <p>
          Le site d’Augora est un service de communication au public en ligne
          édité par l’association Augora. Elle est domiciliée à Strasbourg. Le
          directeur de la publication est Pierre Tusseau.
          <br />
          En cas de réclamation sur le contenu de ces sites, il est recommandé
          de nous adresser un courrier électronique : Association Augora -{" "}
          <a href="mailto:contact@augora.fr">contact@augora.fr</a>.
          <br />
          Sauf mention contraire les contenus proposés sur ces différents sites
          sont mis à disposition sous licence{" "}
          <a
            href="https://creativecommons.org/licenses/by-sa/2.0/"
            target="_blank"
          >
            Creative Commons BY-SA
          </a>{" "}
          et les{" "}
          <a href="https://opendatacommons.org/licenses/odbl/" target="_blank">
            données sous licence ODBL.
          </a>
          <br />
          Les photos des parlementaires sont utilisées à titre gratuit à partir
          des données officielles des sites officiels de l’
          <a href="http://www.assemblee-nationale.fr/" target="_blank">
            Assemblée Nationale
          </a>{" "}
          et restent donc soumises aux conditions légales de réutilisation de
          ces sites.
        </p>
        <h2>Hébergeur</h2>
        <h3>Nos données sont hébergées chez :</h3>
        <p>
          Fauna <br /> 548 Market Street #87043 <br /> San Francisco, CA 94104{" "}
          <br /> (855) 432-8623
        </p>
        <h3>Notre site est hébergé chez :</h3>
        <p>
          Vercel Inc. <br /> 340 S Lemon Ave #4133 <br /> Walnut CA 91789 <br />{" "}
          United States <br /> +1 951-383-6898
        </p>
      </div>
    </>
  )
}

export default Mentions
