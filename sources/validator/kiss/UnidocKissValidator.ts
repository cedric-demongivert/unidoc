import { UnidocEvent } from '../../event/UnidocEvent'

import { UnidocBlueprint } from '../../blueprint/UnidocBlueprint'

import { UnidocValidationEvent } from '../../validation/UnidocValidationEvent'
import { UnidocValidationEventBuilder } from '../../validation/UnidocValidationEventBuilder'
import { UnidocValidationMessage } from '../../validation/UnidocValidationMessage'
import { UnidocValidationMessageBuilder } from '../../validation/UnidocValidationMessageBuilder'

import { ExpectedContent } from '../message/ExpectedContent'
import { PreferredContent } from '../message/PreferredContent'
import { TooManyContent } from '../message/TooManyContent'

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

      /**
      *
      */
      export function expectedContent(blueprint: UnidocBlueprint): UnidocKissValidatorOutput {
        return message(
          builder()
            .setType(ExpectedContent.TYPE)
            .setCode(ExpectedContent.CODE)
            .setData(ExpectedContent.Data.BLUEPRINT, blueprint)
            .get()
        )
      }

      /**
      *
      */
      export function preferredContent(blueprint: UnidocBlueprint): UnidocKissValidatorOutput {
        return message(
          builder()
            .setType(PreferredContent.TYPE)
            .setCode(PreferredContent.CODE)
            .setData(PreferredContent.Data.BLUEPRINT, blueprint)
            .get()
        )
      }

      /**
      *
      */
      export function tooManyContent(blueprint: UnidocBlueprint): UnidocKissValidatorOutput {
        return message(
          builder()
            .setType(TooManyContent.TYPE)
            .setCode(TooManyContent.CODE)
            .setData(TooManyContent.Data.BLUEPRINT, blueprint)
            .get()
        )
      }

      /**
      *
      */
      export namespace tooManyContent {
        /**
        *
        */
        export function strict(blueprint: UnidocBlueprint): UnidocKissValidatorOutput {
          return message(
            builder()
              .setType(TooManyContent.Strict.TYPE)
              .setCode(TooManyContent.Strict.CODE)
              .setData(TooManyContent.Strict.Data.BLUEPRINT, blueprint)
              .get()
          )
        }
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
  export const captureValidatedText: typeof common.captureValidatedText = common.captureValidatedText

  /**
  *
  */
  export const requireText: typeof common.requireText = common.requireText

  /**
  *
  */
  export const requireToken: typeof common.requireToken = common.requireToken

  /**
  *
  */
  export const validateContentThatMatch: typeof common.validateContentThatMatch = common.validateContentThatMatch

  /**
  *
  */
  export const validateEnd: typeof common.validateEnd = common.validateEnd

  /**
  *
  */
  export const validateEndOfAnyTag: typeof common.validateEndOfAnyTag = common.validateEndOfAnyTag

  /**
  *
  */
  export const validateEndOfTag: typeof common.validateEndOfTag = common.validateEndOfTag

  /**
  *
  */
  export const validateEpsilon: typeof common.validateEpsilon = common.validateEpsilon

  /**
  *
  */
  export const validateManyWhitespace: typeof common.validateManyWhitespace = common.validateManyWhitespace

  /**
  *
  */
  export const validateManyWord: typeof common.validateManyWord = common.validateManyWord

  /**
  *
  */
  export const validateSequence: typeof common.validateSequence = common.validateSequence

  /**
  *
  */
  export const validateStartOfAnyTag: typeof common.validateStartOfAnyTag = common.validateStartOfAnyTag

  /**
  *
  */
  export const validateStartOfTag: typeof common.validateStartOfTag = common.validateStartOfTag

  /**
  *
  */
  export const validateText: typeof common.requireText = common.requireText

  /**
  *
  */
  export const validateToken: typeof common.requireToken = common.requireToken

  /**
  *
  */
  export const validateWhitespace: typeof common.validateWhitespace = common.validateWhitespace

  /**
  *
  */
  export const validateWord: typeof common.validateWord = common.validateWord

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
