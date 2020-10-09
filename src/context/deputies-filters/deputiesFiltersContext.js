import React, { useState, createContext } from "react"
import { useStaticQuery, graphql } from "gatsby"

import useDeputiesFilters from "../../hooks/deputies-filters/useDeputiesFilters"

const initialState = {
  state: {
    GroupeValue: {},
    SexValue: {},
    AgeDomain: [],
    DeputiesList: [],
    FilteredList: [],
    GroupesList: [],
    Keyword: "",
  },
  handleSearchValue: (...f) => f,
  handleClickOnAllGroupes: (...f) => f,
  handleClickOnGroupe: (...f) => f,
  handleClickOnSex: (...f) => f,
  handleAgeSelection: (...f) => f,
  handleReset: (...f) => f,
}

export const DeputiesListContext = createContext(initialState)

export default function DeputiesListProvider(props) {
  const data = useStaticQuery(graphql`
    query DeputesFilterProviderQuery {
      faunadb {
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
            parti_ratt_financier
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
            Ordre
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
    }
  `)

  const [orderedGroupes] = useState(
    data.faunadb.GroupesParlementairesDetailsActifs.data.sort(
      (a, b) => a.Ordre - b.Ordre
    )
  )
  const [deputies] = useState(
    data.faunadb.DeputesEnMandat.data.sort((a, b) => a.Ordre - b.Ordre)
  )

  const fullState = useDeputiesFilters(deputies, orderedGroupes)

  return (
    <DeputiesListContext.Provider value={fullState}>
      {props.children}
    </DeputiesListContext.Provider>
  )
}
