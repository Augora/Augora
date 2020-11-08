/**
 * Retrieve coworkers link to a deputy
 * @param deputy
 */
export function getCoworkers(deputy: any) {
  const coworkers = deputy.Collaborateurs.map((collab) => {
    const coworker = {
      coworker: collab,
    }

    return coworker
  })

  const props = {
    coworkers: coworkers,
  }

  return props
}
