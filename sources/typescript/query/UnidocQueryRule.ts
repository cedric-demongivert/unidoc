import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocQueryRuleOutput } from './UnidocQueryRuleOutput'

export interface UnidocQueryRule {
  /**
  * Called when the rule execution begins.
  *
  * @return The decision of this rule in regard of the received event.
  */
  start () : UnidocQueryRuleOutput

  /**
  * Called when the validator discover a new event.
  *
  * @param event
  *
  * @return The decision of this rule in regard of the received event.
  */
  next (event : UnidocEvent) : UnidocQueryRuleOutput

  /**
  * Called when the validator discover the end of a given document.
  */
  end () : UnidocQueryRuleOutput

  /**
  * Duplicate this rule.
  */
  clone () : UnidocQueryRule
}

export namespace UnidocQueryRule {

}
