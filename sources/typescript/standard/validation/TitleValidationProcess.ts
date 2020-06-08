import { UnidocEventType } from '../../event/UnidocEventType'
import { UnidocEvent } from '../../event/UnidocEvent'

import { UnidocValidationProcess } from '../../validator/UnidocValidationProcess'
import { UnidocValidationContext } from '../../validator/UnidocValidationContext'

import { Title } from '../Title'

import { SkipTagValidationProcess } from './SkipTagValidationProcess'
import { StandardErrorCode } from './StandardErrorCode'

export class TitleValidationProcess implements UnidocValidationProcess {
  /**
  * @see UnidocValidationProcess.resolve
  */
  public resolve (context : UnidocValidationContext) : void {
    switch (context.event.type) {
      case UnidocEventType.START_TAG:
        this.makeForbiddenContentError(context)
        context.emit()
        context.start(new SkipTagValidationProcess())
        return
      case UnidocEventType.END_TAG:
        context.terminate()
        return
      case UnidocEventType.WHITESPACE:
      case UnidocEventType.WORD:
        return
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
    context.validation.data.set('parent', Title.TAG)
    context.validation.data.set('content', event)
    context.validation.data.set('allowWords', true)
    context.validation.data.set('allowWhitespaces', true)
    context.validation.data.set('allowedTags', Title.ALLOWED_TAGS)
  }
}
