export interface RouterProps<T> {
  match: {
    params: T;
  };
}

export default function calculateBlockSize(size: string) {
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
