import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocAssertion } from './UnidocAssertion'

export class True implements UnidocAssertion {
  public readonly state : boolean

  public constructor () {
    this.state = true
  }

  /**
  * @see UnidocAssertion.next
  */
  public next (event: UnidocEvent) : boolean {
    return true
  }

  /**
  * @see UnidocAssertion.complete
  */
  public complete () : boolean {
    return true
  }

  /**
  * @see UnidocAssertion.clone
  */
  public clone () : True {
    return new True()
  }

  /**
  * @see UnidocAssertion.reset
  */
  public reset () : boolean {
    return true
  }

  /**
  * @see Object.toString
  */
  public toString () : string {
    return 'true'
  }
}
