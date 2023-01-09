declare namespace Organisme {
  interface Complément {
    Nom: string
    EstPermanent: boolean
  }

  interface Contenu {
    Fonction: string
    OrganismeNom: string
    Permanente: boolean
  }

  interface Organisme {
    /** Slug du député */
    DeputeSlug: string
    /** Fonction du député au sein de l'organisme parlementaire */
    Fonction: string
    /** Id en base lien le député à l'organisme parlementaire */
    Id: string
    /** Nom de l'organisme parlementaire */
    OrganismeParlementaire: Complément
    /** Slug de l'organisme parlementaire */
    OrganismeSlug: string
    /** Date de création */
    created_at: string
  }
}
