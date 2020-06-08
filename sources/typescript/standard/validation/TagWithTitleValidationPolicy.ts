import { UnidocEventType } from '../../event/UnidocEventType'
import { UnidocEvent } from '../../event/UnidocEvent'

import { UnidocValidationContext } from '../../validator/UnidocValidationContext'
import { ShallowValidationPolicy } from '../../validator/ShallowValidationPolicy'

import { Title } from '../Title'

import { StandardErrorCode } from './StandardErrorCode'
import { StandardWarningCode } from './StandardWarningCode'

export class TagWithTitleValidationPolicy implements ShallowValidationPolicy {
  private _hasDiscoveredContent : boolean
  private _hasDiscoveredTitle   : boolean

  public constructor () {
    this._hasDiscoveredContent = false
    this._hasDiscoveredTitle   = false
  }

  /**
  * @see ShallowValidation.start
  */
  public start (context : UnidocValidationContext) : void {

  }

  /**
  * @see ShallowValidation.shallow
  */
  public shallow (context : UnidocValidationContext) : void {
    switch (context.event.type) {
      case UnidocEventType.START_TAG:
        if (context.event.tag === Title.TAG) {
          this.resolveTitle(context)
        }
      case UnidocEventType.WORD:
        this._hasDiscoveredContent = true
      default:
        return
    }
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

  /**
  * @see ShallowValidation.end
  */
  public end (context : UnidocValidationContext) : void {
    if (!this._hasDiscoveredTitle) {
      this.makeOptionalTitleWarning(context)
      context.emit()
    }
  }

  private makeOptionalTitleWarning (context : UnidocValidationContext) : void {
    const event : UnidocEvent = context.event.clone()

    context.validation.clear()
    context.validation.asWarning()
    context.validation.code = StandardWarningCode.OPTIONAL_TAG_PRESENCE_PREFERRED
    context.validation.path.copy(event.path)
    context.validation.data.set('parent', event.tag)
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
