export function getGender(deputy) {
    if (deputy.Sexe === "H") {
      return "Député"
    } else {
      return "Députée"
    }
  }