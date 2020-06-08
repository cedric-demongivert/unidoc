import { UnidocValidationProcess } from '../validator/UnidocValidationProcess'
import { ShallowValidationProcess } from '../validator/ShallowValidationProcess'
import { ParagraphValidationPolicy } from './validation/ParagraphValidationPolicy'

import { Title } from './Title'

export namespace Paragraph {
  export const TAG : string = 'paragraph'

  export const ALLOWED_TAGS : string[] = [
    Title.TAG
  ]

  export function validator () : UnidocValidationProcess {
    return new ShallowValidationProcess(new ParagraphValidationPolicy())
  }
}
