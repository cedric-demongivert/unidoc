import { UnidocValidationProcess } from '../validator/UnidocValidationProcess'
import { TitleValidationProcess } from './validation/TitleValidationProcess'

export namespace Title {
  export const TAG : string = 'title'
  
  export const ALLOWED_TAGS : string[] =  []

  export function validator () : UnidocValidationProcess {
    return new TitleValidationProcess()
  }
}
