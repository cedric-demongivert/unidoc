import { UnidocValidationContext } from './UnidocValidationContext'

export interface UnidocValidationProcess {
  /**
  * Handle the next available unidoc event.
  *
  * @param context - The next available unidoc event.
  */
  resolve (context : UnidocValidationContext) : void
}
