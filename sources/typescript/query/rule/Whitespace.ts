import { UnidocEvent } from '../../event/UnidocEvent'
import { UnidocEventType } from '../../event/UnidocEventType'

import { UnidocQueryRule } from '../UnidocQueryRule'
import { UnidocQueryCommand } from '../UnidocQueryCommand'

export class Whitespace implements UnidocQueryRule {
  public next (event? : UnidocEvent) : UnidocQueryCommand {
    if (event == null) {
      return UnidocQueryCommand.AWAIT
    }

    return (
      event.type === UnidocEventType.WHITESPACE
    ) ? UnidocQueryCommand.CONTINUE : UnidocQueryCommand.DROP
  }
}

export namespace Whitespace {
  export const INSTANCE : Whitespace = new Whitespace()

  export function factory () : Whitespace {
    return INSTANCE
  }
}
