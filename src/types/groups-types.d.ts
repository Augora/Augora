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
    CouleurDetail?: CouleurDetail
    URLImage?: string
    Ordre?: number
    Actif?: boolean
  }

  interface CouleurDetail {
    HSL: HSLDetail
    RGB: RGBDetail
    HEX: string
  }

  interface HSLDetail {
    /** Format "hsl(255, 100%, 100%)" */
    Full: string
    H: number
    S: number
    L: number
  }

  interface RGBDetail {
    Full: string
    R: number
    G: number
    B: number
  }

  interface ResponsabiliteGroupe {
    GroupeParlementaire: Group
    Fonction: string
    DebutFonction: string
    FinFonction: string
  }
}
