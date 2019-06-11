import { IGeneralInformation } from "../../Components/Deputy/GeneralInformation/GeneralInformation";
import { ICoworkers } from "../../Components/Deputy/Coworkers/Coworkers";
import { ICoworker } from "../../Components/Deputy/Coworkers/Coworker/Coworker";

export function getGender(deputy: IDeputy) {
  if (deputy.sexe === "H") {
    return "Député";
  } else {
    return "Députée";
  }
}

// TODO for each politic group, switch case
export function getPoliticGroupPicture(politicGroup: string, imgPixel : number) {
  return "/Images/Logos/partis politiques/lrem/lrem_grand.png";
}

export function getGeneralInformation(deputy: IDeputy, imgPixel : number) {
  var props: IGeneralInformation = {
    id: deputy.id,
    circonscriptionNumber: deputy.num_circo,
    circonscriptionName: deputy.nom_circo,
    lastName: deputy.nom_de_famille,
    firstName: deputy.prenom,
    picture: deputy.imageDynamic(imgPixel),
    pictureGroup: getPoliticGroupPicture(deputy.groupe_sigle, imgPixel),
    groupSymbol: deputy.groupe_sigle,
    gender: getGender(deputy)
  };

  return props;
}

export function getCoworkers(deputy: IDeputy): ICoworkers {

  const coworkers: Array<ICoworker> = deputy.collaborateurs.map(collab => {
    const coworker: ICoworker = {
      coworker: collab
    };

   return(coworker);
  });

  const props: ICoworkers = {
    coworkers: coworkers
  };

  return props;
}
