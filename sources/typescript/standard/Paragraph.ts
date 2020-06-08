import { UnidocValidationProcess } from '../validator/UnidocValidationProcess'
import { ParagraphValidationProcess } from './validation/ParagraphValidationProcess'

import { Title } from './Title'

export namespace Paragraph {
  export const TAG : string = 'paragraph'

  export const ALLOWED_TAGS : string[] = [
    Title.TAG
  ]

  export function validator () : UnidocValidationProcess {
    return new ParagraphValidationProcess()
  }
}
