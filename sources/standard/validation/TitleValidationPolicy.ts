import { UnidocEventType } from '../../event/UnidocEventType'
import { UnidocEvent } from '../../event/UnidocEvent'

import { ShallowValidationPolicy } from '../../validator/ShallowValidationPolicy'
import { UnidocValidationContext } from '../../validator/UnidocValidationContext'

import { Title } from '../Title'

import { StandardErrorCode } from './StandardErrorCode'

export class TitleValidationPolicy implements ShallowValidationPolicy {
  /**
  * @see ShallowValidationPolicy.start
  */
  public start (context : UnidocValidationContext) : void {

  }

  /**
  * @see ShallowValidationPolicy.shallow
  */
  public shallow (context : UnidocValidationContext) : void {
    switch (context.event.type) {
      case UnidocEventType.START_TAG:
        this.makeForbiddenContentError(context)
        context.emit()
        return
      case UnidocEventType.END_TAG:
      case UnidocEventType.WHITESPACE:
      case UnidocEventType.WORD:
        return
    }
  }

  /**
  * @see ShallowValidationPolicy.end
  */
  public end (context : UnidocValidationContext) : void {

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
    context.validation.data.set('parent', Title.TAG)
    context.validation.data.set('content', event)
    context.validation.data.set('allowWords', true)
    context.validation.data.set('allowWhitespaces', true)
    context.validation.data.set('allowedTags', Title.ALLOWED_TAGS)
  }
}
