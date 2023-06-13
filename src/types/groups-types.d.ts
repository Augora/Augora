declare namespace Group {
  type GroupsList = Group[]

  /** Objet groupe de la database */
  interface Group {
    /** Exemple: "LFI" */
    Sigle: string
    /** Exemple: "La France Insoumise" */
    NomComplet?: string
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
