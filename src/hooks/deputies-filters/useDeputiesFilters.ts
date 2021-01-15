import deputeStore from "stores/deputesStore"

import { getAgeDomain, groupesArrayToObject } from "../../components/deputies-list/deputies-list-utils"

export default function useDeputiesFilters(deputiesList = [], groupesList = []) {
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
  const handleSearchValue = (value: string) => {
    search(value)
  }

  const handleClickOnGroupe = (sigle: Group.Sigle) => {
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

  const handleClickOnSex = (clickedSex: Filter.Gender) => {
    const currentSexValue = SexValue[clickedSex]
    const otherSex = clickedSex === "F" ? "H" : "F"

    if (!SexValue[otherSex]) {
      SexValue[clickedSex] = false
      SexValue[otherSex] = true
    } else {
      SexValue[clickedSex] = !currentSexValue
    }

    setSexValue(Object.assign({}, SexValue))
  }

  const handleAgeSelection = (domain: Filter.AgeDomain) => {
    setAgeDomain(domain)
  }

  const handleReset = () => {
    search("")
    setGroupeValue(groupesArrayToObject(initialGroupesList.map((g) => g.Sigle)) as any)
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
