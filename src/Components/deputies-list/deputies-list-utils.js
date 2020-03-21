import constructifs from "images/logos/groupes-parlementaires/constructifs/constructifs_blanc.png"
import gdr from "images/logos/groupes-parlementaires/gdr/gdr_grand.png"
import lfi from "images/logos/groupes-parlementaires/lfi/lfi_blanc.png"
import lr from "images/logos/groupes-parlementaires/lr/lr_blanc.png"
import lrem from "images/logos/groupes-parlementaires/lrem/lrem_blanc.png"
import lt from "images/logos/groupes-parlementaires/lt/lt_blanc.png"
import modem from "images/logos/groupes-parlementaires/modem/modem_blanc.png"
import ni from "images/logos/groupes-parlementaires/ni/ni_moyen.png"
import ps from "images/logos/groupes-parlementaires/ps/ps_blanc.png"

export const couleursGroupeParlementaire = {
  LREM: {
    couleur: "hsl(199, 100%, 58%)",
    nom_complet: "La République En Marche",
  },
  LR: {
    couleur: "hsl(223, 45%, 23%)",
    nom_complet: "Les Républicains",
  },
  MODEM: {
    couleur: "hsl(25, 81%, 54%)",
    nom_complet: "Mouvement Démocrate et apparentés",
  },
  SOC: {
    couleur: "hsl(354, 84%, 43%)",
    nom_complet: "Socialistes et apparentés",
  },
  UAI: {
    couleur: "hsl(194, 81%, 55%)",
    nom_complet: "UDI, Agir et Indépendants",
  },
  LFI: {
    couleur: "hsl(11, 66%, 47%)",
    nom_complet: "La France insoumise",
  },
  GDR: {
    couleur: "hsl(0, 100%, 43%)",
    nom_complet: "Gauche démocrate et républicaine",
  },
  LT: {
    couleur: "hsl(0, 0%, 50%)",
    nom_complet: "Libertés et Territoires",
  },
  NI: {
    couleur: "hsl(0, 0%, 80%)",
    nom_complet: "Non inscrits",
  },
  NG: {
    couleur: "hsl(0, 0%, 80%)",
    nom_complet: "Non inscrits",
  },
  UDI: {
    couleur: "hsl(261, 29%, 48%)",
    nom_complet: "Union des démocrates et indépendants",
  },
}

export const calculateNbDepute = (list, type, value) => {
  if (list.length > 0) {
    const filteredList = list
    switch (type) {
      case "groupe":
        return filteredList.filter(depute => {
          return depute.SigleGroupePolitique === value.groupe ? true : false
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

export const groupeIconByDeputy = (deputy) => {
  const selectedGroupe = deputy.GroupeParlementaire.Sigle

  let selectedGroupeIcon = ni
  switch (selectedGroupe) {
    case 'LFI':
      selectedGroupeIcon = lfi
      break;
    case 'GDR':
      selectedGroupeIcon = gdr
      break;
    case 'LT':
      selectedGroupeIcon = lt
      break;
    case 'MODEM':
      selectedGroupeIcon = modem
      break;
    case 'SOC':
      selectedGroupeIcon = ps
      break;
    case 'LR':
      selectedGroupeIcon = lr
      break;
    case 'LREM':
      selectedGroupeIcon = lrem
      break;
    case 'UDI':
      selectedGroupeIcon = constructifs
      break;
    case 'UAI':
      selectedGroupeIcon = constructifs
      break;
    default:
      selectedGroupeIcon = ni
      break;
  }

  return selectedGroupeIcon
}