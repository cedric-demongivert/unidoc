import { UnidocContext } from '@grammar/UnidocParser'
import { ContentContext } from '@grammar/UnidocParser'
import { BlockContext } from '@grammar/UnidocParser'
import { WordContext } from '@grammar/UnidocParser'
import { WhitespaceContext } from '@grammar/UnidocParser'
import { ElementContext } from '@grammar/UnidocParser'

import { Validation } from './Validation'

export interface Validator {
  public begin () : void

  public enterContent (context: ContentContext) : void
  public exitContent (context: ContentContext) : void
  public enterBlock (context: BlockContext) : void
  public exitBlock (context: BlockContext) : void
  public enterWord (context: WordContext) : void
  public exitWord (context: WordContext) : void
  public enterWhitespace (context: WhitespaceContext) : void
  public exitWhitespace (context: WhitespaceContext) : void
  public enterElement (context: ElementContext) : void
  public exitElement (context: ElementContext) : void

  public terminate () : Validation
}
