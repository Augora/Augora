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

export const calculateNbDepute = (list, type, value) => {
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

export const calculateAgeDomain = (list) => {
  const listAge = list.map((depute) => depute.Age)
  return [Math.min(...listAge), Math.max(...listAge)]
}

export const groupesArrayToObject = (array, value = true) => {
  return array.reduce((a, b) => ((a[b] = value), a), {})
}

export const filterList = (list, state) => {
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

export function groupeIconByGroupeSigle(groupe) {
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
    case "UAI":
      return UDI
    case "AE":
      return AE
    default:
      return NI
  }
}
