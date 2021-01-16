import { getPoliticGroupPhotoImport } from "./image"

export function getGeneralInformation(deputy: Deputy.Deputy) {
  const props = {
    id: deputy.Slug,
    lastName: deputy.NomDeFamille,
    firstName: deputy.Prenom,
    picture: deputy.URLPhotoAugora,
    pictureGroup: getPoliticGroupPhotoImport(deputy.GroupeParlementaire.Sigle),
    groupe: deputy.GroupeParlementaire.Sigle,
    groupeComplet: deputy.GroupeParlementaire.NomComplet,
    age: deputy.Age,
    job: deputy.Profession,
    website: deputy.SitesWeb,
    twitter: deputy.Twitter,
    sexe: deputy.Sexe,
  }

  return props
}
