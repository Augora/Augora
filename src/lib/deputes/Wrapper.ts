import { gql } from "@apollo/client"

import client from "../faunadb/client"

export function getDeputes() {
  return client.query({
    query: gql`
      query DeputesEnMandat {
        DeputesEnMandat(EstEnMandat: true, _size: 700) {
          data {
            LieuDeNaissance
            DebutDuMandat
            GroupeParlementaire {
              Couleur
              Sigle
              NomComplet
            }
            Nom
            NomCirconscription
            NomDepartement
            NomRegion
            NomDeFamille
            NombreMandats
            NumeroCirconscription
            NumeroDepartement
            NumeroRegion
            PlaceEnHemicycle
            Prenom
            Profession
            Sexe
            Slug
            Twitter
            DateDeNaissance
            Age
            Collaborateurs
            Emails
            SitesWeb
            URLPhotoAugora
            Ordre @client
          }
        }
        GroupesParlementairesDetailsActifs(Actif: true) {
          data {
            Couleur
            Sigle
            Ordre
            NomComplet
          }
        }
      }
    `,
  })
}

export function getDeputesSlugs() {
  return client.query({
    query: gql`
      query DeputesEnMandat {
        DeputesEnMandat(EstEnMandat: true, _size: 700) {
          data {
            Slug
          }
        }
      }
    `,
  })
}

export function getDepute(slug: string) {
  return client
    .query({
      query: gql`
        query SingleDeputy($slug: String!) {
          Depute(Slug: $slug) {
            Age
            LieuDeNaissance
            DebutDuMandat
            Emails
            GroupeParlementaire {
              NomComplet
              Couleur
              Sigle
              CouleurDetail {
                HSL {
                  Full
                  H
                  L
                  S
                }
              }
            }
            RattachementFinancier
            URLPhotoAugora
            Nom
            NomCirconscription
            NomDeFamille
            NombreMandats
            NumeroCirconscription
            NumeroDepartement
            PlaceEnHemicycle
            Prenom
            Profession
            Sexe
            SitesWeb
            Slug
            Twitter
            Collaborateurs
            DateDeNaissance
            NomDepartement
            URLTwitter
            URLFacebook
            URLInstagram
            URLLinkedIn
            URLAssembleeNationale
            AnciensMandats {
              data {
                DateDeDebut
                DateDeFin
                Intitule
              }
            }
            AutresMandats {
              data {
                Institution
                Localite
                Intitule
              }
            }
            AdressesDetails {
              data {
                Adresse
                CodePostal
                Telephone
              }
            }
          }
        }
      `,
      variables: {
        slug,
      },
    })
    .then((d) => d.data.Depute)
}
