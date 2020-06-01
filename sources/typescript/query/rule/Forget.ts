import { UnidocEvent } from '../../event/UnidocEvent'

import { UnidocQueryRule } from '../UnidocQueryRule'
import { UnidocQueryCommand } from '../UnidocQueryCommand'

export class Forget implements UnidocQueryRule {
  public next (event? : UnidocEvent) : UnidocQueryCommand {
    return UnidocQueryCommand.FORGET
  }
}

export namespace Forget {
  export const INSTANCE : Forget = new Forget()

  export function factory () : Forget {
    return INSTANCE
  }
}
