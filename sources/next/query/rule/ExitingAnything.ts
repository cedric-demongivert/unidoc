import { UnidocEvent } from '../../event/UnidocEvent'
import { UnidocEventType } from '../../event/UnidocEventType'

import { UnidocQueryRule } from '../UnidocQueryRule'
import { UnidocQueryCommand } from '../UnidocQueryCommand'

export class ExitingAnything implements UnidocQueryRule {
  public next (event? : UnidocEvent) : UnidocQueryCommand {
    if (event == null) {
      return UnidocQueryCommand.AWAIT
    }

    return (
      event.type === UnidocEventType.END_TAG
    ) ? UnidocQueryCommand.CONTINUE : UnidocQueryCommand.DROP
  }
}

export namespace ExitingAnything {
  export const INSTANCE : ExitingAnything = new ExitingAnything()

  export function factory () : ExitingAnything {
    return INSTANCE
  }
}
