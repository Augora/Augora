import { getGroupLogoImport, getPartyLogoImport } from "./image"

export function getGeneralInformation(deputy: Deputy.Deputy) {
  return {
    id: deputy.Slug,
    lastName: deputy.Nom,
    firstName: deputy.Prenom,
    picture: deputy.URLPhotoAssembleeNationale,
    pictureGroup: getGroupLogoImport(deputy.newSource_GroupeParlementaire.Sigle),
    pictureParty: getPartyLogoImport(deputy.RattachementFinancier),
    party: deputy.RattachementFinancier,
    groupe: deputy.newSource_GroupeParlementaire.Sigle,
    groupeComplet: deputy.newSource_GroupeParlementaire.NomComplet,
    age: deputy.Age,
    job: deputy.Profession,
    website: deputy.SitesWeb,
    twitter: deputy.Twitter,
    sexe: deputy.Sexe,
  }
}

export function getGroupesInformation(deputy: Deputy.Deputy) {
  return {
    photoGroupe: getGroupLogoImport(deputy.newSource_GroupeParlementaire.Sigle),
    photoRattachement: getPartyLogoImport(deputy.RattachementFinancier),
    rattachement: deputy.RattachementFinancier,
    groupe: deputy.newSource_GroupeParlementaire.NomComplet,
    responsabiliteGroupe: deputy.ResponsabiliteGroupe.Fonction,
  }
}
