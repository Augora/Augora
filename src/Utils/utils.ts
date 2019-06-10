export interface RouterProps<T> {
  match: {
    params: T;
  };
}