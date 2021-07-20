import { getPoliticGroupPhotoImport, getPoliticPartyPhotoImport } from "./image"

export function getGeneralInformation(deputy: Deputy.Deputy) {
  return {
    id: deputy.Slug,
    lastName: deputy.NomDeFamille,
    firstName: deputy.Prenom,
    picture: deputy.URLPhotoAugora,
    pictureGroup: getPoliticGroupPhotoImport(deputy.GroupeParlementaire.Sigle),
    pictureParty: getPoliticPartyPhotoImport(deputy.RattachementFinancier),
    party: deputy.RattachementFinancier,
    groupe: deputy.GroupeParlementaire.Sigle,
    groupeComplet: deputy.GroupeParlementaire.NomComplet,
    age: deputy.Age,
    job: deputy.Profession,
    website: deputy.SitesWeb,
    twitter: deputy.Twitter,
    sexe: deputy.Sexe,
  }
}
