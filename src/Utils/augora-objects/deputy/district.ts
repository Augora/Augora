import IDistrict from "components/deputy/map-circo/MapCirco"

export function getDistrict(deputy: any) {
    var props: IDistrict = {
      nom: deputy.NomCirconscription,
      num: deputy.NumeroCirconscription,
    }
  
    return props
  }