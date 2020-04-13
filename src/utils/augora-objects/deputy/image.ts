import Constructifs from "images/logos/groupes-parlementaires/constructifs/constructifs_grand.png"
import GDR from "images/logos/groupes-parlementaires/gdr/gdr_grand.png"
import LT from "images/logos/groupes-parlementaires/lt/lt_grand.png"
import LFI from "images/logos/groupes-parlementaires/lfi/lfi_grand.png"
import LR from "images/logos/groupes-parlementaires/lr/lr_grand.png"
import LREM from "images/logos/groupes-parlementaires/lrem/lrem_grand.png"
import MODEM from "images/logos/groupes-parlementaires/modem/modem_grand.png"
import NonInscrits from "images/logos/groupes-parlementaires/ni/ni_grand.png"
import PS from "images/logos/groupes-parlementaires/ps/ps_grand.png"
import uai from "images/logos/groupes-parlementaires/constructifs/constructifs_grand.png"

/**
 * Match the politic group's photo import with his acronym
 *
 * @export
 * @param {string} politicGroupAcronym
 * @returns politic group's photo import
 */
export function getDeputyPhotoURL(slug: string, height: number) {
  return `https://www.nosdeputes.fr/depute/photo/${slug}/${height}`
}

/**
 * Match the politic group's photo import with his acronym
 *
 * @export
 * @param {string} politicGroupAcronym
 * @returns politic group's photo import
 */
export function getPoliticGroupPhotoImport(politicGroupAcronym: string) {
  switch (politicGroupAcronym) {
    case "Constructifs":
      return Constructifs
    case "GDR":
      return GDR
    case "LT":
      return LT
    case "LFI":
      return LFI
    case "LR":
      return LR
    case "LREM":
      return LREM
    case "MODEM":
      return MODEM
    case "NI":
      return NonInscrits
    case "SOC":
      return PS
    case "UAI":
      return uai
    default:
      return NonInscrits
  }
}
