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

