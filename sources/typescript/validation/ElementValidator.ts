import { Validator } from './Validator'

export class ElementValidator implements Validator {
  private _allowContent : boolean
  private _allowBlocks : boolean
  private _allowElements : boolean

  public enterContent (context: ContentContext) : void {

  }

  public exitContent (context: ContentContext) : void {

  }

  public enterBlock (context: BlockContext) : void {

  }

  public exitBlock (context: BlockContext) : void {

  }

  public enterWord (context: WordContext) : void {

  }

  public exitWord (context: WordContext) : void {

  }

  public enterWhitespace (context: WhitespaceContext) : void {

  }

  public exitWhitespace (context: WhitespaceContext) : void {

  }

  public enterElement (context: ElementContext) : void {

  }

  public exitElement (context: ElementContext) : void {

  }
}
