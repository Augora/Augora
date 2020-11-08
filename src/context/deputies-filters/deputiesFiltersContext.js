import React, { useState, createContext } from "react"

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
  handleSearchValue: (f) => f,
  handleClickOnAllGroupes: (f) => f,
  handleClickOnGroupe: (f) => f,
  handleClickOnSex: (f) => f,
  handleAgeSelection: (f) => f,
  handleReset: (f) => f,
}

export const DeputiesListContext = createContext(initialState)

export default function DeputiesListProvider(props) {
  const [orderedGroupes] = useState(props.initialData ? props.initialData.data.GroupesParlementairesDetailsActifs.data : [])
  const [deputies] = useState(props.initialData ? props.initialData.data.DeputesEnMandat.data : [])

  const fullState = useDeputiesFilters(deputies, orderedGroupes)

  return <DeputiesListContext.Provider value={fullState}>{props.children}</DeputiesListContext.Provider>
}
