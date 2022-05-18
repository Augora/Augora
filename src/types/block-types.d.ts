/** Tous les types concernant les blocs de la page détail */
declare namespace Bloc {
  type Type = "general" | "mandate" | "coworkers" | "presence" | "contact" | "map" | "groupes" | "commission" | "missions"

  type Size = "large" | "medium"

  interface Base {
    /** Couleur du groupe parlementaire */
    color: Group.CouleurDetail
    /** "large", "medium" */
    size?: Size
    wip?: boolean
    /** Element(s) à mettre dans la tooltip info, s'il faut un bouton info */
    info?: React.ReactNode
    /** Si l'overlay info est affiché par défaut et empêche l'accès au bloc */
    isLockedByDefault?: boolean
  }

  interface Header {
    /** Couleur du groupe parlementaire */
    color: Group.CouleurDetail
    title: string
    /** Identifier du bloc: "general", "mandate", "coworkers", "presence", "contact","map", "commission" ou "missions" */
    type: Type
    /** Infos de la circonscription du député pour le bloc map */
    circ?: {
      circNb: number
      region: string
    }
    /** Callback pour le bouton info */
    onClick?: (args?: any) => void
  }

  interface Block extends Base, Header {
    className?: string
    children?: React.ReactNode
  }

  interface GroupeEtParti extends Base {
    groupe: string
    responsabiliteGroupe: string
    rattachement: string
    photoGroupe: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
    photoRattachement: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
    sexe: string
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
    pictureParty: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
    party: string
    groupe: string
    groupeComplet: string
    age: number
    job: string
    website: string[]
    twitter: string
    sexe: string
    dateBegin: string
  }

  interface Presence extends Base {
    activite: Deputy.Activite[]
  }
  interface Organismes extends Base {
    organismes: Organisme.Contenu[]
  }

}
