import deputeStore from "stores/deputesStore"

import { getAgeDomain, getGroupValue } from "../../components/deputies-list/deputies-list-utils"

export default function useDeputiesFilters() {
  /*----------------------------------------------------*/
  // Store
  /*----------------------------------------------------*/
  const {
    isInitialState,
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
    isInitialState: state.isInitialState,
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
  const handleSearch = (value: string) => {
    search(value)
  }

  /**
   * Change l'état des filtres au clic d'un bouton groupe
   * @param sigle Le sigle du groupe
   */
  const handleGroupClick = (sigle: string) => {
    const groupesAsArray = Object.entries(GroupeValue)
    const allActive = groupesAsArray.every(([key, value]) => value)

    const isClickedAloneActive =
      GroupeValue[sigle] &&
      groupesAsArray
        .filter(([key, value]) => {
          return key !== sigle
        })
        .every(([key, value]) => {
          return !value
        })

    let newGroupValue: Filter.GroupValue = GroupeValue

    Object.keys(GroupeValue).forEach((key) => {
      if (allActive) {
        newGroupValue[key] = key !== sigle ? false : true
      } else if (isClickedAloneActive) {
        newGroupValue[key] = key !== sigle ? true : false
      } else {
        if (key === sigle) newGroupValue[sigle] = !newGroupValue[sigle]
      }
    })

    setGroupeValue(newGroupValue)
  }

  /**
   * Change les filtres au clic d'un bouton sexe
   * @param clickedSex L'initiale du sexe séléctionné, "H", ou "F"
   */
  const handleSexClick = (clickedSex: Filter.Gender) => {
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
  const handleAgeSlider = (domain: Filter.AgeDomain) => {
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
    IsInitialState: isInitialState,
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
    handleSearch,
    handleGroupClick,
    handleSexClick,
    handleAgeSlider,
    handleReset,
  }
}
