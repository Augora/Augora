/**
 * Retrieve coworkers link to a deputy
 * @param deputy
 */
export function getOrganismes(deputy: Deputy.Deputy) {
  const organismes = deputy.Depute_OrganismeParlementaire.map((o) => {
    const organisme = {
      OrganismeNom: o.OrganismeParlementaire.Nom,
      Fonction: o.Fonction,
      Permanente: o.OrganismeParlementaire.EstPermanent
    }

    return organisme
  })

  const props = {
    organismes: organismes,
    nombre: organismes.length
  }

  return props
}
