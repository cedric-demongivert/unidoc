import { SubscribableUnidocConsumer } from '../../consumer/SubscribableUnidocConsumer'
import { UnidocValidationEventProducer } from '../../validation/UnidocValidationEventProducer'

import { UnidocEvent } from '../../event/UnidocEvent'

import { UnidocValidator } from '../UnidocValidator'

import { UnidocKissValidator } from './UnidocKissValidator'
import { UnidocKissValidatorOutputType } from './UnidocKissValidatorOutputType'

export class UnidocKissValidatorResolver extends SubscribableUnidocConsumer<UnidocEvent> implements UnidocValidator {
  /**
  *
  */
  private validator: UnidocKissValidator | null

  /**
  *
  */
  private factory: UnidocKissValidator.Factory

  /**
  *
  */
  private readonly output: UnidocValidationEventProducer

  /**
  *
  */
  public constructor(factory: UnidocKissValidator.Factory) {
    super()
    this.validator = null
    this.factory = factory
    this.output = new UnidocValidationEventProducer()
  }

  /**
  * @see UnidocProducer.addEventListener
  */
  public addEventListener(event: any, listener: any) {
    this.output.addEventListener(event, listener)
  }

  /**
  * @see UnidocProducer.removeEventListener
  */
  public removeEventListener(event: any, listener: any) {
    this.output.removeEventListener(event, listener)
  }

  /**
  * @see UnidocProducer.removeAllEventListener
  */
  public removeAllEventListener(event?: any) {
    this.output.removeAllEventListener(event)
  }

  /**
  *
  */
  public handleInitialization(): void {
    const validator: UnidocKissValidator = this.factory()
    const output: UnidocValidationEventProducer = this.output

    output.initialize()
    this.validator = validator

    let next: UnidocKissValidator.Result = validator.next()

    while (!next.done) {
      switch (next.value.type) {
        case UnidocKissValidatorOutputType.CURRENT:
          return
        case UnidocKissValidatorOutputType.NEXT:
          return
        case UnidocKissValidatorOutputType.EMIT:
          if (next.value.event.message.isFailure()) {
            output.produce(next.value.event)
            next = validator.return(UnidocKissValidator.output.end())
          } else {
            output.produce(next.value.event)
            next = validator.next()
          }
          break
        case UnidocKissValidatorOutputType.END:
        case UnidocKissValidatorOutputType.MATCH:
          this.validator = null
          return
        default:
          throw new Error(
            'Unable to handle kiss validator output of type ' +
            UnidocKissValidatorOutputType.toDebugString(next.value.type) + ' ' +
            'because no procedure was defined for that.'
          )
      }
    }
  }

  /**
  *
  */
  public handleProduction(value: UnidocEvent): void {
    const validator: UnidocKissValidator | null = this.validator
    const output: UnidocValidationEventProducer = this.output

    if (validator) {
      let next: UnidocKissValidator.Result = validator.next(value)

      while (!next.done) {
        switch (next.value.type) {
          case UnidocKissValidatorOutputType.CURRENT:
            next = validator.next(value)
            break
          case UnidocKissValidatorOutputType.NEXT:
            return
          case UnidocKissValidatorOutputType.EMIT:
            if (next.value.event.message.isFailure()) {
              output.produce(next.value.event)
              next = validator.return(UnidocKissValidator.output.end())
            } else {
              output.produce(next.value.event)
              next = validator.next()
            }
            break
          case UnidocKissValidatorOutputType.END:
          case UnidocKissValidatorOutputType.MATCH:
            this.validator = null
            return
          default:
            throw new Error(
              'Unable to handle kiss validator output of type ' +
              UnidocKissValidatorOutputType.toDebugString(next.value.type) + ' ' +
              'because no procedure was defined for that.'
            )
        }
      }
    }
  }

  /**
  *
  */
  public handleCompletion(): void {
    const validator: UnidocKissValidator | null = this.validator
    const output: UnidocValidationEventProducer = this.output

    if (validator) {
      let next: UnidocKissValidator.Result = validator.next(undefined)

      while (!next.done) {
        switch (next.value.type) {
          case UnidocKissValidatorOutputType.CURRENT:
          case UnidocKissValidatorOutputType.NEXT:
            next = validator.next(undefined)
            break
          case UnidocKissValidatorOutputType.EMIT:
            if (next.value.event.message.isFailure()) {
              output.produce(next.value.event)
              next = validator.return(UnidocKissValidator.output.end())
            } else {
              output.produce(next.value.event)
              next = validator.next()
            }
            break
          case UnidocKissValidatorOutputType.END:
          case UnidocKissValidatorOutputType.MATCH:
            this.validator = null
            return
          default:
            throw new Error(
              'Unable to handle kiss validator output of type ' +
              UnidocKissValidatorOutputType.toDebugString(next.value.type) + ' ' +
              'because no procedure was defined for that.'
            )
        }
      }
    }

    output.complete()
  }

  /**
  *
  */
  public handleFailure(error: Error): void {
    this.output.fail(error)
  }
}
