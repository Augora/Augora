declare namespace Chart {
  /** Props requis par toutes les chartes */
  interface BaseProps {
    width: number
    height: number
  }

  interface BaseData {
    groupList: Group.GroupsList
    deputes: Deputy.DeputiesList
  }

  interface BaseDataAge extends BaseData {
    ageDomain: Filter.AgeDomain
    legendClass?: string
  }

  /** Data des tooltip pour le component tooltip visx */
  interface Tooltip {
    /** Nom Complet du groupe */
    key: string
    /** Nombre de députés du groupe */
    bar: number
    /** Couleur du groupe */
    color: string
    /** Age, optionnel */
    age?: number | string
  }

  interface TooltipRange extends Tooltip {
    age: string
  }

  /** Object contenant les infos des groupes pour les components visx */
  interface GroupData {
    /** Sigle du groupe */
    id: string
    /** Nom Complet du groupe */
    label: string
    /** Nombre de députés du groupe */
    value: number
    /** Couleur du groupe */
    color: string
  }

  /** Object contenant tous les sigles de groups en clé et une array de député */
  type AgeGroupData = { [x: string]: Deputy.DeputiesList }

  /** Object contenant les infos des députés sur un âge */
  interface AgeData {
    age: number | string
    groups: AgeGroupData
    total: number
  }

  interface WordCloud extends BaseProps {
    data: string
  }
  interface WordData {
    text: string
    value: number
  }
}
