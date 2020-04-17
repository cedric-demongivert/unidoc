import { UnidocValidation } from '../validation/UnidocValidation'
import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { StandardErrorCode } from './StandardErrorCode'

export type StandardErrorFormatter = (validation : UnidocValidation, event : UnidocEvent) => void

export namespace StandardErrorFormatter {
  export function createNotEnoughTagFormatter (tag : string, required : number) : StandardErrorFormatter {
    return function notEnoughTagFormatter (validation : UnidocValidation, event : UnidocEvent) : void {
      validation.clear()
      validation.asError()
      validation.code = StandardErrorCode.NOT_ENOUGH_TAG
      validation.data.set('tag', tag)
      validation.data.set('count', context.allowWords)
      validation.data.set('required', required)
      validation.path.copy(event.path)
      validation.path.pushSymbol(event.from)

      switch (event.type) {
        case UnidocEventType.START_TAG:
          validation.data.set('type', 'tag')
          validation.data.set('tag', event.tag)
          validation.data.set('word', undefined)
          validation.data.set('whitespace', undefined)
          break
        case UnidocEventType.WORD:
          validation.data.set('type', 'word')
          validation.data.set('tag', undefined)
          validation.data.set('word', event.text)
          validation.data.set('whitespace', undefined)
          break
        case UnidocEventType.WHITESPACE:
          validation.data.set('type', 'whitespace')
          validation.data.set('tag', undefined)
          validation.data.set('word', undefined)
          validation.data.set('whitespace', event.debugText)
          break
        default:
          throw Error('Invalid event as source of a standard forbidden content error.')
      }
    }
  }

  /**
  * Create a new formatter for turning validation instances into standard
  * forbidden content errors.
  *
  * @param context - A context that allows to get the authorized choices.
  *
  * @return A formatter for turning validation instances into standard forbidden content errors.
  */
  export function createForbiddenContentFormatter (context : { allowedTags : Iterable<string>, allowWords : boolean, allowWhitespaces : boolean }) : StandardErrorFormatter {
    return function forbiddenContentFormatter (validation : UnidocValidation, event : UnidocEvent) : void {
      validation.clear()
      validation.asError()
      validation.code = StandardErrorCode.FORBIDDEN_CONTENT
      validation.data.set('allowedTags', context.allowedTags)
      validation.data.set('allowWords', context.allowWords)
      validation.data.set('allowWhitespaces', context.allowWhitespaces)
      validation.path.copy(event.path)
      validation.path.pushSymbol(event.from)

      switch (event.type) {
        case UnidocEventType.START_TAG:
          validation.data.set('type', 'tag')
          validation.data.set('tag', event.tag)
          validation.data.set('word', undefined)
          validation.data.set('whitespace', undefined)
          break
        case UnidocEventType.WORD:
          validation.data.set('type', 'word')
          validation.data.set('tag', undefined)
          validation.data.set('word', event.text)
          validation.data.set('whitespace', undefined)
          break
        case UnidocEventType.WHITESPACE:
          validation.data.set('type', 'whitespace')
          validation.data.set('tag', undefined)
          validation.data.set('word', undefined)
          validation.data.set('whitespace', event.debugText)
          break
        default:
          throw Error('Invalid event as source of a standard forbidden content error.')
      }
    }
  }
}
