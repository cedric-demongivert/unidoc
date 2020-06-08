import { UnidocValidationProcess } from '../validator/UnidocValidationProcess'
import { ShallowValidationProcess } from '../validator/ShallowValidationProcess'
import { DocumentValidationPolicy } from './validation/DocumentValidationPolicy'

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
    return new ShallowValidationProcess(new DocumentValidationPolicy())
  }
}
