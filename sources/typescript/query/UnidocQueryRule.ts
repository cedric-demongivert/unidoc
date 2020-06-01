import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocQueryCommand } from './UnidocQueryCommand'

export interface UnidocQueryRule {
  /**
  * Called when the automaton evolve.
  *
  * @param event - Discovered event.
  *
  * @return The decision of this rule in regard of the received event.
  */
  next (event? : UnidocEvent) : UnidocQueryCommand
}
