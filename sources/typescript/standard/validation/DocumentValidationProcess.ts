import { UnidocEventType } from '../../event/UnidocEventType'
import { UnidocEvent } from '../../event/UnidocEvent'

import { UnidocValidationProcess } from '../../validator/UnidocValidationProcess'
import { UnidocValidationContext } from '../../validator/UnidocValidationContext'

import { Document } from '../Document'
import { Title } from '../Title'
import { Paragraph } from '../Paragraph'
import { Section } from '../Section'

import { TagWithTitleProperty } from './properties/TagWithTitleProperty'

import { StandardErrorCode } from './StandardErrorCode'

import { SkipTagValidationProcess } from './SkipTagValidationProcess'

export class DocumentValidationProcess implements UnidocValidationProcess {
  private _tagWithTitle : TagWithTitleProperty

  public constructor () {
    this._tagWithTitle = new TagWithTitleProperty()
  }

  /**
  * @see UnidocValidationProcess.resolve
  */
  public resolve (context : UnidocValidationContext) : void {
    this._tagWithTitle.resolve(context)

    switch (context.event.type) {
      case UnidocEventType.START_TAG:
        return this.resolveTag(context)
      case UnidocEventType.END_TAG:
        return context.terminate()
      case UnidocEventType.WORD:
        this.makeForbiddenContentError(context)
        return context.emit()
      case UnidocEventType.WHITESPACE:
        return
    }
  }

  private resolveTag (context : UnidocValidationContext) : void {
    if (context.event.tag === Title.TAG) {
      context.start(Title.validator())
    } else if (context.event.tag === Paragraph.TAG) {
      context.start(Paragraph.validator())
    }  else if (context.event.tag === Section.TAG) {
      context.start(Section.validator())
    } else {
      this.makeForbiddenContentError(context)
      context.emit()
      context.start(new SkipTagValidationProcess())
    }
  }

  /**
  *
  */
  private makeForbiddenContentError (context : UnidocValidationContext) : void {
    const event : UnidocEvent = context.event.clone()

    context.validation.clear()
    context.validation.asError()
    context.validation.code = StandardErrorCode.FORBIDDEN_CONTENT
    context.validation.path.copy(event.path)
    context.validation.data.set('parent', Document.TAG)
    context.validation.data.set('content', event)
    context.validation.data.set('allowWords', true)
    context.validation.data.set('allowWhitespaces', true)
    context.validation.data.set('allowedTags', Paragraph.ALLOWED_TAGS)
  }
}
