import { IMandate } from "components/deputy/current-mandate/CurrentMandate"

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