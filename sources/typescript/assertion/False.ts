import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocAssertion } from './UnidocAssertion'

export class False implements UnidocAssertion {
  public readonly state : boolean

  public constructor () {
    this.state = false
  }

  /**
  * @see UnidocAssertion.next
  */
  public next (event: UnidocEvent) : boolean {
    return false
  }

  /**
  * @see UnidocAssertion.complete
  */
  public complete () : boolean {
    return false
  }

  /**
  * @see UnidocAssertion.clone
  */
  public clone () : False {
    return new False()
  }

  /**
  * @see UnidocAssertion.reset
  */
  public reset () : boolean {
    return false
  }

  /**
  * @see Object.toString
  */
  public toString () : string {
    return 'false'
  }
}
