import create, { SetState, UseStore, StoreApi } from "zustand"
import Fuse from "fuse.js"
import deburr from "lodash/deburr"

import { calculateAgeDomain, filterList, groupesArrayToObject } from "components/deputies-list/deputies-list-utils"

type SelectedGenders = {
  H: Boolean
  F: Boolean
}

type State = {
  deputesInitialList: Array<any>
  deputesFilteredList: Array<any>
  groupesInitialList: Array<any>
  selectedGroupes: Array<any>
  selectedGenders: SelectedGenders
  ageDomain: Array<any>
  keyword: string
  setSelectedGroupes(selectedGroupes: Array<any>): void
  setAgeDomain(ageDomain: Array<any>): void
  setSelectedGenders(selectedGenders: SelectedGenders): void
  setKeyword(keyword: string): void
}

const fuseOptions = {
  threshold: 0.4,
  keys: ["NomToSearch"],
}

function applyFilters(initialList: Array<any>, GroupeValue: Array<any>, SexValue, AgeDomain: Array<any>, keyword: string) {
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

  setSelectedGroupes(selectedGroupes: Array<any>) {
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

  setAgeDomain(ageDomain: Array<any>) {
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

  setSelectedGenders(selectedGenders: SelectedGenders) {
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

export function hydrateStoreWithInitialLists(deputesList, groupesList) {
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
        calculateAgeDomain(deputesList),
        ""
      ),
      groupesInitialList: groupesList,
      selectedGroupes: groupesArrayToObject(groupesList.map((g) => g.Sigle)),
      selectedGenders: {
        H: true,
        F: true,
      },
      ageDomain: calculateAgeDomain(deputesList),
      keyword: "",
    })
  }
}

export default deputeStore
