import { UnidocFunction } from '../../stream/UnidocFunction'
import { UnidocSink } from '../../stream/UnidocSink'

import { UnidocValidationEvent } from '../../validation/UnidocValidationEvent'

import { UnidocEvent } from '../../event/UnidocEvent'

import { UnidocValidator } from '../UnidocValidator'

import { UnidocKissValidator } from './UnidocKissValidator'
import { UnidocKissValidatorOutputType } from './UnidocKissValidatorOutputType'

export class UnidocKissValidatorResolver extends UnidocFunction<UnidocEvent, UnidocValidationEvent> implements UnidocValidator {
  /**
  *
  */
  private _validator: UnidocKissValidator | null

  /**
  *
  */
  private _factory: UnidocKissValidator.Factory

  /**
   * 
   */
  private _index: number

  /**
   * 
   */
  private _batch: number

  /**
  *
  */
  public constructor(factory: UnidocKissValidator.Factory) {
    super()
    this._validator = null
    this._factory = factory
    this._index = 0
    this._batch = 0
  }

  /**
  *
  */
  public start(): void {
    const validator: UnidocKissValidator = this._factory()
    const output: UnidocSink<UnidocValidationEvent> = this.output

    output.start()
    this._validator = validator

    let next: UnidocKissValidator.Result = validator.next()

    while (!next.done) {
      switch (next.value.type) {
        case UnidocKissValidatorOutputType.CURRENT:
          return
        case UnidocKissValidatorOutputType.NEXT:
          return
        case UnidocKissValidatorOutputType.EMIT:
          if (next.value.event.message.isFailure()) {
            this.emit(next.value.event)
            next = validator.return(UnidocKissValidator.output.end())
          } else {
            this.emit(next.value.event)
            next = validator.next()
          }
          break
        case UnidocKissValidatorOutputType.END:
        case UnidocKissValidatorOutputType.MATCH:
          this._validator = null
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
  public next(value: UnidocEvent): void {
    const validator: UnidocKissValidator | null = this._validator
    const output: UnidocSink<UnidocValidationEvent> = this.output

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
              this.emit(next.value.event)
              next = validator.return(UnidocKissValidator.output.end())
            } else {
              this.emit(next.value.event)
              next = validator.next()
            }
            break
          case UnidocKissValidatorOutputType.END:
          case UnidocKissValidatorOutputType.MATCH:
            this._validator = null
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
  public success(): void {
    const validator: UnidocKissValidator | null = this._validator
    const output: UnidocSink<UnidocValidationEvent> = this.output

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
              this.emit(next.value.event)
              next = validator.return(UnidocKissValidator.output.end())
            } else {
              this.emit(next.value.event)
              next = validator.next()
            }
            break
          case UnidocKissValidatorOutputType.END:
          case UnidocKissValidatorOutputType.MATCH:
            this._validator = null
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

    output.success()
  }

  /**
   * 
   */
  private emit(value: UnidocValidationEvent): void {
    if (value.isValidation() || value.isDocumentCompletion()) {
      this._batch += 1
    }

    value.setIndex(this._index)
    value.setBatch(this._batch)

    this.output.next(value)

    this._index += 1
  }

  /**
  *
  */
  public failure(error: Error): void {
    this.output.failure(error)
  }
}
