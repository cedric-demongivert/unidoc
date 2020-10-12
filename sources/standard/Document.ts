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
}
