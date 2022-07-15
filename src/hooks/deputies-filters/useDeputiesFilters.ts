import deputeStore from "stores/deputesStore"
import debounce from "lodash/debounce"
import { getAgeDomain, getGroupValue } from "components/deputies-list/deputies-list-utils"

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
  const handleSearch = debounce((value: string) => search(value), 500)

  /**
   * Change l'état des filtres au clic d'un bouton groupe
   * @param sigle Le sigle du groupe
   */
  const handleGroupClick = (sigle: string) => {
    GroupeValue[sigle] = !GroupeValue[sigle]
    setGroupeValue(GroupeValue)
  }

  /**
   * Change les filtres au clic d'un bouton sexe
   * @param clickedSex L'initiale du sexe séléctionné, "H", ou "F"
   */
  const handleSexClick = (clickedSex: Filter.Gender) => {
    SexValue[clickedSex] = !SexValue[clickedSex]
    setSexValue(SexValue)
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
    setSexValue({ H: false, F: false })
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
