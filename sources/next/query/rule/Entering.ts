import { UnidocEvent } from '../../event/UnidocEvent'
import { UnidocEventType } from '../../event/UnidocEventType'

import { UnidocQueryRule } from '../UnidocQueryRule'
import { UnidocQueryRuleFactory } from '../UnidocQueryRuleFactory'
import { UnidocQueryCommand } from '../UnidocQueryCommand'

export class Entering implements UnidocQueryRule {
  public readonly tag : string

  public constructor (tag : string) {
    this.tag = tag
  }

  public next (event? : UnidocEvent) : UnidocQueryCommand {
    if (event == null) {
      return UnidocQueryCommand.AWAIT
    }

    return (
      event.type === UnidocEventType.START_TAG &&
      event.tag === this.tag
    ) ? UnidocQueryCommand.CONTINUE : UnidocQueryCommand.DROP
  }
}

export namespace Entering {
  export function factory (tag : string) : UnidocQueryRuleFactory<Entering> {
    return Entering.bind(tag)
  }
}
