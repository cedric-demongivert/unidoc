import { UnidocEventType } from '../../event/UnidocEventType'
import { UnidocEvent } from '../../event/UnidocEvent'

import { UnidocValidationContext } from '../../validator/UnidocValidationContext'
import { ShallowValidationPolicy } from '../../validator/ShallowValidationPolicy'

import { Emphasize } from '../Emphasize'

import { StandardErrorCode } from './StandardErrorCode'

export class EmphasizeValidationPolicy implements ShallowValidationPolicy {
  /**
  * @see ShallowValidationPolicy.start
  */
  public start (context : UnidocValidationContext) : void {
  }

  /**
  * @see ShallowValidationPolicy.shallow
  */
  public shallow (context : UnidocValidationContext) : void {
    if (context.event.type === UnidocEventType.START_TAG) {
      this.makeForbiddenContentError(context)
      context.emit()
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
    context.validation.data.set('parent', Emphasize.TAG)
    context.validation.data.set('content', event)
    context.validation.data.set('allowWords', true)
    context.validation.data.set('allowWhitespaces', true)
    context.validation.data.set('allowedTags', Emphasize.ALLOWED_TAGS)
  }
}
