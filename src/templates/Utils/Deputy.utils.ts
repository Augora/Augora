import { IGeneralInformation } from "Components/Deputy/GeneralInformation/GeneralInformation"
import { ICoworkers } from "Components/Deputy/Coworkers/Coworkers"
import { ICoworker } from "Components/Deputy/Coworkers/Coworker/Coworker"
import { ICirco } from "Components/Deputy/MapCirco/MapCirco"
import { IMandate } from "Components/Deputy/CurrentMandate/CurrentMandate"
import constructifs from "images/Logos/groupes_parlementaires/constructifs/constructifs_grand.png"
import gdr from "images/Logos/groupes_parlementaires/gdr/gdr_grand.png"
import l_t from "images/Logos/groupes_parlementaires/l_t/l_t_grand.png"
import lfi from "images/Logos/groupes_parlementaires/lfi/lfi_grand.png"
import lr from "images/Logos/groupes_parlementaires/lr/lr_grand.png"
import lrem from "images/Logos/groupes_parlementaires/lrem/lrem_grand.png"
import modem from "images/Logos/groupes_parlementaires/modem/modem_grand.png"
import non_inscrits from "images/Logos/groupes_parlementaires/non inscrits/non_inscrits_moyen.png"
import ps from "images/Logos/groupes_parlementaires/ps/ps_grand.png"
import uai from "images/Logos/groupes_parlementaires/constructifs/constructifs_grand.png"

export function getGender(deputy) {
  if (deputy.Sexe === "H") {
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
    case "LT":
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
    case "UAI":
      return uai
    default:
      return non_inscrits
  }
}

export function getImageDynamic(slug: string, height: number) {
  return `https://www.nosdeputes.fr/depute/photo/${slug}/${height}`
}

export function getOldGeneralInformation(deputy: any, imgPixel: number) {
  var props: IGeneralInformation = {
    id: deputy.Slug,
    circonscriptionNumber: deputy.NumeroCirconscription,
    circonscriptionName: deputy.NomCirconscription,
    lastName: deputy.NomDeFamille,
    firstName: deputy.Prenom,
    picture: getImageDynamic(deputy.Slug, imgPixel),
    pictureGroup: getPoliticGroupPicture(deputy.SigleGroupePolitique),
    groupSymbol: deputy.SigleGroupePolitique,
    gender: getGender(deputy),
  }

  return props
}

export function getGeneralInformation(deputy: any, imgPixel: number) {
  const props: IGeneralInformation = {
    id: deputy.Slug,
    lastName: deputy.NomDeFamille,
    firstName: deputy.Prenom,
    picture: getImageDynamic(deputy.Slug, imgPixel),
    pictureGroup: getPoliticGroupPicture(deputy.SigleGroupePolitique),
    groupe: deputy.SigleGroupePolitique,
    age: deputy.Age,
    job: deputy.Profession,
    website: deputy.SitesWeb,
    twitter: deputy.twitter,
  }

  return props
}

export function getCoworkers(deputy: any): ICoworkers {
  const coworkers: Array<ICoworker> = deputy.Collaborateurs.map(collab => {
    const coworker: ICoworker = {
      coworker: collab,
    }

    return coworker
  })

  const props: ICoworkers = {
    coworkers: coworkers,
  }

  return props
}

export function getCirco(deputy: any) {
  var props: ICirco = {
    nom: deputy.NomCirconscription,
    num: deputy.NumeroCirconscription,
  }

  return props
}

export function getMandate(deputy: any): IMandate {
  var props: IMandate = {
    dateBegin: deputy.DebutDuMandat,
    isInMandate: true,
    numberMandates: deputy.NombreMandats,
    othersMandates: deputy.AutresMandats.data,
    oldMandates: deputy.AnciensMandats.data,
  }

  return props
}
