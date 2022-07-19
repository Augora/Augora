declare namespace AugoraMap {
  /** Un array de 2 nombres: longitude en premier et latitude, utilisable par mapbox pour les coordonées */
  type Coordinates = [number, number]

  /** Un array de 2 coordonnées: southwest [lng, lat] & northeast [lng, lat] utilisable par mapbox pour les bounding boxes */
  type Bounds = [Coordinates, Coordinates]

  /** Un object GeoJSON geometry ne contenant que polygon ou multipolygon */
  type Geometry = GeoJSON.Polygon | GeoJSON.MultiPolygon

  /** Un object GEOJson properties contenant les clés de nos fichiers GeoJSON */
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

  /** Un object de type Feature GeoJSON ne contenant que des polygones ou des multipolygones et les properties de nos fichiers */
  interface Feature extends GeoJSON.Feature<Geometry, Properties> {}

  /** Un object de type Feature collection GeoJSON ne contenant que des features FranceZone */
  interface FeatureCollection extends GeoJSON.FeatureCollection {
    features: Feature[]
  }

  /** Objet properties des feature de l'API geocode mapbox */
  interface MapboxAPIProperties extends GeoJSON.GeoJsonProperties {
    wikidata?: string
    accuracy?: string
  }

  /** Objet feature de l'API geocode mapbox */
  interface MapboxAPIFeature extends GeoJSON.Feature<GeoJSON.Geometry, MapboxAPIProperties> {
    address?: string
    center: Coordinates
    id: string
    language: string
    place_name: string
    place_type: [string]
    text: string
    relevance: number
    context: {
      id: string
      wikidata: string
      text: string
      short_code?: string
    }[]
  }

  /** Feature collection de l'API geocode mapbox */
  interface MapboxAPIFeatureCollection extends GeoJSON.FeatureCollection {
    attribution: string
    query: string[]
    features: MapboxAPIFeature[]
  }

  /** Objet contenant les codes de zone pour la map */
  interface Codes {
    /** ID continent (0 France, 1 World, 2 DROM-COM) */
    code_cont?: number
    /** ID Région */
    code_reg?: number | string
    /** ID Département */
    code_dpt?: number | string
    /** ID Circonscription */
    code_circ?: number
  }

  /** Object contenant les données GeoJSON de la map */
  interface MapView {
    /** Feature collection des zones affichées. Exemple: en vue Occitanie, tous ses départements */
    geoJSON: FeatureCollection
    /** Feature collection des zones estompées voisines */
    ghostGeoJSON?: FeatureCollection
    /** Feature contenant toutes les zones. */
    feature: Feature
    /** Objet paint pour les layers. Utilisé pour avoir une couleur dynamique */
    paint: {
      fill: mapboxgl.FillPaint
      line: mapboxgl.LinePaint
    }
  }

  type Breadcrumb = {
    url: string
    nom: string
  }

  type History = Breadcrumb[]
}
