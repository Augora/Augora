export enum PageType {
  Accueil,
  Depute,
  FAQ,
  NotFound,
  Statistiques,
  Map,
  MentionsLegales,
  // About,
}

export function buildMetaTags(title: string, description: string, url: string, imageUrl: string, env: string) {
  return (
    <>
      {/* robots */}
      {env !== "production" ? <meta name="robots" content="noindex,nofollow" /> : <meta name="robots" content="index,follow" />}
      {/* viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      {/* type */}
      <meta name="og:type" content="website" />
      {/* local */}
      <meta name="og:local" content="fr_FR" />
      {/* title */}
      {title && <meta name="og:title" content={title} />}
      {title && <meta name="twitter:title" content={title} />}
      {/* charset */}
      <meta charSet="utf-8" />
      {/* description */}
      {description && <meta name="description" content={description} />}
      {description && <meta name="og:description" content={description} />}
      {description && <meta name="twitter:description" content={description} />}
      {/* url */}
      {url && <meta name="og:url" content={url} />}
      {url && <meta name="twitter:url" content={url} />}
      {/* image */}
      {imageUrl && <meta name="og:image" content={imageUrl} />}
      {imageUrl && <meta name="og:image:url" content={imageUrl} />}
      {imageUrl && <meta name="og:image:secure_url" content={imageUrl} />}
      {imageUrl && <meta name="og:image:secure" content={imageUrl} />}
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
      {imageUrl && <meta name="twitter:card" content={imageUrl} />}
      {imageUrl && <meta name="og:image:alt" content="Icône de l'association Augora" />}
    </>
  )
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
  if (pageType === PageType.Statistiques) {
    return buildMetaTags(
      buildTitleFromPageType(pageType, depute),
      "Vous voulez des données plus précises sur les députés ? C'est par ici !",
      process.env.NEXT_PUBLIC_ENV !== "production" ? "https://preprod.augora.fr/statistiques" : "https://augora.fr/statistiques",
      "icons/icon-512x512.png",
      process.env.NEXT_PUBLIC_ENV
    )
  }
  if (pageType === PageType.Map) {
    return buildMetaTags(
      buildTitleFromPageType(pageType, depute),
      "Nos députés, représentés sous forme de carte.",
      process.env.NEXT_PUBLIC_ENV !== "production" ? "https://preprod.augora.fr/carte" : "https://augora.fr/carte",
      "icons/icon-512x512.png",
      process.env.NEXT_PUBLIC_ENV
    )
  }
  if (pageType === PageType.MentionsLegales) {
    return buildMetaTags(
      buildTitleFromPageType(pageType, depute),
      null, // force having no default description so it takes the beginning of the page as content
      process.env.NEXT_PUBLIC_ENV !== "production"
        ? "https://preprod.augora.fr/mention-legales"
        : "https://augora.fr/mention-legales",
      "icons/icon-512x512.png",
      process.env.NEXT_PUBLIC_ENV
    )
  }
  if (pageType === PageType.NotFound) {
    return []
  }
  return []
}

export function buildTitleFromPageType(pageType: PageType, depute: Deputy.Deputy) {
  if (pageType === PageType.Accueil) {
    return "Liste des députés"
  }
  if (pageType === PageType.Depute) {
    return `${depute.Nom} - ${depute.Sexe === "H" ? "Député" : "Députée"} ${depute.GroupeParlementaire.Sigle}`
  }
  if (pageType === PageType.FAQ) {
    return "Foire aux Questions"
  }
  if (pageType === PageType.Statistiques) {
    return "Statistiques"
  }
  if (pageType === PageType.Map) {
    return "Carte du monde"
  }
  if (pageType === PageType.NotFound) {
    return "Page introuvable"
  }
  if (pageType === PageType.MentionsLegales) {
    return "Mentions légales"
  }
  return ""
}

export const getPageTypeFromRoute = (route: string) => {
  if (route.startsWith("/depute")) {
    return PageType.Depute
  } else if (route.startsWith("/carte") || route.startsWith("/map")) {
    return PageType.Map
  } else if (route.startsWith("/faq")) {
    return PageType.FAQ
  } else if (route.startsWith("/mention")) {
    return PageType.MentionsLegales
  } else if (route.startsWith("/404")) {
    return PageType.NotFound
  } else {
    return PageType.Accueil
  }
}
