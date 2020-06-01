import { UnidocEvent } from '../../event/UnidocEvent'

import { UnidocQueryRule } from '../UnidocQueryRule'
import { UnidocQueryCommand } from '../UnidocQueryCommand'

export class Anything implements UnidocQueryRule {
  public next (event? : UnidocEvent) : UnidocQueryCommand {
    return event == null ? UnidocQueryCommand.AWAIT
                         : UnidocQueryCommand.CONTINUE
  }
}

export namespace Anything {
  export const INSTANCE : Anything = new Anything()

  export function factory () : Anything {
    return INSTANCE
  }
}
