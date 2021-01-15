import create, { SetState, UseStore, StoreApi } from "zustand"
import Fuse from "fuse.js"
import deburr from "lodash/deburr"

import { getAgeDomain, filterList, groupesArrayToObject } from "components/deputies-list/deputies-list-utils"

type State = {
  deputesInitialList: Deputy.DeputiesList
  deputesFilteredList: Deputy.DeputiesList
  groupesInitialList: Group.GroupsList
  selectedGroupes: any
  selectedGenders: Filter.SelectedGenders
  ageDomain: Filter.AgeDomain
  keyword: Filter.Keyword
  setSelectedGroupes(selectedGroupes: Array<string>): void
  setAgeDomain(ageDomain: Filter.AgeDomain): void
  setSelectedGenders(selectedGenders: Filter.SelectedGenders): void
  setKeyword(keyword: string): void
}

const fuseOptions = {
  threshold: 0.4,
  keys: ["NomToSearch"],
}

function applyFilters(
  initialList: Deputy.DeputiesList,
  GroupeValue: any,
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

const deputeStore = create<State>((set) => ({
  deputesInitialList: [],
  deputesFilteredList: [],
  groupesInitialList: [],
  selectedGroupes: [],
  ageDomain: [0, 100],
  selectedGenders: {
    H: true,
    F: true,
  },
  keyword: "",

  setSelectedGroupes(selectedGroupes: any) {
    set((state) => ({
      deputesFilteredList: applyFilters(
        state.deputesInitialList,
        selectedGroupes,
        state.selectedGenders,
        state.ageDomain,
        state.keyword
      ),
      selectedGroupes,
    }))
  },

  setAgeDomain(ageDomain: Filter.AgeDomain) {
    set((state) => ({
      deputesFilteredList: applyFilters(
        state.deputesInitialList,
        state.selectedGroupes,
        state.selectedGenders,
        ageDomain,
        state.keyword
      ),
      ageDomain,
    }))
  },

  setSelectedGenders(selectedGenders: Filter.SelectedGenders) {
    set((state) => ({
      deputesFilteredList: applyFilters(
        state.deputesInitialList,
        state.selectedGroupes,
        selectedGenders,
        state.ageDomain,
        state.keyword
      ),
      selectedGenders,
    }))
  },

  setKeyword(keyword: string) {
    set((state) => ({
      deputesFilteredList: applyFilters(
        state.deputesInitialList,
        state.selectedGroupes,
        state.selectedGenders,
        state.ageDomain,
        keyword
      ),
      keyword,
    }))
  },
}))

export function hydrateStoreWithInitialLists(deputesList: Deputy.DeputiesList, groupesList: Group.GroupsList) {
  const state = deputeStore.getState()
  if (state.deputesInitialList.length === 0 && deputesList && groupesList) {
    deputeStore.setState({
      deputesInitialList: deputesList.map((d) => Object.assign({}, d, { NomToSearch: deburr(d.Nom) })),
      deputesFilteredList: applyFilters(
        deputesList,
        groupesArrayToObject(groupesList.map((g) => g.Sigle)),
        {
          H: true,
          F: true,
        },
        getAgeDomain(deputesList),
        ""
      ),
      groupesInitialList: groupesList,
      selectedGroupes: groupesArrayToObject(groupesList.map((g) => g.Sigle)) as any,
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
