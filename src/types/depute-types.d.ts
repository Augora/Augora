declare namespace Deputy {
  /**
   * Un object contenant les attributs des députés, tiré de faunaDB
   */
  interface Deputy {
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
    URLPhotoAssembleeNationale?: string
    URLTwitter?: string
    URLFacebook?: string
    URLLinkedIn?: string
    URLInstagram?: string
    URLPhotoAugora?: string
    SitesWeb?: string[]
    Emails?: string[]
    Adresses?: string[]
    Collaborateurs?: string[]
    ResponsabiliteGroupe?: ResponsabiliteGroupe
    GroupeParlementaire?: GroupeParlementaire
    Activites: {
      data: Activite[]
    }
    AdressesDetails?: {
      data: Adresse[]
    }
    AutreMandat?: {
      data: AutreMandat[]
    }
    AncienMandat?: {
      data: AncienMandat[]
    }
  }

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

  interface Adresse {
    AdresseComplete?: string
    Adresse?: string
    CodePostal?: string
    Telephone?: string
    Fax?: string
  }

  interface Activite {
    NumeroDeSemaine: number
    DateDeDebut?: string
    DateDeFin?: string
    PresencesEnCommission?: number
    PresenceEnHemicycle?: number
    ParticipationsEnCommission?: number
    ParticipationEnHemicycle?: number
    Question?: number
    Vacances?: number
  }

  interface AutreMandat {
    AutreMandatComplet: string
    Localite?: string
    Institution?: string
    Intitule?: string
  }

  interface AncienMandat {
    AncienMandatComplet: string
    DateDeDebut?: string
    DateDeFin?: string
    Intitule?: string
  }

  interface CouleurDetail {
    HSL: HSLDetail
    RGB: RGBDetail
    HEX: string
  }

  interface HSLDetail {
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

  /**
   * Un array de députés
   */
  type DeputiesList = Deputy[]
}
