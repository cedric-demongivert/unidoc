import { UnidocEvent } from '../../event/UnidocEvent'

import { UnidocQueryRule } from '../UnidocQueryRule'
import { UnidocQueryCommand } from '../UnidocQueryCommand'

export class Continue implements UnidocQueryRule {
  public next (event? : UnidocEvent) : UnidocQueryCommand {
    return UnidocQueryCommand.CONTINUE
  }
}

export namespace Continue {
  export const INSTANCE : Continue = new Continue()

  export function factory () : Continue {
    return INSTANCE
  }
}
