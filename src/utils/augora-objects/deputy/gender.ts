/**
 * Retrieve deputy gender
 * @param deputy 
 */
export function getGender(sexe : string) {
    if (sexe === "H") {
      return "Député"
    } else {
      return "Députée"
    }
  }