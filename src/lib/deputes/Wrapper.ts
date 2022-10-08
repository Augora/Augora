import supabase from "../supabase/client"

function handleSupabaseError({ error, ...rest }) {
  if (error) {
    throw error
  }
  return rest
}

export function getDeputes() {
  return supabase
    .from("Depute")
    .select(
      `
      *,
      GroupeParlementaire (
        *
      )
      `
    )
    .eq("EstEnMandat", true)
    .then(handleSupabaseError)
    .then((d) => d.body)
}

export function getDeputesSlugs() {
  return supabase
    .from("Depute")
    .select("Slug")
    .eq("EstEnMandat", true)
    .then(handleSupabaseError)
    .then((d) => d.body)
}

export function getGroupes() {
  return supabase
    .from("GroupeParlementaire")
    .select()
    .eq("Actif", true)
    .then(handleSupabaseError)
    .then((d) => d.body)
}

export function getDepute(slug: string) {
  return supabase
    .from("Depute")
    .select(
      `
      *,
      GroupeParlementaire (
        *
      ),
      Activite (
        *
      ),
      Depute_OrganismeParlementaire (
        *,
        OrganismeParlementaire (
          Nom,
          EstPermanent
        )
      )
      `
    )
    .eq("Slug", slug)
    .then(handleSupabaseError)
    .then((d) => d.body[0])
}

export function getDeputesAccropolis() {
  return supabase
    .from("Depute")
    .select(
      `
      *,
      GroupeParlementaire (
        *
      )
      `
    )
    .eq("EstEnMandat", true)
    .then(handleSupabaseError)
    .then((d) => d.body)
}

export function getDeputeAccropolis(slug: string) {
  return supabase
    .from("Depute")
    .select(
      `
      *,
      GroupeParlementaire (
       *
      ),
      Activite (
       *
      )
      `
    )
    .eq("Slug", slug)
    .then(handleSupabaseError)
    .then((d) => d.body[0])
}

export function getDeputesMap() {
  return supabase
    .from("Depute")
    .select(
      `
      Slug,
      URLPhotoAugora,
      Prenom,
      NomDeFamille,
      Nom,
      Sexe,
      Age,
      NumeroDepartement,
      NomDepartement,
      NumeroRegion,
      NomRegion,
      NumeroCirconscription,
      NomCirconscription,
      RattachementFinancier,
      ResponsabiliteGroupe,
      GroupeParlementaire (
        Sigle,
        NomComplet,
        Couleur,
        CouleurDetail,
        URLImage,
        Ordre
      )
      `
    )
    .eq("EstEnMandat", true)
    .then(handleSupabaseError)
    .then((d) => d.body)
}
