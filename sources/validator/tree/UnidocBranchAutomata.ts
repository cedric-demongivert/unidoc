import { UnidocEvent } from '../../event/UnidocEvent'

import { UnidocBranchValidator } from './UnidocBranchValidator'

export interface UnidocBranchAutomata {
  /**
  * Called when the validation process begin.
  *
  * @param branch - The validation process that begin.
  */
  initialize(branch: UnidocBranchValidator): void

  /**
  * Called when the validation process must validate a given unidoc event.
  *
  * @param branch - The validation process that must validate a given unidoc event.
  * @param event - The event to validate.
  */
  validate(branch: UnidocBranchValidator, event: UnidocEvent): void

  /**
  * Called just before the validation process end.
  *
  * @param branch - The validation process that will end.
  */
  complete(branch: UnidocBranchValidator): void

  /**
  * Called just before the last active validation process end.
  *
  * @param branch - The last active validation process that will end.
  */
  last(branch: UnidocBranchValidator): void
}
