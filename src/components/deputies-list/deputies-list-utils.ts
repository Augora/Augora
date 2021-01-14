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

export enum Sigle {
  LFI = "LFI",
  GDR = "GDR",
  SOC = "SOC",
  LT = "LT",
  MODEM = "MODEM",
  LREM = "LREM",
  UDI = "UDI",
  AE = "AE",
  LR = "LR",
  NI = "NI",
}

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

export function groupeIconByGroupeSigle(groupe: Sigle) {
  switch (groupe) {
    case Sigle.LFI:
      return LFI
    case Sigle.GDR:
      return GDR
    case Sigle.LT:
      return LT
    case Sigle.MODEM:
      return MODEM
    case Sigle.SOC:
      return PS
    case Sigle.LR:
      return LR
    case Sigle.LREM:
      return LREM
    case Sigle.UDI:
      return UDI
    case Sigle.AE:
      return AE
    default:
      return NI
  }
}
