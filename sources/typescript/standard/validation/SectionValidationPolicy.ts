import { UnidocEventType } from '../../event/UnidocEventType'
import { UnidocEvent } from '../../event/UnidocEvent'

import { UnidocValidationContext } from '../../validator/UnidocValidationContext'
import { ShallowValidationPolicy } from '../../validator/ShallowValidationPolicy'

import { Title } from '../Title'
import { Paragraph } from '../Paragraph'
import { Section } from '../Section'

import { TagWithTitleValidationPolicy } from './TagWithTitleValidationPolicy'

import { StandardErrorCode } from './StandardErrorCode'

export class SectionValidationPolicy implements ShallowValidationPolicy {
  private _tagWithTitle : TagWithTitleValidationPolicy

  public constructor () {
    this._tagWithTitle = new TagWithTitleValidationPolicy()
  }

  /**
  * @see ShallowValidationPolicy.start
  */
  public start (context : UnidocValidationContext) : void {
    this._tagWithTitle.start(context)
  }

  /**
  * @see ShallowValidationPolicy.shallow
  */
  public shallow (context : UnidocValidationContext) : void {
    this._tagWithTitle.shallow(context)

    switch (context.event.type) {
      case UnidocEventType.START_TAG:
        return this.resolveTag(context)
      case UnidocEventType.WORD:
        this.makeForbiddenContentError(context)
        context.emit()
      case UnidocEventType.END_TAG:
      case UnidocEventType.WHITESPACE:
        return
    }
  }

  private resolveTag (context : UnidocValidationContext) {
    if (context.event.tag === Title.TAG) {
      context.start(Title.validator())
    } else if (context.event.tag === Paragraph.TAG) {
      context.start(Paragraph.validator())
    } else if (context.event.tag === Section.TAG) {
      context.start(Section.validator())
    } else {
      this.makeForbiddenContentError(context)
      context.emit()
    }
  }

  /**
  * @see ShallowValidationPolicy.end
  */
  public end (context : UnidocValidationContext) : void {
    this._tagWithTitle.end(context)
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
    context.validation.data.set('parent', Paragraph.TAG)
    context.validation.data.set('content', event)
    context.validation.data.set('allowWords', true)
    context.validation.data.set('allowWhitespaces', true)
    context.validation.data.set('allowedTags', Section.ALLOWED_TAGS)
  }
}
