import { Observable } from 'rxjs'
import { Subscriber } from 'rxjs'
import { Subscription } from 'rxjs'

import { UnidocEvent } from './event/UnidocEvent'
import { UnidocValidation } from './validation/UnidocValidation'
import { UnidocValidator } from './validator/UnidocValidator'
import { UnidocValidationProcess } from './validator/UnidocValidationProcess'

class Validator {
  /**
  * The validator to use.
  */
  private _validator : UnidocValidator

  /**
  * The source of event of this validator.
  */
  private _input : Observable<UnidocEvent> | null

  /**
  * The subscription to the source of event of this validator.
  */
  private _subscription : Subscription | null

  /**
  * The subscription to the source of validation of this validator.
  */
  private _outputs : Set<Subscriber<UnidocValidation>>

  /**
  * Instantiate a new tokenizer.
  *
  * @param lexer - The lexer to use for tokenization.
  */
  public constructor (validator : UnidocValidator) {
    this._validator           = validator
    this._input               = null
    this._subscription        = null
    this._outputs             = new Set<Subscriber<UnidocValidation>>()

    this.consumeNextEvent     = this.consumeNextEvent.bind(this)
    this.consumeNextError     = this.consumeNextError.bind(this)
    this.consumeCompletion    = this.consumeCompletion.bind(this)

    this.handleNextValidation = this.handleNextValidation.bind(this)
    this.handleCompletion     = this.handleCompletion.bind(this)

    this._validator.addEventListener('validation', this.handleNextValidation)
    this._validator.addEventListener('completion', this.handleCompletion)
  }

  /**
  * Stream validation to the given output.
  *
  * @param output - An output to fill with validation.
  */
  public stream (output : Subscriber<UnidocValidation>) : void {
    this._outputs.add(output)
  }

  /**
  * Stop streaming validation to the given output.
  *
  * @param output - An output to stop to fill with validation.
  */
  public unstream (output : Subscriber<UnidocValidation>) : void {
    this._outputs.delete(output)
  }

  /**
  * Subscribe to the given source of event.
  *
  * @param input - A source of event.
  */
  public subscribe (input : Observable<UnidocEvent>) : void {
    if (this._input !== input) {
      if (this._subscription) {
        this._subscription.unsubscribe()
      }

      this._input = input

      if (input) {
        this._subscription = input.subscribe(
          this.consumeNextEvent,
          this.consumeNextError,
          this.consumeCompletion
        )
      } else {
        this._subscription = null
      }
    }
  }

  /**
  * Handle the emission of the given validation.
  *
  * @param validation - The validation to consume.
  */
  public handleNextValidation (validation : UnidocValidation) : void {
    for (const output of this._outputs) {
      output.next(validation)
    }
  }

  /**
  * Handle a validation completion event.
  */
  public handleCompletion () : void {
    for (const output of this._outputs) {
      output.complete()
    }
  }

  /**
  * Consume the next available event.
  *
  * @param event - The event to consume.
  */
  public consumeNextEvent (event : UnidocEvent) : void {
    this._validator.next(event)
  }

  /**
  * Consume the next error.
  *
  * @param error - An error to consume.
  */
  public consumeNextError (error : Error) : void {
    console.log(error)
  }

  /**
  * Consume a completion signal.
  */
  public consumeCompletion () : void {
    this._validator.complete()
  }
}

type Operator<In, Out> = (source : Observable<In>) => Observable<Out>

/**
* Transform a stream of events to a stream of validation.
*
* @return An operator that transform a stream of events to a stream of validation.
*/
export function validate (process : UnidocValidationProcess) : Operator<UnidocEvent, UnidocValidation> {
  const validator : UnidocValidator = new UnidocValidator()
  validator.start(process)

  const result : Validator = new Validator(validator)

  return function (input : Observable<UnidocEvent>) : Observable<UnidocValidation> {
    return new Observable<UnidocValidation>(
      function (subscriber : Subscriber<UnidocValidation>) {
        result.stream(subscriber)
        result.subscribe(input)
      }
    )
  }
}
