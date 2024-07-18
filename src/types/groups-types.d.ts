declare namespace Group {
  type GroupsList = Group[]

  /** Objet groupe de la database */
  interface Group {
    /** Exemple: "deputes-non-inscrits" */
    Slug: string
    /** Exemple: "Députés non inscrits" */
    NomComplet?: string
    /** Exemple: "NI" */
    Sigle?: string
    /** Format "hsl(255, 100%, 100%)" */
    Couleur?: string
    CouleurDetail?: Color.All
    URLImage?: string
    Ordre?: number
    Actif?: boolean
    DescriptionWikipedia?: string
    IDWikipedia?: string
    IDAssembleeNationale?: string
  }

  interface ResponsabiliteGroupe {
    GroupeParlementaire: Group
    Fonction: string
    DebutFonction: string
    FinFonction: string
  }
}
