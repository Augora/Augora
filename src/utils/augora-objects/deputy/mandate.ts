export function getMandate(deputy: Deputy.Deputy) {
  const props = {
    dateBegin: deputy.DebutDuMandat,
    isInMandate: true,
    numberMandates: deputy.NombreMandats + deputy.AnciensMandats.data.length,
    othersMandates: deputy.AutresMandats.data,
    oldMandates: deputy.AnciensMandats.data,
  }

  return props
}
