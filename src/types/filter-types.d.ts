declare namespace Filter {
  /**
   * Range des âges
   * Exemple: [26, 82]
   */
  type AgeDomain = [number, number]

  type Keyword = string

  type Gender = "H" | "F"

  /**
   * State des boutons de sexe
   */
  type SelectedGenders = {
    H: boolean
    F: boolean
  }

  /**
   * Object utilisé pour le state des boutons de groupe
   */
  type GroupValue = {
    [sigle: string]: boolean
  }
}
