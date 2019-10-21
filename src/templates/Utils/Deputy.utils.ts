import { IGeneralInformation } from "Components/Deputy/GeneralInformation/GeneralInformation"
import { ICoworkers } from "Components/Deputy/Coworkers/Coworkers"
import { ICoworker } from "Components/Deputy/Coworkers/Coworker/Coworker"
import { ICirco } from "Components/Deputy/MapCirco/MapCirco"
import { ICurrentMandate} from "Components/Deputy/CurrentMandate/CurrentMandate"
import { IOldMandates} from "Components/Deputy/OldMandates/OldMandates"
import { IOthersMandates} from "Components/Deputy/OthersMandates/OthersMandates"
import { ITotalMandates} from "Components/Deputy/TotalMandates/TotalMandates"
import constructifs from "images/Logos/groupes parlementaires/constructifs/constructifs_grand.png"
import gdr from "images/Logos/groupes parlementaires/gdr/gdr_grand.png"
import l_t from "images/Logos/groupes parlementaires/l_t/l_t_grand.png"
import lfi from "images/Logos/groupes parlementaires/lfi/lfi_grand.png"
import lr from "images/Logos/groupes parlementaires/lr/lr_grand.png"
import lrem from "images/Logos/groupes parlementaires/lrem/lrem_grand.png"
import modem from "images/Logos/groupes parlementaires/modem/modem_grand.png"
import non_inscrits from "images/Logos/groupes parlementaires/non inscrits/non_inscrits_moyen.png"
import ps from "images/Logos/groupes parlementaires/ps/ps_grand.png"
import udi from "images/Logos/partis politiques/udi/udi_grand.png"

export function getGender(deputy) {
  if (deputy.sexe === "H") {
    return "Député"
  } else {
    return "Députée"
  }
}

export function getPoliticGroupPicture(politicGroup: string) {
  switch (politicGroup) {
    case "constructifs":
      return constructifs
    case "GDR":
      return gdr
    case "l_t":
      return l_t
    case "LFI":
      return lfi
    case "LR":
      return lr
    case "LREM":
      return lrem
    case "MODEM":
      return modem
    case "NI":
      return non_inscrits
    case "SOC":
      return ps
    case "UDI":
      return udi
    default:
      return non_inscrits
  }
}

export function getImageDynamic(slug: string, height: number) {
  return `https://www.nosdeputes.fr/depute/photo/${slug}/${height}`
}

export function getGeneralInformation(deputy: any, imgPixel: number) {
  var props: IGeneralInformation = {
    id: deputy.slug,
    circonscriptionNumber: deputy.numCirco,
    circonscriptionName: deputy.nomCirco,
    lastName: deputy.nomDeFamille,
    firstName: deputy.prenom,
    picture: getImageDynamic(deputy.slug, imgPixel),
    pictureGroup: getPoliticGroupPicture(deputy.groupeSigle),
    groupSymbol: deputy.groupeSigle,
    gender: getGender(deputy),
  }

  return props
}

export function getCoworkers(deputy: any): ICoworkers {
  const coworkers: Array<ICoworker> = deputy.collaborateurs.map(collab => {
    const coworker: ICoworker = {
      coworker: collab,
    }

    return coworker;
  })

  const props: ICoworkers = {
    coworkers: coworkers,
  }

  return props;
}

export function getCirco(deputy: any) {
  var props: ICirco = {
    nom: deputy.nomCirco,
    num: deputy.numCirco
  }

  return props;
}
  
export function getCurrentMandate(deputy: any): ICurrentMandate {
  var props: ICurrentMandate = {
    dateBegin : deputy.mandatDebut,
    isInMandate : deputy.estEnMandat,
    numberMandates : deputy.nombreMandats
  }

  return props;
}

export function getOldMandates(deputy: any): IOldMandates {
  var props: IOldMandates = {
    oldMandates : deputy.anciensMandats
  }

  return props;
}

export function getOthersMandates(deputy: any): IOthersMandates {
  var props: IOthersMandates = {
    othersMandates : deputy.autresMandats
  }

  return props;
}

export function getTotalMandates(deputy: any): ITotalMandates {
  var props: ITotalMandates = {
    numberMandates : deputy.nombreMandats
  }

  return props;
}
