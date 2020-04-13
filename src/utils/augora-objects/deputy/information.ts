import { getDeputyPhotoURL, getPoliticGroupPhotoImport } from "./image"
import { getGender } from "./gender"

export function getGeneralInformation(deputy: any, imgPixel: number) {
  const props = {
    id: deputy.Slug,
    lastName: deputy.NomDeFamille,
    firstName: deputy.Prenom,
    picture: getDeputyPhotoURL(deputy.Slug, imgPixel),
    pictureGroup: getPoliticGroupPhotoImport(deputy.SigleGroupePolitique),
    groupe: deputy.SigleGroupePolitique,
    age: deputy.Age,
    job: deputy.Profession,
    website: deputy.SitesWeb,
    twitter: deputy.Twitter,
    sexe: deputy.Sexe,
  }

  return props
}
