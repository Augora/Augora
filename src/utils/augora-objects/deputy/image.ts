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
      return NI
    case "SOC":
      return PS
    case "UAI":
      return UDI
    case "AE":
      return AE
    default:
      return NI
  }
}

export function getPoliticPartyPhotoImport(party: string) {
  switch (party) {
    case "Les Républicains":
      return LR
    default:
      return null
  }
}
