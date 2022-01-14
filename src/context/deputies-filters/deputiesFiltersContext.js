import React, { useState, createContext } from "react"
import sortBy from "lodash/sortBy"

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
  handleSearch: (f) => f,
  handleGroupClick: (f) => f,
  handleSexClick: (f) => f,
  handleAgeSlider: (f) => f,
  handleReset: (f) => f,
}

export const DeputiesListContext = createContext(initialState)

export default function DeputiesListProvider(props) {
  const [orderedGroupes] = useState(props.initialData ? sortBy(props.initialData.groupes, "Ordre") : [])
  const [deputies] = useState(props.initialData ? sortBy(props.initialData.deputes, "Ordre") : [])

  const fullState = useDeputiesFilters(deputies, orderedGroupes)

  return <DeputiesListContext.Provider value={fullState}>{props.children}</DeputiesListContext.Provider>
}
