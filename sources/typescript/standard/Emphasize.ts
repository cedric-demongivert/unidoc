import { UnidocValidationProcess } from '../validator/UnidocValidationProcess'
import { ShallowValidationProcess } from '../validator/ShallowValidationProcess'
import { EmphasizeValidationPolicy } from './validation/EmphasizeValidationPolicy'

export namespace Emphasize {
  export const TAG : string = 'emphasize'

  export const ALLOWED_TAGS : string[] =  []

  export function validator () : UnidocValidationProcess {
    return new ShallowValidationProcess(new EmphasizeValidationPolicy())
  }
}
