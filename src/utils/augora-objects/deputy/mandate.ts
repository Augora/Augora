export function getMandate(deputy: Deputy.Deputy) {
  const props = {
    dateBegin: deputy.DebutDuMandat,
    isInMandate: true,
    numberMandates: deputy.NombreMandats + deputy.AncienMandat.length,
    othersMandates: deputy.AutreMandat,
    oldMandates: deputy.AncienMandat,
  }

  return props
}
