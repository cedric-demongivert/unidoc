import { UnidocEvent } from '../../event/UnidocEvent'
import { UnidocEventType } from '../../event/UnidocEventType'

import { UnidocQueryRule } from '../UnidocQueryRule'
import { UnidocQueryCommand } from '../UnidocQueryCommand'

export class Word implements UnidocQueryRule {
  public next (event? : UnidocEvent) : UnidocQueryCommand {
    if (event == null) {
      return UnidocQueryCommand.AWAIT
    }

    return event.type === UnidocEventType.WORD ? UnidocQueryCommand.CONTINUE
                                               : UnidocQueryCommand.DROP
  }
}

export namespace Word {
  export const INSTANCE : Word = new Word()

  export function factory () : Word {
    return INSTANCE
  }
}
