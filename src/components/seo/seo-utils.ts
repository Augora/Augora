export enum PageType {
  Accueil,
  Depute,
  FAQ,
  NotFound,
  // About,
  // CarteDeFrance,
}

export function buildMetaTags(
  title: string,
  description: string,
  url: string,
  imageUrl: string,
  gatsbyEnv: string
) {
  return [
    // robots
    gatsbyEnv !== "production"
      ? { name: "robots", content: "noindex,nofollow" }
      : { name: "robots", content: "index,follow" },
    // viewport
    { name: "viewport", content: "width=device-width, initial-scale=1.0"},
    // type
    { name: "og:type", content: "website" },
    // local
    { name: "og:local", content: "fr_FR" },
    // title
    { name: "og:title", content: title },
    { name: "twitter:title", content: title },
    // description
    { name: "og:description", content: description },
    { name: "twitter:description", content: description },
    // url
    { name: "og:url", content: url },
    { name: "twitter:url", content: url },
    //image
    { name: "og:image", content: imageUrl },
    { name: "og:image:url", content: imageUrl },
    { name: "og:image:secure_url", content: imageUrl },
    { name: "og:image:secure", content: imageUrl },
    { name: "twitter:image", content: imageUrl },
    { name: "twitter:card", content: imageUrl },
    { name: "og:image:alt", content: "Icône de l'association Augora" },
  ]
}

export function buildMetaTagsFromPageType(pageType: PageType, depute: any) {
  if (pageType === PageType.Accueil) {
    return buildMetaTags(
      buildTitleFromPageType(pageType, depute),
      "Vous voulez en savoir plus sur les députés de l'Assemblée Nationale ? Augora est un projet open source qui permet à chacun d'être mieux renseigné sur la politique Française.",
      process.env.GATSBY_TARGET_ENV !== "production"
        ? "https://preprod.augora.fr"
        : "https://augora.fr",
      "icons/icon-512x512.png",
      process.env.GATSBY_TARGET_ENV
    )
  }
  if (pageType === PageType.Depute) {
    return buildMetaTags(
      buildTitleFromPageType(pageType, depute),
      `Informations générales et coordonnées de ${depute.Nom}, ${
        depute.Sexe === "H" ? "député" : "députée"
      } ${depute.GroupeParlementaire.NomComplet} de la ${
        depute.NumeroCirconscription
      }${depute.NumeroCirconscription < 2 ? "ère" : "ème"} circonscription de ${
        depute.NomDepartement
      }.`,
      process.env.GATSBY_TARGET_ENV !== "production"
        ? `https://preprod.augora.fr/depute/${depute.Slug}`
        : `https://augora.fr/depute/${depute.Slug}`,
      "icons/icon-512x512.png",
      process.env.GATSBY_TARGET_ENV
    )
  }
  if (pageType === PageType.FAQ) {
    return buildMetaTags(
      buildTitleFromPageType(pageType, depute),
      "Trouvez les réponses aux questions les plus fréquentes sur le site Augora et l'assemblée nationale.",
      process.env.GATSBY_TARGET_ENV !== "production"
        ? "https://preprod.augora.fr/faq"
        : "https://augora.fr/faq",
      "icons/icon-512x512.png",
      process.env.GATSBY_TARGET_ENV
    )
  }
  if (pageType === PageType.NotFound) {
    return []
  }
  return []
}

export function buildTitleFromPageType(pageType: PageType, depute: any) {
  if (pageType === PageType.Accueil) {
    return "Liste des députés"
  }
  if (pageType === PageType.Depute) {
    return `${depute.Nom} - Député ${depute.GroupeParlementaire.Sigle}`
  }
  if (pageType === PageType.FAQ) {
    return "Foire aux Questions"
  }
  if (pageType === PageType.NotFound) {
    return "Page introuvable"
  }
  return ""
}
