/**
 * Retrieve coworkers link to a deputy
 * @param deputy
 */
export function getOrganismes(deputy: Deputy.Deputy) {
  const organismesSorted = deputy.Depute_OrganismeParlementaire.sort(function (o, b) {
    return o.OrganismeParlementaire.EstPermanent === b.OrganismeParlementaire.EstPermanent
      ? 0
      : o.OrganismeParlementaire.EstPermanent
      ? -1
      : 1
  })

  const organismes = organismesSorted.map((o) => {
    const organisme = {
      OrganismeNom: o.OrganismeParlementaire.Nom,
      Fonction: o.Fonction,
      Permanente: o.OrganismeParlementaire.EstPermanent,
    }
    return organisme
  })

  const props = {
    organismes: organismes,
    nombre: organismes.length,
  }

  return props
}
