import { UnidocValidationProcess } from '../validator/UnidocValidationProcess'
import { ShallowValidationProcess } from '../validator/ShallowValidationProcess'
import { SectionValidationPolicy } from './validation/SectionValidationPolicy'

import { Title } from './Title'
import { Paragraph } from './Paragraph'

export namespace Section {
  export const TAG : string = 'section'

  export const ALLOWED_TAGS : string[] = [
    Title.TAG,
    Paragraph.TAG,
    Section.TAG
  ]

  export function validator () : UnidocValidationProcess {
    return new ShallowValidationProcess(new SectionValidationPolicy())
  }
}
