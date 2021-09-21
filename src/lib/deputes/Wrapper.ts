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
              CouleurDetail {
                HSL {
                  Full
                  H
                  L
                  S
                }
              }
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
            Activites(_size: 100) {
              data {
                DateDeDebut
                DateDeFin
                NumeroDeSemaine
                PresenceEnHemicycle
                ParticipationEnHemicycle
                PresencesEnCommission
                ParticipationsEnCommission
                Question
                Vacances
              }
            }
          }
        }
      `,
      variables: {
        slug,
      },
    })
    .then((d) => d.data)
}

export function getDeputeAccropolis(slug: string) {
  return client
    .query({
      query: gql`
        query SingleDeputy($slug: String!) {
          Depute(Slug: $slug) {
            Age
            DebutDuMandat
            GroupeParlementaire {
              Couleur
              Sigle
              CouleurDetail {
                RGB {
                  Full
                  R
                  G
                  B
                }
                HSL {
                  Full
                  H
                  L
                  S
                }
              }
            }
            URLPhotoAugora
            Nom
            NomCirconscription
            NomDeFamille
            NumeroCirconscription
            NumeroDepartement
            Prenom
            Profession
            Sexe
            Slug
            Collaborateurs
            DateDeNaissance
            NomDepartement
            NomRegion
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
          }
        }
      `,
      variables: {
        slug,
      },
    })
    .then((d) => d.data)
}
