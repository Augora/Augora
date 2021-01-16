/**
 * Tous les types concernants les blocs de la page détail
 */
declare namespace Bloc {
  interface Base {
    /**
     * Couleur du groupe parlementaire
     */
    color: string
    /**
     * "large", "medium" ou "small"
     */
    size?: string
    wip?: boolean
  }

  interface Header {
    /**
     * Couleur du groupe parlementaire
     */
    color: string
    title: string
    /**
     * Identifier du bloc: "general", "mandate", "coworkers", "presence", "contact" ou "map"
     */
    type: string
    /**
     * Infos de la circonscription du député pour le bloc map
     */

    circ?: {
      circNb: number
      region: string
    }
  }

  interface Block extends Base, Header {
    className?: string
    children?: React.ReactNode
  }

  interface Contact extends Base {
    adresses: Deputy.Adresse[]
  }

  interface Map extends Base {
    deputy: Deputy.Deputy
  }

  interface Coworkers extends Base {
    coworkers: {
      coworker: string
    }[]
  }

  interface Mandate extends Base {
    dateBegin: string
    isInMandate: boolean
    numberMandates: number
    othersMandates: Deputy.AutreMandat[]
    oldMandates: Deputy.AncienMandat[]
  }

  interface General extends Base {
    id: string
    lastName: string
    firstName: string
    picture: string
    pictureGroup: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
    groupe: string
    groupeComplet: string
    age: number
    job: string
    website: string[]
    twitter: string
    sexe: string
    dateBegin: string
  }

  interface Date {
    day: string
    month: string
    year: number
    yearsPassed?: number
    monthsPassed?: number
    daysPassed?: number
  }
}
