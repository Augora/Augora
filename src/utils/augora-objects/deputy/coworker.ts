import { ICoworkers } from "components/deputy/coworkers/Coworkers"
import { ICoworker } from "components/deputy/coworkers/coworker/Coworker"

/**
 * Retrieve coworkers link to a deputy
 * @param deputy 
 */
export function getCoworkers(deputy: any): ICoworkers {
    const coworkers: Array<ICoworker> = deputy.Collaborateurs.map(collab => {
      const coworker: ICoworker = {
        coworker: collab,
      }
  
      return coworker
    })
  
    const props: ICoworkers = {
      coworkers: coworkers,
    }
  
    return props
  }