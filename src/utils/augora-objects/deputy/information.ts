import { getPoliticGroupPhotoImport } from "./image"

export function getGeneralInformation(deputy: any) {
  const props = {
    id: deputy.Slug,
    lastName: deputy.NomDeFamille,
    firstName: deputy.Prenom,
    picture: deputy.URLPhotoAugora,
    pictureGroup: getPoliticGroupPhotoImport(deputy.GroupeParlementaire.Sigle),
    groupe: deputy.GroupeParlementaire.Sigle,
    age: deputy.Age,
    job: deputy.Profession,
    website: deputy.SitesWeb,
    twitter: deputy.Twitter,
    sexe: deputy.Sexe,
  }

  return props
}
