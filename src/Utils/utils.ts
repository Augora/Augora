export interface RouterProps<T> {
  match: {
    params: T;
  };
}

export function calculateBlockSize(size: string) {
  switch (size) {
    case 'line':
      return 4;
    case 'halfLine':
      return 2;
    case 'block':
      return 1;
    default:
      return 1;
  }
}

export function retirerAccentsFR(string: string) {
    return string
        .replace(/[ÀÁÂÃÄÅ]/g,"A")
        .replace(/[àáâãäå]/g,"a")
        .replace(/[ÈÉÊË]/g,"E")
        .replace(/[èéêë]/g,"e")
        .replace(/[Î]/g,"I")
        .replace(/[î]/g,"i")
        .replace(/[Ô]/g,"O")
        .replace(/[ô]/g,"o")
        .replace(/[Ù]/g,"U")
        .replace(/[ù]/g,"u")
        .replace(/[Ç]/g,"C")
        .replace(/[ç]/g,"c")
        .replace(/[^a-z0-9\']/gi,'-'); // final clean up
}