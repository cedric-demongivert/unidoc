import { UnidocValidationProcess } from '../validator/UnidocValidationProcess'
import { ShallowValidationProcess } from '../validator/ShallowValidationProcess'
import { TitleValidationPolicy } from './validation/TitleValidationPolicy'

export namespace Title {
  export const TAG : string = 'title'

  export const ALLOWED_TAGS : string[] =  []

  export function validator () : UnidocValidationProcess {
    return new ShallowValidationProcess(new TitleValidationPolicy())
  }
}
