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
      .replace(/[^a-z0-9']/gi, "-") // final clean up
  }