import { getGroupLogoImport, getPartyLogoImport } from "./image"

export function getGeneralInformation(deputy: Deputy.Deputy) {
  return {
    id: deputy.Slug,
    lastName: deputy.NomDeFamille,
    firstName: deputy.Prenom,
    picture: deputy.URLPhotoAugora,
    pictureGroup: getGroupLogoImport(deputy.GroupeParlementaire.Sigle),
    pictureParty: getPartyLogoImport(deputy.RattachementFinancier),
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

export function getGroupesInformation(deputy: Deputy.Deputy) {
  return {
    photoGroupe: getGroupLogoImport(deputy.GroupeParlementaire.Sigle),
    photoRattachement: getPartyLogoImport(deputy.RattachementFinancier),
    rattachement: deputy.RattachementFinancier,
    groupe: deputy.GroupeParlementaire.NomComplet,
    responsabiliteGroupe: deputy.ResponsabiliteGroupe.Fonction,
  }
}
