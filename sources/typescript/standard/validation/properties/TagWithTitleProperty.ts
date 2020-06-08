import { UnidocEventType } from '../../../event/UnidocEventType'
import { UnidocEvent } from '../../../event/UnidocEvent'

import { UnidocValidationContext } from '../../../validator/UnidocValidationContext'

import { Title } from '../../Title'

import { StandardErrorCode } from '../StandardErrorCode'
import { StandardWarningCode } from '../StandardWarningCode'

export class TagWithTitleProperty {
  private _hasDiscoveredContent : boolean
  private _hasDiscoveredTitle   : boolean
  private _depth : number

  public constructor () {
    this._hasDiscoveredContent = false
    this._hasDiscoveredTitle   = false
    this._depth = 0
  }

  /**
  * @see UnidocValidationProcess.resolve
  */
  public resolve (context : UnidocValidationContext) : void {
    if (this._depth > 0) {
      this.resolveDeepEvent(context)
    } else if (this._depth === 0) {
      this.resolveShallowEvent(context)
    }
  }

  private resolveDeepEvent (context : UnidocValidationContext) : void {
    switch (context.event.type) {
      case UnidocEventType.START_TAG:
        this._depth += 1
        return
      case UnidocEventType.END_TAG:
        this._depth -= 1
        return
      case UnidocEventType.WORD:
      case UnidocEventType.WHITESPACE:
        return
    }
  }

  private resolveShallowEvent (context : UnidocValidationContext) : void {
    switch (context.event.type) {
      case UnidocEventType.START_TAG:
        return this.resolveTag(context)
      case UnidocEventType.END_TAG:
        return this.resolveTermination(context)
      case UnidocEventType.WORD:
        return this.resolveWord(context)
      case UnidocEventType.WHITESPACE:
        return this.resolveWhitespace(context)
    }
  }

  private resolveWhitespace (context : UnidocValidationContext) : void {

  }

  private resolveWord (context : UnidocValidationContext) : void {
    this._hasDiscoveredContent = true
  }

  private resolveTermination (context : UnidocValidationContext) : void {
    if (!this._hasDiscoveredTitle) {
      this.makeOptionalTitleWarning(context)
      context.emit()
    }

    this._depth -= 1
  }

  private resolveTag (context : UnidocValidationContext) : void {
    if (context.event.tag === Title.TAG) {
      this.resolveTitle(context)
    }

    this._depth += 1
    this._hasDiscoveredContent = true
  }

  private resolveTitle (context : UnidocValidationContext) : void {
    if (this._hasDiscoveredTitle) {
      this.makeTooManyTitleError(context)
      context.emit()
    } else if (this._hasDiscoveredContent) {
      this.makePreferTitleFirstWarning(context)
      context.emit()
    }

    this._hasDiscoveredTitle = true
  }

  private makeOptionalTitleWarning (context : UnidocValidationContext) : void {
    const event : UnidocEvent = context.event.clone()

    context.validation.clear()
    context.validation.asWarning()
    context.validation.code = StandardWarningCode.OPTIONAL_TAG_PRESENCE_PREFERRED
    context.validation.path.copy(event.path)
    context.validation.data.set('parent', event.path.elements.get(event.path.size - 1).tag)
    context.validation.data.set('tag', Title.TAG)
    context.validation.data.set('event', event)
  }

  private makePreferTitleFirstWarning (context : UnidocValidationContext) : void {
    const event : UnidocEvent = context.event.clone()

    context.validation.clear()
    context.validation.asWarning()
    context.validation.code = StandardWarningCode.TAG_PREFERRED_FIRST
    context.validation.path.copy(event.path)
    context.validation.data.set('parent', event.path.elements.get(event.path.size - 1).tag)
    context.validation.data.set('tag', Title.TAG)
    context.validation.data.set('event', event)
  }

  private makeTooManyTitleError (context : UnidocValidationContext) : void {
    const event : UnidocEvent = context.event.clone()

    context.validation.clear()
    context.validation.asWarning()
    context.validation.code = StandardErrorCode.TOO_MANY_TAG
    context.validation.path.copy(event.path)
    context.validation.data.set('parent', event.path.elements.get(event.path.size - 1).tag)
    context.validation.data.set('tag', Title.TAG)
    context.validation.data.set('allowedNumber', [0, 1])
    context.validation.data.set('event', event)
  }
}
