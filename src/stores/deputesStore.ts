import create, { SetState, UseStore, StoreApi } from "zustand"
import Fuse from "fuse.js"
import deburr from "lodash/deburr"

import { getAgeDomain, filterList, getGroupValue } from "components/deputies-list/deputies-list-utils"

type FilterState = {
  isInitialState: boolean
  deputesInitialList: Deputy.DeputiesList
  deputesFilteredList: Deputy.DeputiesList
  groupesInitialList: Group.GroupsList
  selectedGroupes: Filter.GroupValue
  selectedGenders: Filter.SelectedGenders
  ageDomain: Filter.AgeDomain
  keyword: string
  setSelectedGroupes(selectedGroupes: Filter.GroupValue): void
  setAgeDomain(ageDomain: Filter.AgeDomain): void
  setSelectedGenders(selectedGenders: Filter.SelectedGenders): void
  setKeyword(keyword: string): void
}

const fuseOptions = {
  threshold: 0.4,
  keys: ["NomToSearch", "Nom"],
}

function applyFilters(
  initialList: Deputy.DeputiesList,
  GroupeValue: Filter.GroupValue,
  SexValue: Filter.SelectedGenders,
  AgeDomain: Filter.AgeDomain,
  keyword: string
) {
  var result = initialList
  if (keyword.length > 1) {
    const fuse = new Fuse(initialList, fuseOptions)
    result = fuse.search(keyword).map((i) => i.item)
  }

  return filterList(result, {
    GroupeValue,
    SexValue,
    AgeDomain,
  })
}

const deputeStore = create<FilterState>((set) => ({
  isInitialState: true,
  deputesInitialList: [],
  deputesFilteredList: [],
  groupesInitialList: [],
  selectedGroupes: {},
  selectedGenders: {
    H: true,
    F: true,
  },
  ageDomain: [0, 100],
  keyword: "",

  setSelectedGroupes(selectedGroupes: Filter.GroupValue) {
    set((state) => {
      const newFilteredList = applyFilters(
        state.deputesInitialList,
        selectedGroupes,
        state.selectedGenders,
        state.ageDomain,
        state.keyword
      )
      return {
        isInitialState: newFilteredList.length === state.deputesInitialList.length && state.keyword.length === 0,
        deputesFilteredList: newFilteredList,
        selectedGroupes,
      }
    })
  },

  setAgeDomain(ageDomain: Filter.AgeDomain) {
    set((state) => {
      const newFilteredList = applyFilters(
        state.deputesInitialList,
        state.selectedGroupes,
        state.selectedGenders,
        ageDomain,
        state.keyword
      )
      return {
        isInitialState: newFilteredList.length === state.deputesInitialList.length && state.keyword.length === 0,
        deputesFilteredList: newFilteredList,
        ageDomain,
      }
    })
  },

  setSelectedGenders(selectedGenders: Filter.SelectedGenders) {
    set((state) => {
      const newFilteredList = applyFilters(
        state.deputesInitialList,
        state.selectedGroupes,
        selectedGenders,
        state.ageDomain,
        state.keyword
      )
      return {
        isInitialState: newFilteredList.length === state.deputesInitialList.length && state.keyword.length === 0,
        deputesFilteredList: newFilteredList,
        selectedGenders,
      }
    })
  },

  setKeyword(keyword: string) {
    set((state) => {
      const newFilteredList = applyFilters(
        state.deputesInitialList,
        state.selectedGroupes,
        state.selectedGenders,
        state.ageDomain,
        keyword
      )
      return {
        isInitialState: newFilteredList.length === state.deputesInitialList.length && keyword.length === 0,
        deputesFilteredList: newFilteredList,
        keyword,
      }
    })
  },
}))

export function hydrateStoreWithInitialLists(deputesList: Deputy.DeputiesList, groupesList: Group.GroupsList) {
  const state = deputeStore.getState()
  const groupSigles = groupesList.map((g) => g.Sigle)
  if (state.deputesInitialList.length === 0 && deputesList && groupesList) {
    deputeStore.setState({
      deputesInitialList: deputesList.map((d) => Object.assign({}, d, { NomToSearch: deburr(d.Nom) })),
      deputesFilteredList: applyFilters(
        deputesList,
        getGroupValue(groupSigles),
        {
          H: true,
          F: true,
        },
        getAgeDomain(deputesList),
        ""
      ),
      groupesInitialList: groupesList,
      selectedGroupes: getGroupValue(groupSigles),
      selectedGenders: {
        H: true,
        F: true,
      },
      ageDomain: getAgeDomain(deputesList),
      keyword: "",
    })
  }
}

export default deputeStore
