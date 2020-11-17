export enum PageType {
  Accueil,
  Depute,
  FAQ,
  NotFound,
  Carte,
  // About,
}

export function buildMetaTags(title: string, description: string, url: string, imageUrl: string, env: string) {
  return [
    // robots
    env !== "production" ? <meta name="robots" content="noindex,nofollow" /> : <meta name="robots" content="index,follow" />,
    // viewport
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />,
    // type
    <meta name="og:type" content="website" />,
    // local
    <meta name="og:local" content="fr_FR" />,
    // title
    <meta name="og:title" content={title} />,
    <meta name="twitter:title" content={title} />,
    // charset
    <meta charSet="utf-8" />,
    // description
    <meta name="description" content={description} />,
    <meta name="og:description" content={description} />,
    <meta name="twitter:description" content={description} />,
    // url
    <meta name="og:url" content={url} />,
    <meta name="twitter:url" content={url} />,
    //image
    <meta name="og:image" content={imageUrl} />,
    <meta name="og:image:url" content={imageUrl} />,
    <meta name="og:image:secure_url" content={imageUrl} />,
    <meta name="og:image:secure" content={imageUrl} />,
    <meta name="twitter:image" content={imageUrl} />,
    <meta name="twitter:card" content={imageUrl} />,
    <meta name="og:image:alt" content="Icône de l'association Augora" />,
  ]
}

export function buildMetaTagsFromPageType(pageType: PageType, depute: any) {
  if (pageType === PageType.Accueil) {
    return buildMetaTags(
      buildTitleFromPageType(pageType, depute),
      "Vous voulez en savoir plus sur les députés de l'Assemblée Nationale ? Augora est un projet open source qui permet à chacun d'être mieux renseigné sur la politique Française.",
      process.env.NEXT_PUBLIC_ENV !== "production" ? "https://preprod.augora.fr" : "https://augora.fr",
      "icons/icon-512x512.png",
      process.env.NEXT_PUBLIC_ENV
    )
  }
  if (pageType === PageType.Depute) {
    return buildMetaTags(
      buildTitleFromPageType(pageType, depute),
      `Informations générales et coordonnées de ${depute.Nom}, ${depute.Sexe === "H" ? "député" : "députée"} ${
        depute.GroupeParlementaire.NomComplet
      } de la ${depute.NumeroCirconscription}${depute.NumeroCirconscription < 2 ? "ère" : "ème"} circonscription de ${
        depute.NomDepartement
      }.`,
      process.env.NEXT_PUBLIC_ENV !== "production"
        ? `https://preprod.augora.fr/depute/${depute.Slug}`
        : `https://augora.fr/depute/${depute.Slug}`,
      "icons/icon-512x512.png",
      process.env.NEXT_PUBLIC_ENV
    )
  }
  if (pageType === PageType.FAQ) {
    return buildMetaTags(
      buildTitleFromPageType(pageType, depute),
      "Trouvez les réponses aux questions les plus fréquentes sur le site Augora et l'assemblée nationale.",
      process.env.NEXT_PUBLIC_ENV !== "production" ? "https://preprod.augora.fr/faq" : "https://augora.fr/faq",
      "icons/icon-512x512.png",
      process.env.NEXT_PUBLIC_ENV
    )
  }
  if (pageType === PageType.Carte) {
    return buildMetaTags(
      buildTitleFromPageType(pageType, depute),
      "Nos députés, représentés sous forme de carte.",
      process.env.NEXT_PUBLIC_ENV !== "production" ? "https://preprod.augora.fr/map" : "https://augora.fr/map",
      "icons/icon-512x512.png",
      process.env.NEXT_PUBLIC_ENV
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
  if (pageType === PageType.Carte) {
    return "Carte du monde"
  }
  if (pageType === PageType.NotFound) {
    return "Page introuvable"
  }
  return ""
}
