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
    //Check if any group is disabled
    var isAnyUnchecked = false

    for (var key in GroupeValue) {
      if (!GroupeValue[key]) {
        isAnyUnchecked = true
        break
      }
    }

    const newGroupeValue = Object.keys(GroupeValue).forEach((key) => {
      if (sigle == key) {
        GroupeValue[key] = isAnyUnchecked ? !GroupeValue[key] : true //Toggle selected group if any group is disabled, else enable it
      } else if (!isAnyUnchecked) {
        GroupeValue[key] = false //Disable all groups only if none are disabled
      }
    })

    setGroupeValue(Object.assign({}, GroupeValue, newGroupeValue))
  }

  const handleClickOnSex = (clickedSex) => {
    const actualValueOfSex = SexValue[clickedSex]
    setSexValue(
      Object.assign({}, SexValue, {
        [clickedSex]: !actualValueOfSex,
      })
    )
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
