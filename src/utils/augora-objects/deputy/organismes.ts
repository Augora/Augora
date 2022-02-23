/**
 * Retrieve coworkers link to a deputy
 * @param deputy
 */
export function getOrganismes(deputy: Deputy.Deputy) {
  const commissionsPermanentes = ["Commission des affaires culturelles et de l'éducation",
  "Commission des affaires économiques",
  "Commission des affaires étrangères",
  "Commission des affaires sociales",
  "Commission de la défense nationale et des forces armées",
  "Commission du développement durable et de l'aménagement du territoire",
  "Commission des finances, de l'économie générale et du contrôle budgétaire",
  "Commission des lois constitutionnelles, de la législation et de l'administration générale de la république"]

  const organismes = deputy.Depute_OrganismeParlementaire.map((o) => {
    const organisme = {
      OrganismeNom: o.OrganismeParlementaire.Nom,
      Fonction: o.Fonction,
      Permanente: commissionsPermanentes.includes(o.OrganismeParlementaire.Nom)
    }

    return organisme
  })

  const props = {
    organismes: organismes,
    nombre: organismes.length
  }

  return props
}
