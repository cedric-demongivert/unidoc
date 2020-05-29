import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocQueryRule } from './UnidocQueryRule'
import { UnidocQueryRuleOutput } from './UnidocQueryRuleOutput'

export class UnidocQueryStarRule implements UnidocQueryRule {
  /**
  * @see UnidocQueryRule.start
  */
  public start () : UnidocQueryRuleOutput {
    return UnidocQueryRuleOutput.SUCCESS
  }

  /**
  * @see UnidocQueryRule.next
  */
  public next (event : UnidocEvent) : UnidocQueryRuleOutput {
    return UnidocQueryRuleOutput.SUCCESS
  }

  /**
  * @see UnidocQueryRule.end
  */
  public end () : UnidocQueryRuleOutput {
    return UnidocQueryRuleOutput.SUCCESS
  }

  /**
  * @see UnidocQueryRule.clone
  */
  public clone () : UnidocQueryStarRule {
    return new UnidocQueryStarRule()
  }
}
