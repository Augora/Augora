declare namespace Group {
  type Sigle = "GDR" | "LFI" | "SOC" | "LT" | "MODEM" | "LREM" | "UDI" | "AE" | "LR" | "NI"

  interface Group {
    Sigle: Sigle
    NomComplet?: string
    Couleur?: string
    Ordre?: number
  }

  type GroupsList = Group[]
}
