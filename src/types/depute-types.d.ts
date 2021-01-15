declare namespace Deputy {
  /**
   * Un object contenant les attributs des députés, tiré de faunaDB
   */
  interface Depute {
    Slug: string
    Nom?: string
    NomDeFamille?: string
    Prenom?: string
    Sexe?: string
    DateDeNaissance?: string
    LieuDeNaissance?: string
    NumeroDepartement?: string
    NomDepartement?: string
    NumeroRegion?: string
    NomRegion?: string
    NomCirconscription?: string
    NumeroCirconscription?: number
    DebutDuMandat?: string
    RattachementFinancier?: string
    Profession?: string
    PlaceEnHemicycle?: string
    URLAssembleeNationale?: string
    IDAssembleeNationale?: string
    URLNosdeputes?: string
    URLNosdeputesAPI?: string
    NombreMandats?: number
    Twitter?: string
    EstEnMandat?: boolean
    Age?: number
    URLPhotoAssembleeNationnale?: string
    URLPhotoAugora?: string
    SitesWeb?: string[]
    Emails?: string[]
    Adresses?: string[]
    Collaborateurs?: string[]
    GroupeParlementaire?: GroupeParlementaire
  }

  interface GroupeParlementaire {
    Sigle: Group.Sigle
    NomComplet?: string
    Couleur?: string
    URLImage?: string
    Ordre?: number
    Actif?: boolean
  }

  /**
   * Un array de députés
   */
  type DeputiesList = Depute[]
}
