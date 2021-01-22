import { UnidocEvent } from '../../event/UnidocEvent'

import { UnidocValidationEvent } from '../../validation/UnidocValidationEvent'
import { UnidocValidationEventBuilder } from '../../validation/UnidocValidationEventBuilder'
import { UnidocValidationMessage } from '../../validation/UnidocValidationMessage'
import { UnidocValidationMessageBuilder } from '../../validation/UnidocValidationMessageBuilder'

import * as common from './common'
import { UnidocKissValidatorOutput } from './UnidocKissValidatorOutput'
import { UnidocKissValidatorOutputBuilder } from './UnidocKissValidatorOutputBuilder'

/**
*
*/
export type UnidocKissValidator = Generator<UnidocKissValidatorOutput, UnidocKissValidatorOutput, UnidocEvent | undefined>

/**
*
*/
export namespace UnidocKissValidator {
  /**
  *
  */
  export type Result = IteratorResult<UnidocKissValidatorOutput, UnidocKissValidatorOutput>

  /**
  *
  */
  export type Factory = () => UnidocKissValidator

  /**
  *
  */
  export namespace output {
    /**
    *
    */
    export function current(): UnidocKissValidatorOutput {
      return UnidocKissValidatorOutput.CURRENT
    }

    /**
    *
    */
    export function next(): UnidocKissValidatorOutput {
      return UnidocKissValidatorOutput.NEXT
    }

    /**
    *
    */
    export function end(): UnidocKissValidatorOutput {
      return UnidocKissValidatorOutput.END
    }

    /**
    *
    */
    export function match(): UnidocKissValidatorOutput {
      return UnidocKissValidatorOutput.MATCH
    }

    /**
    *
    */
    export function emit(event: UnidocValidationEvent): UnidocKissValidatorOutput {
      return UnidocKissValidatorOutputBuilder.get().asEmit(event).get()
    }

    /**
    *
    */
    export function validation(event: UnidocEvent | undefined): UnidocKissValidatorOutput {
      if (event) {
        return (
          UnidocKissValidatorOutputBuilder.get().asEmit(
            UnidocValidationEventBuilder.get().asValidation(event).get()
          ).get()
        )
      } else {
        return (
          UnidocKissValidatorOutputBuilder.get().asEmit(
            UnidocValidationEventBuilder.get().asDocumentCompletion().get()
          ).get()
        )
      }
    }

    /**
    *
    */
    export function message(message: UnidocValidationMessage): UnidocKissValidatorOutput {
      return (
        UnidocKissValidatorOutputBuilder.get().asEmit(
          UnidocValidationEventBuilder.get().asMessage(message).get()
        ).get()
      )
    }

    /**
    *
    */
    export function builder(): UnidocKissValidatorOutputBuilder {
      return UnidocKissValidatorOutputBuilder.get()
    }

    /**
    *
    */
    export namespace message {
      /**
      *
      */
      export function builder(): UnidocValidationMessageBuilder {
        return UnidocValidationMessageBuilder.get()
      }
    }
  }

  /**
  *
  */
  export function* match(validator: UnidocKissValidator): Generator<UnidocKissValidatorOutput, boolean, UnidocEvent | undefined> {
    const result: UnidocKissValidatorOutput | undefined = yield* validator

    if (result == null) {
      throw new Error('Illegal behavior, a KISS validator returned nothing at the end of it\'s execution.')
    } else if (result.isEnd()) {
      return false
    } else if (result.isMatch()) {
      return true
    } else {
      throw new Error('Illegal behavior, a KISS validator returned a result that was neither end nor match at the end of it\'s execution.')
    }
  }

  /**
  *
  */
  export const validateEnd = common.validateEnd

  /**
  *
  */
  export const validateEndOfAnyTag = common.validateEndOfAnyTag

  /**
  *
  */
  export const validateEndOfTag = common.validateEndOfTag

  /**
  *
  */
  export const validateEpsilon = common.validateEpsilon

  /**
  *
  */
  export const validateManyWhitespace = common.validateManyWhitespace

  /**
  *
  */
  export const validateManyWord = common.validateManyWord

  /**
  *
  */
  export const validateSequence = common.validateSequence

  /**
  *
  */
  export const validateStartOfAnyTag = common.validateStartOfAnyTag

  /**
  *
  */
  export const validateStartOfTag = common.validateStartOfTag

  /**
  *
  */
  export const validateWhitespace = common.validateWhitespace

  /**
  *
  */
  export const validateWord = common.validateWord

  /**
  *
  */
  export function* feed(validator: UnidocKissValidator, input: UnidocEvent): UnidocKissValidator {
    let result: Result = validator.next(input)

    while (!result.done && (result.value.isCurrent() || result.value.isEmit())) {
      yield result.value
      result = validator.next(input)
    }

    return result.value
  }
}
