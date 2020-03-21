import { IGeneralInformation } from "components/deputy/general-information/OldGeneralInformation"
import { getDeputyPhotoURL, getPoliticGroupPhotoImport } from "./image"
import { getGender } from "./gender"

export function getOldGeneralInformation(deputy: any, imgPixel: number) {
  const props: IGeneralInformation = {
    id: deputy.Slug,
    circonscriptionNumber: deputy.NumeroCirconscription,
    circonscriptionName: deputy.NomCirconscription,
    lastName: deputy.NomDeFamille,
    firstName: deputy.Prenom,
    picture: getDeputyPhotoURL(deputy.Slug, imgPixel),
    pictureGroup: getPoliticGroupPhotoImport(deputy.SigleGroupePolitique),
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
    picture: getDeputyPhotoURL(deputy.Slug, imgPixel),
    pictureGroup: getPoliticGroupPhotoImport(deputy.SigleGroupePolitique),
    groupe: deputy.SigleGroupePolitique,
    age: deputy.Age,
    job: deputy.Profession,
    website: deputy.SitesWeb,
    twitter: deputy.twitter,
  }

  return props
}