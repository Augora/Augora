declare namespace Chart {
  /**
   * Props requis par toutes les chartes
   */
  interface BaseProps {
    width: number
    height: number
    /**
     * Data qui feed les charts
     */
    data: Data[]
    totalDeputes: number
  }

  /**
   * Data des tooltip pour le component tooltip visx
   */
  interface Tooltip {
    /**
     * Nom Complet du groupe
     */
    key: string
    /**
     * Nombre de députés du groupe
     */
    bar: number
    /**
     * Couleur du groupe
     */
    color: string
    /**
     * Age, optionnel
     */
    age?: number
  }

  /**
   * Object contenant les infos des groupes pour les components visx
   */
  interface Data {
    /**
     * Sigle du groupe
     */
    id: string
    /**
     * Nom Complet du groupe
     */
    label: string
    /**
     * Nombre de députés du groupe
     */
    value: number
    /**
     * Couleur du groupe
     */
    color: string
  }

  interface AgeData {
    age: number
    groups: { [x: string]: Deputy.DeputiesList }
  }
}
