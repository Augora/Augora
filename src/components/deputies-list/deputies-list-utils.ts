import UDI from "images/logos/groupes-parlementaires/udi.svg"
import GDR from "images/logos/groupes-parlementaires/gdr.svg"
import LFI from "images/logos/groupes-parlementaires/lfi.svg"
import LR from "images/logos/groupes-parlementaires/lr.svg"
import LREM from "images/logos/groupes-parlementaires/lrem.svg"
import LT from "images/logos/groupes-parlementaires/lt.svg"
import MODEM from "images/logos/groupes-parlementaires/modem.svg"
import NI from "images/logos/groupes-parlementaires/ni.svg"
import PS from "images/logos/groupes-parlementaires/ps.svg"
import AE from "images/logos/groupes-parlementaires/ae.svg"

export const calculateNbDepute = (list: Deputy.DeputiesList, type: string, value: string): number => {
  if (list.length > 0) {
    const filteredList = list
    switch (type) {
      case "groupe":
        return filteredList.filter((depute) => {
          return depute.GroupeParlementaire.Sigle === value ? true : false
        }).length
      case "sexe":
        return filteredList.filter((depute) => {
          return depute.Sexe === value ? true : false
        }).length
      default:
        return filteredList.length
    }
  } else return 0
}

export const calculateAgeDomain = (list: Deputy.DeputiesList): Filter.AgeDomain => {
  const listAge = list.map((depute) => depute.Age)
  return [Math.min(...listAge), Math.max(...listAge)]
}

export const groupesArrayToObject = (array: string[], value = true): Filter.GroupValue => {
  const defaultGroups: Filter.GroupValue = {
    AE: true,
    GDR: true,
    LFI: true,
    LR: true,
    LREM: true,
    LT: true,
    MODEM: true,
    NI: true,
    SOC: true,
    UDI: true,
  }
  return array.reduce((a, b) => ((a[b] = value), a), defaultGroups)
}

export const filterList = (
  list: Deputy.DeputiesList,
  state: {
    AgeDomain: Filter.AgeDomain
    GroupeValue: Filter.GroupValue
    SexValue: Filter.SelectedGenders
  }
): Deputy.DeputiesList => {
  return list
    .filter((depute) => {
      return state.GroupeValue[depute.GroupeParlementaire.Sigle] ? true : false
    })
    .filter((depute) => {
      return state.SexValue[depute.Sexe] ? true : false
    })
    .filter((depute) => {
      return depute.Age >= state.AgeDomain[0] && depute.Age <= state.AgeDomain[1]
    })
}

/**
 * Renvoie le SVG d'un groupe
 * @param {string} groupe Le sigle du groupe
 */
export function groupeIconByGroupeSigle(groupe: Group.Sigle) {
  switch (groupe) {
    case "LFI":
      return LFI
    case "GDR":
      return GDR
    case "LT":
      return LT
    case "MODEM":
      return MODEM
    case "SOC":
      return PS
    case "LR":
      return LR
    case "LREM":
      return LREM
    case "UDI":
      return UDI
    case "AE":
      return AE
    default:
      return NI
  }
}
