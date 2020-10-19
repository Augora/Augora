import udi from "images/logos/groupes-parlementaires/udi/udi_blanc.png"
import gdr from "images/logos/groupes-parlementaires/gdr/gdr_blanc.png"
import lfi from "images/logos/groupes-parlementaires/lfi/lfi_blanc.png"
import lr from "images/logos/groupes-parlementaires/lr/lr_blanc.png"
import lrem from "images/logos/groupes-parlementaires/lrem/lrem_blanc.png"
import lt from "images/logos/groupes-parlementaires/lt/lt_blanc.png"
import modem from "images/logos/groupes-parlementaires/modem/modem_blanc.png"
import ni from "images/logos/groupes-parlementaires/ni/ni_blanc.png"
import ps from "images/logos/groupes-parlementaires/ps/ps_blanc.png"
import ae from "images/logos/groupes-parlementaires/ae/ae_blanc.png"
import udicolor from "images/logos/groupes-parlementaires/udi/udi_color.png"
import gdrcolor from "images/logos/groupes-parlementaires/gdr/gdr_color.png"
import lficolor from "images/logos/groupes-parlementaires/lfi/lfi_color.png"
import lrcolor from "images/logos/groupes-parlementaires/lr/lr_color.png"
import lremcolor from "images/logos/groupes-parlementaires/lrem/lrem_color.png"
import ltcolor from "images/logos/groupes-parlementaires/lt/lt_color.png"
import modemcolor from "images/logos/groupes-parlementaires/modem/modem_color.png"
import nicolor from "images/logos/groupes-parlementaires/ni/ni_color.png"
import pscolor from "images/logos/groupes-parlementaires/ps/ps_color.png"
import aecolor from "images/logos/groupes-parlementaires/ae/ae_color.png"

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
  return array.reduce((a, b) => ((a[b] = value), a), {}) // eslint-disable-line
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
      return (
        depute.Age >= state.AgeDomain[0] && depute.Age <= state.AgeDomain[1]
      )
    })
}

export const groupeIconByGroupeSigle = (groupe, isDisabled) => {
  let selectedGroupeIcon = ni
  switch (groupe) {
    case "LFI":
      isDisabled ? (selectedGroupeIcon = lficolor) : (selectedGroupeIcon = lfi)
      break
    case "GDR":
      isDisabled ? (selectedGroupeIcon = gdrcolor) : (selectedGroupeIcon = gdr)
      break
    case "LT":
      isDisabled ? (selectedGroupeIcon = ltcolor) : (selectedGroupeIcon = lt)
      break
    case "MODEM":
      isDisabled
        ? (selectedGroupeIcon = modemcolor)
        : (selectedGroupeIcon = modem)
      break
    case "SOC":
      isDisabled ? (selectedGroupeIcon = pscolor) : (selectedGroupeIcon = ps)
      break
    case "LR":
      isDisabled ? (selectedGroupeIcon = lrcolor) : (selectedGroupeIcon = lr)
      break
    case "LREM":
      isDisabled
        ? (selectedGroupeIcon = lremcolor)
        : (selectedGroupeIcon = lrem)
      break
    case "UDI":
      isDisabled ? (selectedGroupeIcon = udicolor) : (selectedGroupeIcon = udi)
      break
    case "UAI":
      isDisabled ? (selectedGroupeIcon = udicolor) : (selectedGroupeIcon = udi)
      break
    case "AE":
      isDisabled ? (selectedGroupeIcon = aecolor) : (selectedGroupeIcon = ae)
      break
    default:
      isDisabled ? (selectedGroupeIcon = nicolor) : (selectedGroupeIcon = ni)
      break
  }

  return selectedGroupeIcon
}
