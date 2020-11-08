import { UnidocEvent } from '../../event/UnidocEvent'

import { UnidocBranchValidator } from './UnidocBranchValidator'

import { UnidocBranchAutomata } from './UnidocBranchAutomata'

export class UnidocNullBranchAutomata implements UnidocBranchAutomata {
  /**
  * @see UnidocBranchAutomata.initialize
  */
  public initialize(_branch: UnidocBranchValidator): void {
    throw new Error('A null unidoc branch automata can\'t handle an initialization.')
  }

  /**
  * @see UnidocBranchAutomata.validate
  */
  public validate(_branch: UnidocBranchValidator, _event: UnidocEvent): void {
    throw new Error('A null unidoc branch automata can\'t handle an event validation.')
  }

  /**
  * @see UnidocBranchAutomata.complete
  */
  public complete(_branch: UnidocBranchValidator): void {
    throw new Error('A null unidoc branch automata can\'t handle a completion.')
  }

  /**
  * @see UnidocBranchAutomata.last
  */
  public last(_branch: UnidocBranchValidator): void {
    throw new Error('A null unidoc branch automata can\'t handle a last callback.')
  }
}

export namespace UnidocNullBranchAutomata {
  export const INSTANCE: UnidocNullBranchAutomata = new UnidocNullBranchAutomata()

  export function create(): UnidocNullBranchAutomata {
    return INSTANCE
  }
}
