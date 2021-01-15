declare namespace Filter {
  /**
   * Exemple: [26, 82]
   */
  type AgeDomain = [number, number]

  type Keyword = string

  type Gender = "H" | "F"

  type SelectedGenders = {
    H: boolean
    F: boolean
  }

  type GroupValue = {
    AE: boolean
    GDR: boolean
    LFI: boolean
    SOC: boolean
    LT: boolean
    MODEM: boolean
    LREM: boolean
    UDI: boolean
    LR: boolean
    NI: boolean
  }
}
