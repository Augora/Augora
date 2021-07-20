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

/**
 * Renvoie le nombre de députés d'un groupe donné
 * @param {Deputy.DeputiesList} list La liste à analyser
 * @param {string} value Le sigle du groupe
 */
export const getNbDeputiesGroup = (list: Deputy.DeputiesList, value: string): number => {
  if (list.length > 0) {
    return list.filter((depute) => {
      return depute.GroupeParlementaire.Sigle === value ? true : false
    }).length
  } else return 0
}

/**
 * Renvoie le nombre de députés d'un sexe donné
 * @param {Deputy.DeputiesList} list La liste à analyser
 * @param {Filter.Gender} value Le sigle du sexe, "H", ou "F"
 */
export const getNbDeputiesGender = (list: Deputy.DeputiesList, value: Filter.Gender): number => {
  if (list.length > 0) {
    return list.filter((depute) => {
      return depute.Sexe === value ? true : false
    }).length
  } else return 0
}

/**
 * Renvoie un array de 2 chiffres, le plus petit et le plus grand âge des députés
 * @param {Deputy.DeputiesList} list
 */
export const getAgeDomain = (list: Deputy.DeputiesList): Filter.AgeDomain => {
  const listAge = list.map((depute) => depute.Age)
  return [Math.min(...listAge), Math.max(...listAge)]
}

/**
 * Renvoie le plus grand nombre d'activité d'un député
 * @param {Deputy.Activite} list
 */
export const getNbActivitesMax = (list: Deputy.Activite[]): number => {
  if (list.length > 0) {
    return list.reduce((a, b) => {
      const max = Math.max(
        b.ParticipationEnHemicycle + b.ParticipationsEnCommission,
        b.PresenceEnHemicycle + b.PresencesEnCommission,
        b.Question
      )
      return max > a ? max : a
    }, 0)
  } else return 0
}

/**
 * Renvoie un object avec tous les groupes en clé et un boolean de s'ils sont actifs sur les filtres
 * @param sigles Array des sigles
 * @param value Valeur à set, true par défaut
 */
export const getGroupValue = (sigles: string[], value = true): Filter.GroupValue => {
  return sigles.reduce((a, b) => ((a[b] = value), a), {})
}

/**
 * Filtre la liste de députés selon le state des filtres
 * @param {Deputy.DeputiesList} list
 * @param state
 */
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
export function getGroupLogo(groupe: string) {
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
