export interface RouterProps<T> {
  match: {
    params: T
  }
}

export function calculateBlockSize(size: string) {
  switch (size) {
    case "line":
      return 4
    case "halfLine":
      return 2
    case "block":
      return 1
    default:
      return 1
  }
}

export function retirerAccentsFR(string: string) {
  return string
    .replace(/[ÀÁÂÃÄÅ]/g, "A")
    .replace(/[àáâãäå]/g, "a")
    .replace(/[ÈÉÊË]/g, "E")
    .replace(/[èéêë]/g, "e")
    .replace(/[Î]/g, "I")
    .replace(/[î]/g, "i")
    .replace(/[Ô]/g, "O")
    .replace(/[ô]/g, "o")
    .replace(/[Ù]/g, "U")
    .replace(/[ù]/g, "u")
    .replace(/[Ç]/g, "C")
    .replace(/[ç]/g, "c")
    .replace(/[^a-z0-9\']/gi, "-") // final clean up
}

export function slugify(string: string) {
  const a =
    "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;"
  const b =
    "aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnooooooooprrsssssttuuuuuuuuuwxyyzzz------"
  const p = new RegExp(a.split("").join("|"), "g")

  return string
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, "") // Trim - from end of text
}

export function getColorLuminosity(string: string) {
  return string.includes("hsl")
    ? parseInt(string.split(",")[2].split("%")[0])
    : null
}

export function getTextColorContrast(type: string) {
  switch (type) {
    case "light":
      return "rgba(255,255,255,0.8)"
    case "dark":
      return "rgba(0,0,0,0.8)"
    default:
      return "rgba(0,0,0,0.8)"
  }
}

export function calculatePercentage(numerateur: number, denominateur: number) {
  return (denominateur * 100) / numerateur
}
