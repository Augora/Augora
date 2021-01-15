import deputeStore from "stores/deputesStore"

import { getAgeDomain, getGroupValue } from "../../components/deputies-list/deputies-list-utils"

export default function useDeputiesFilters() {
  /*----------------------------------------------------*/
  // Store
  /*----------------------------------------------------*/
  const {
    initialDeputesList,
    initialGroupesList,
    FilteredList,
    GroupeValue,
    setGroupeValue,
    SexValue,
    setSexValue,
    AgeDomain,
    setAgeDomain,
    keyword,
    search,
  } = deputeStore((state) => ({
    initialDeputesList: state.deputesInitialList,
    initialGroupesList: state.groupesInitialList,
    FilteredList: state.deputesFilteredList,
    GroupeValue: state.selectedGroupes,
    setGroupeValue: state.setSelectedGroupes,
    SexValue: state.selectedGenders,
    setSexValue: state.setSelectedGenders,
    AgeDomain: state.ageDomain,
    setAgeDomain: state.setAgeDomain,
    keyword: state.keyword,
    search: state.setKeyword,
  }))

  /*----------------------------------------------------*/
  // Handlers
  /*----------------------------------------------------*/
  /**
   * Recherche un nom de député
   * @param value le string de recherche
   */
  const handleSearchValue = (value: string) => {
    search(value)
  }

  /**
   * Change l'état des filtres au clic d'un bouton groupe
   * @param sigle Le sigle du groupe
   */
  const handleClickOnGroupe = (sigle: string) => {
    const groupesAsArray = Object.entries(GroupeValue)
    const allActive = groupesAsArray.every(([key, value]) => {
      return value
    })

    const isClickedIsAloneAsActive =
      GroupeValue[sigle] &&
      groupesAsArray
        .filter(([key, value]) => {
          return key !== sigle
        })
        .every(([key, value]) => {
          return !value
        })

    Object.keys(GroupeValue).forEach((key) => {
      if (allActive) {
        GroupeValue[key] = key !== sigle ? false : true
      } else if (isClickedIsAloneAsActive) {
        GroupeValue[key] = key !== sigle ? true : false
      } else {
        if (key === sigle) GroupeValue[sigle] = !GroupeValue[sigle]
      }
    })

    setGroupeValue(Object.assign({}, GroupeValue))
  }

  /**
   * Change les filtres au clic d'un bouton sexe
   * @param clickedSex L'initiale du sexe séléctionné, "H", ou "F"
   */
  const handleClickOnSex = (clickedSex: Filter.Gender) => {
    const currentSexValue = SexValue[clickedSex]
    const otherSex = clickedSex === "F" ? "H" : "F"
    let newSexValue = {
      F: true,
      H: true,
    }

    if (!SexValue[otherSex]) {
      newSexValue[clickedSex] = false
      newSexValue[otherSex] = true
    } else {
      newSexValue[clickedSex] = !currentSexValue
    }

    setSexValue(newSexValue)
  }

  /**
   * Change l'état des filtres au changement du slider âge
   * @param domain Range des âges
   */
  const handleAgeSelection = (domain: Filter.AgeDomain) => {
    setAgeDomain(domain)
  }

  /**
   * Reset les filtres
   */
  const handleReset = () => {
    search("")
    setGroupeValue(getGroupValue(initialGroupesList.map((g) => g.Sigle)))
    setSexValue({ H: true, F: true })
    setAgeDomain(getAgeDomain(initialDeputesList))
  }

  const state = {
    GroupeValue,
    SexValue,
    AgeDomain,
    DeputiesList: initialDeputesList,
    FilteredList,
    GroupesList: initialGroupesList,
    Keyword: keyword,
  }

  return {
    state,
    handleSearchValue,
    handleClickOnGroupe,
    handleClickOnSex,
    handleAgeSelection,
    handleReset,
  }
}
