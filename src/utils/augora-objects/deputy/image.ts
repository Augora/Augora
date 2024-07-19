import GDR from "images/logos/groupes-parlementaires/gdr.svg"
import LFI from "images/logos/groupes-parlementaires/lfi.svg"
import ECO from "images/logos/groupes-parlementaires/eco.svg"
import LDR from "images/logos/groupes-parlementaires/ldr.svg"
import AD from "images/logos/groupes-parlementaires/ad.svg"
import LIOT from "images/logos/groupes-parlementaires/lt.svg"
import DEM from "images/logos/groupes-parlementaires/dem.svg"
import EPR from "images/logos/groupes-parlementaires/epr.svg"
import HOR from "images/logos/groupes-parlementaires/hor.svg"
import NI from "images/logos/groupes-parlementaires/ni.svg"
import PS from "images/logos/groupes-parlementaires/ps.svg"
import RN from "images/logos/groupes-parlementaires/rn.svg"
import RN_PARTI from "images/logos/partis-politiques/rn.svg"
import LFI_PARTI from "images/logos/partis-politiques/lfi.svg"
import LR_PARTI from "images/logos/partis-politiques/lr.svg"
import RPS from "images/logos/partis-politiques/rps.png"
import LREM from "images/logos/partis-politiques/lrem.svg"
import MD from "images/logos/partis-politiques/md.svg"
import UDI_PARTI from "images/logos/partis-politiques/udi.png"
import PCF from "images/logos/partis-politiques/pcf.svg"
import PRG from "images/logos/partis-politiques/prg.png"
import PPM from "images/logos/partis-politiques/ppm.png"
import CAP from "images/logos/partis-politiques/cap.png"
import DLF from "images/logos/partis-politiques/dlf.png"
import TAPURA from "images/logos/partis-politiques/tapura.png"
import TAVINI from "images/logos/partis-politiques/tavini.png"
import CE from "images/logos/partis-politiques/ce.png"
import PS_PARTI from "images/logos/partis-politiques/ps.svg"
import EELV from "images/logos/partis-politiques/eelv.svg"
import type { StaticImageData } from "next/image"

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
 * @param {string} group Sigle
 * @returns politic group's logo
 */
export function getGroupLogoImport(group: string): React.FunctionComponent<React.SVGProps<SVGSVGElement>> {
  switch (group) {
    case "ECO":
      return ECO
    case "GDR":
      return GDR
    case "LFI":
      return LFI
    case "SOC":
      return PS
    case "LIOT":
      return LIOT
    case "EPR":
      return EPR
    case "DEM":
      return DEM
    case "HOR":
      return HOR
    case "LDR":
      return LDR
    case "AD":
      return AD
    case "RN":
      return RN
    case "NI":
      return NI
    default:
      return NI
  }
}

/**
 *
 * @param {string} party Sigle
 * @returns politic party's logo
 */
export function getPartyLogoImport(party: string): React.FunctionComponent<React.SVGProps<SVGSVGElement>> | StaticImageData {
  switch (party) {
    case "Parti radical de gauche":
      return PRG
    case "La France Insoumise":
      return LFI_PARTI
    case "Tapura Huiraatira":
      return TAPURA
    case "Cap sur l'avenir":
      return CAP
    case "Calédonie Ensemble":
      return CE
    case "Tavini Huiraatira No Te Ao Ma'ohi - Front de libération de Polynésie":
      return TAVINI
    case "Parti communiste français":
      return PCF
    case "Parti socialiste":
      return PS_PARTI
    case "Régions et peuples solidaires":
      return RPS
    case "Europe Écologie Les Verts":
      return EELV
    case "Parti progressiste martiniquais":
      return PPM
    case "Mouvement Démocrate":
      return MD
    case "La République en Marche":
      return LREM
    case "Union des démocrates, radicaux et libéraux":
      return UDI_PARTI
    case "Les Républicains":
      return LR_PARTI
    case "Debout la France":
      return DLF
    case "Rassemblement national":
      return RN_PARTI
    default:
      return null
  }
}
