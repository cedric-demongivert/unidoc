import { UnidocEvent } from '../../event/UnidocEvent'
import { UnidocEventType } from '../../event/UnidocEventType'

import { UnidocQueryRule } from '../UnidocQueryRule'
import { UnidocQueryCommand } from '../UnidocQueryCommand'

export class EnteringAnything implements UnidocQueryRule {
  public next (event? : UnidocEvent) : UnidocQueryCommand {
    if (event == null) {
      return UnidocQueryCommand.AWAIT
    }

    return (
      event.type === UnidocEventType.START_TAG
    ) ? UnidocQueryCommand.CONTINUE : UnidocQueryCommand.DROP
  }
}

export namespace EnteringAnything {
  export const INSTANCE : EnteringAnything = new EnteringAnything()

  export function factory () : EnteringAnything {
    return INSTANCE
  }
}
