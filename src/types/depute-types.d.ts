declare namespace Deputy {
  /**
   * Un object contenant les attributs des députés, tiré de Supabase
   */
  interface Deputy {
    /**
     * Exemple: "cedric-roussel"
     */
    Slug: string
    /**
     * Exemple: "Cédric Roussel"
     */
    Nom?: string
    Prenom?: string
    /**
     * "H" ou "F"
     */
    Sexe?: string
    /**
     * Format "yyyy-mm-dd"
     */
    Suppleant?: string
    DateDeNaissance?: string
    LieuDeNaissance?: string
    NumeroDepartement?: string
    NomDepartement?: string
    NumeroRegion?: string
    NomRegion?: string
    NomCirconscription?: string
    NumeroCirconscription?: number
    /**
     * Format "yyyy-mm-dd"
     */
    DebutDuMandat?: string
    RattachementFinancier?: string
    Profession?: string
    PlaceEnHemicycle?: string
    URLAssembleeNationale?: string
    IDAssembleeNationale?: string
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
    /**
     * Array de toutes les adresses web renseignées
     */
    SitesWeb?: string[]
    /**
     * Array de tous les e-mail renseignées
     */
    Emails?: string[]
    /**
     * Array de toutes les adresses renseignées
     */
    Collaborateurs?: string[]
    Adresses?: Adresse[]
    /**
     * Array des noms des assistants parlementaires
     * Exemple: ["Luc Derai", "Julie Phan-Pérain",...]
     */
    AutreMandat?: AutreMandat[]
    AncienMandat?: AncienMandat[]
    GroupeParlementaire?: Group.Group
    ResponsabiliteGroupe?: Group.ResponsabiliteGroupe
    Activite?: Activite[]
    RattachementFinancier?: string
    Depute_OrganismeParlementaire?: Organisme.Organisme[]
  }

  /**
   *
   */
  interface Adresse {
    AdresseComplete?: string
    /**
     * Exemple: "Assemblée nationale, 126 Rue de l'Université, 75355 PARIS 07 SP"
     */
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
    MedianeTotal?: number
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

  /**
   * Un array de députés
   */
  type DeputiesList = Deputy[]
}
