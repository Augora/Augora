import UDI from "images/logos/groupes-parlementaires/udi/udi_blanc.png"
import GDR from "images/logos/groupes-parlementaires/gdr/gdr_blanc.png"
import LT from "images/logos/groupes-parlementaires/lt/lt_blanc.png"
import LFI from "images/logos/groupes-parlementaires/lfi/lfi_blanc.png"
import LR from "images/logos/groupes-parlementaires/lr/lr_blanc.png"
import LREM from "images/logos/groupes-parlementaires/lrem/lrem_blanc.png"
import MODEM from "images/logos/groupes-parlementaires/modem/modem_blanc.png"
import NonInscrits from "images/logos/groupes-parlementaires/ni/ni_blanc.png"
import PS from "images/logos/groupes-parlementaires/ps/ps_blanc.png"
import uai from "images/logos/groupes-parlementaires/udi/udi_blanc.png"

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
    case "UDI":
      return UDI
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
