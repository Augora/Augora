import { useState } from "react"
import { useFuzzy } from "react-use-fuzzy"
import { deburr } from "lodash"

import {
  calculateAgeDomain,
  filterList,
  groupesArrayToObject,
} from "../../components/deputies-list/deputies-list-utils"

export default function useDeputiesFilters(deputiesList, groupesList) {
  /*----------------------------------------------------*/
  // States
  /*----------------------------------------------------*/
  const [GroupeValue, setGroupeValue] = useState(
    groupesArrayToObject(groupesList.map((g) => g.Sigle))
  )

  const [SexValue, setSexValue] = useState({
    H: true,
    F: true,
  })

  const [AgeDomain, setAgeDomain] = useState(calculateAgeDomain(deputiesList))

  const { result, keyword, search } = useFuzzy(
    deputiesList.map((d) =>
      Object.assign({}, d, { NomToSearch: deburr(d.Nom) })
    ),
    {
      keys: ["NomToSearch"],
    }
  )

  const FilteredList = filterList(result, {
    GroupeValue,
    SexValue,
    AgeDomain,
  })

  /*----------------------------------------------------*/
  // Handlers
  /*----------------------------------------------------*/
  const handleSearchValue = (value) => {
    search(value)
  }

  const handleClickOnAllGroupes = (bool) => {
    const allGroupesNewValues = Object.keys(GroupeValue).forEach((groupe) => {
      GroupeValue[groupe] = bool
    })
    setGroupeValue(Object.assign({}, GroupeValue, allGroupesNewValues))
  }

  const handleClickOnGroupe = (sigle) => {
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
        GroupeValue[sigle] = !GroupeValue[sigle]
      }
    })

    setGroupeValue(Object.assign({}, GroupeValue))
  }

  const handleClickOnSex = (clickedSex) => {
    const allActive = SexValue.F === true && SexValue.H === true
    const otherSex = clickedSex === "F" ? "H" : "F"

    if (allActive) {
      SexValue[clickedSex] = true
      SexValue[otherSex] = false
    } else if (!SexValue[otherSex]) {
      SexValue[clickedSex] = false
      SexValue[otherSex] = true
    } else {
      SexValue[clickedSex] = true
    }

    setSexValue(Object.assign({}, SexValue))
  }

  const handleAgeSelection = (domain) => {
    setAgeDomain(domain)
  }

  const handleReset = () => {
    search("")
    setGroupeValue(groupesArrayToObject(groupesList.map((g) => g.Sigle)))
    setSexValue({ H: true, F: true })
    setAgeDomain(calculateAgeDomain(deputiesList))
  }

  const state = {
    GroupeValue,
    SexValue,
    AgeDomain,
    DeputiesList: deputiesList,
    FilteredList,
    GroupesList: groupesList,
    Keyword: keyword,
  }

  return {
    state,
    handleSearchValue,
    handleClickOnAllGroupes,
    handleClickOnGroupe,
    handleClickOnSex,
    handleAgeSelection,
    handleReset,
  }
}
