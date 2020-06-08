import { UnidocValidationProcess } from '../validator/UnidocValidationProcess'
import { SectionValidationProcess } from './validation/SectionValidationProcess'

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
    return new SectionValidationProcess()
  }
}
