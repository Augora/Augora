import UDI from "images/logos/groupes-parlementaires/udi/udi.svg"
import GDR from "images/logos/groupes-parlementaires/gdr/gdr.svg"
import LFI from "images/logos/groupes-parlementaires/lfi/lfi.svg"
import LR from "images/logos/groupes-parlementaires/lr/lr.svg"
import LREM from "images/logos/groupes-parlementaires/lrem/lrem.svg"
import LT from "images/logos/groupes-parlementaires/lt/lt.svg"
import MODEM from "images/logos/groupes-parlementaires/modem/modem.svg"
import NI from "images/logos/groupes-parlementaires/ni/ni.svg"
import PS from "images/logos/groupes-parlementaires/ps/ps.svg"
import AE from "images/logos/groupes-parlementaires/ae/ae.svg"

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

export const groupeIconByGroupeSigle = (groupe, color) => {
  switch (groupe) {
    case "LFI":
      return <LFI style={{ fill: color }} />
    case "GDR":
      return <GDR style={{ fill: color }} />
    case "LT":
      return <LT style={{ fill: color }} />
    case "MODEM":
      return <MODEM style={{ fill: color }} />
    case "SOC":
      return <PS style={{ fill: color }} />
    case "LR":
      return <LR style={{ fill: color }} />
    case "LREM":
      return <LREM style={{ fill: color }} />
    case "UDI":
      return <UDI style={{ fill: color }} />
    case "UAI":
      return <UDI style={{ fill: color }} />
    case "AE":
      return <AE style={{ fill: color }} />
    default:
      return <NI style={{ fill: color }} />
  }
}
