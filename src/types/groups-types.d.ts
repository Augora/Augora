declare namespace Group {
  interface GroupeParlementaire {
    Sigle: string
    NomComplet?: string
    Couleur?: string
    CouleurDetail?: CouleurDetail
    URLImage?: string
    Ordre?: number
    Actif?: boolean
  }

  interface ResponsabiliteGroupe {
    GroupeParlementaire: GroupeParlementaire
    Fonction: string
    DebutFonction: string
    FinFonction: string
  }

  interface Group {
    Sigle: string
    NomComplet?: string
    Couleur?: string
    Ordre?: number
  }

  type GroupsList = Group[]
}
