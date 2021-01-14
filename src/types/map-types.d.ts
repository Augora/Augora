declare namespace AugoraMap {
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
    GroupeParlementaire?: {
      Sigle: string
      NomComplet?: string
      Couleur?: string
      URLImage?: string
      Ordre?: number
      Actif?: boolean
    }
  }

  /**
   * Un array de députés
   */
  type DeputiesList = Depute[]

  /**
   * Un array de 2 nombres: longitude en premier et latitude, utilisable par mapbox pour les coordonées
   */
  type Coordinates = [number, number]

  /**
   * Un array de 2 coordonnées: southwest [lng, lat] & northeast [lng, lat] utilisable par mapbox pour les bounding boxes
   */
  type Bounds = [Coordinates, Coordinates]

  /**
   * Un object GEOJson geometry ne contenant que polygon ou multipolygon
   */
  type Geometry = GeoJSON.Polygon | GeoJSON.MultiPolygon

  /**
   * Un object GEOJson properties contenant les clés de nos fichiers GEOJson
   */
  interface Properties extends GeoJSON.GeoJsonProperties {
    nom?: string
    nom_dpt?: string
    nom_reg?: string
    code_cont?: number
    code_reg?: number | string
    code_dpt?: number | string
    code_circ?: number
    center?: Coordinates
    bbox?: Bounds
  }

  /**
   * Un object de type Feature GeoJSON ne contenant que des polygones ou des multipolygones et les properties de nos fichiers
   */
  interface Feature extends GeoJSON.Feature<Geometry, Properties> {}

  /**
   * Un object de type Feature collection GeoJSON ne contenant que des features FranceZone
   */
  interface FeatureCollection extends GeoJSON.FeatureCollection {
    features: Feature[]
  }
}
