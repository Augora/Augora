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
  handleSearchValue: (f) => f,
  handleClickOnGroupe: (f) => f,
  handleClickOnSex: (f) => f,
  handleAgeSelection: (f) => f,
  handleReset: (f) => f,
}

export const DeputiesListContext = createContext(initialState)

export default function DeputiesListProvider(props) {
  const [orderedGroupes] = useState(
    props.initialData ? sortBy(props.initialData.data.GroupesParlementairesDetailsActifs.data, "Ordre") : []
  )
  const [deputies] = useState(props.initialData ? sortBy(props.initialData.data.DeputesEnMandat.data, "Ordre") : [])

  const fullState = useDeputiesFilters(deputies, orderedGroupes)

  return <DeputiesListContext.Provider value={fullState}>{props.children}</DeputiesListContext.Provider>
}
