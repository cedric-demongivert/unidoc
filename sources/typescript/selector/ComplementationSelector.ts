import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocSelector } from './UnidocSelector'

export class ComplementationSelector implements UnidocSelector {
  /**
  * Operand of this complementation.
  */
  public readonly operand : UnidocSelector

  /**
  * Instantiate a new complementation.
  *
  * @param operand - Operand of the complementation to instantiate.
  */
  public constructor (operand : UnidocSelector) {
    this.operand = operand
  }

  /**
  * @see UnidocSelector.next
  */
  public next (event: UnidocEvent) : boolean {
    return !this.operand.next(event)
  }

  /**
  * @see UnidocSelector.reset
  */
  public reset () : void {
    this.operand.reset()
  }

  /**
  * @see UnidocSelector.clone
  */
  public clone () : ComplementationSelector {
    return new ComplementationSelector(this.operand.clone())
  }

  /**
  * @see UnidocSelector.toString
  */
  public toString () : string {
    return 'NOT ' + this.operand.toString()
  }
}
