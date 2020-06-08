import { UnidocValidationProcess } from '../validator/UnidocValidationProcess'
import { DocumentValidationProcess } from './validation/DocumentValidationProcess'
import { SkipRootValidationProcess } from './validation/SkipRootValidationProcess'

import { Paragraph } from './Paragraph'
import { Title } from './Title'
import { Section } from './Section'

export namespace Document {
  export const TAG : string = 'document'

  export const ALLOWED_TAGS : string[] = [
    Title.TAG,
    Paragraph.TAG,
    Section.TAG
  ]

  export function validator () : UnidocValidationProcess {
    return new SkipRootValidationProcess(new DocumentValidationProcess())
  }
}
