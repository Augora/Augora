import constructifs from "images/logos/groupes-parlementaires/constructifs/constructifs_blanc.png"
import gdr from "images/logos/groupes-parlementaires/gdr/gdr_grand.png"
import lfi from "images/logos/groupes-parlementaires/lfi/lfi_blanc.png"
import lr from "images/logos/groupes-parlementaires/lr/lr_blanc.png"
import lrem from "images/logos/groupes-parlementaires/lrem/lrem_blanc.png"
import lt from "images/logos/groupes-parlementaires/lt/lt_blanc.png"
import modem from "images/logos/groupes-parlementaires/modem/modem_blanc.png"
import ni from "images/logos/groupes-parlementaires/ni/ni_moyen.png"
import ps from "images/logos/groupes-parlementaires/ps/ps_blanc.png"

export const calculateNbDepute = (list, type, value) => {
  if (list.length > 0) {
    const filteredList = list
    switch (type) {
      case "groupe":
        return filteredList.filter(depute => {
          return depute.SigleGroupePolitique === value ? true : false
        }).length
      case "sexe":
        return filteredList.filter(depute => {
          return depute.Sexe === value ? true : false
        }).length
      default:
        return filteredList.length
    }
  } else {
    return list
  }
}

export const calculateAgeDomain = list => {
  const listAge = list.map(depute => depute.Age)
  return [Math.min(...listAge), Math.max(...listAge)]
}

export const groupesArrayToObject = (array, value = true) => {
  return array.reduce((a, b) => ((a[b] = value), a), {}) // eslint-disable-line
}

export const filterList = (list, state) => {
  return list
    .filter(depute => {
      return state.GroupeValue[depute.SigleGroupePolitique] ? true : false
    })
    .filter(depute => {
      return state.SexValue[depute.Sexe] ? true : false
    })
    .filter(depute => {
      return (
        depute.Age >= state.AgeDomain[0] && depute.Age <= state.AgeDomain[1]
      )
    })
}

export const groupeIconByDeputy = deputy => {
  const selectedGroupe = deputy.GroupeParlementaire.Sigle

  let selectedGroupeIcon = ni
  switch (selectedGroupe) {
    case "LFI":
      selectedGroupeIcon = lfi
      break
    case "GDR":
      selectedGroupeIcon = gdr
      break
    case "LT":
      selectedGroupeIcon = lt
      break
    case "MODEM":
      selectedGroupeIcon = modem
      break
    case "SOC":
      selectedGroupeIcon = ps
      break
    case "LR":
      selectedGroupeIcon = lr
      break
    case "LREM":
      selectedGroupeIcon = lrem
      break
    case "UDI":
      selectedGroupeIcon = constructifs
      break
    case "UAI":
      selectedGroupeIcon = constructifs
      break
    default:
      selectedGroupeIcon = ni
      break
  }

  return selectedGroupeIcon
}
