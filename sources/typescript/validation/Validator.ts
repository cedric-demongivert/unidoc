import { UnidocListener } from '../../generated/UnidocListener'

import { UnidocContext } from "../../generated/UnidocParser"
import { ContentContext } from "../../generated/UnidocParser"
import { BlockContext } from "../../generated/UnidocParser"
import { WordContext } from "../../generated/UnidocParser"
import { WhitespaceContext } from "../../generated/UnidocParser"
import { ElementContext } from "../../generated/UnidocParser"

export class Validator implements UnidocListener {
  public enterUnidoc (context: UnidocContext) : void {
    console.log('entering unidoc')
  }

  public exitUnidoc (context: UnidocContext) : void {
    console.log('exiting unidoc')
  }

  public enterContent (context: ContentContext) : void {
    console.log('entering content')
  }

  public exitContent (context: ContentContext) : void {
    console.log('exiting content')
  }

  public enterBlock (context: BlockContext) : void {
    console.log('entering block')
  }

  public exitBlock (context: BlockContext) : void {
    console.log('exiting block')
  }

  public enterWord (context: WordContext) : void {
    console.log('entering word')
  }

  public exitWord (context: WordContext) : void {
    console.log('exiting word')
  }

  public enterWhitespace (context: WhitespaceContext) : void {
    console.log('entering whitespace')
  }

  public exitWhitespace (context: WhitespaceContext) : void {
    console.log('exiting whitespace')
  }

  public enterElement (context: ElementContext) : void {
    console.log('entering element')
  }

  public exitElement (context: ElementContext) : void {
    console.log('exiting element')
  }
}
