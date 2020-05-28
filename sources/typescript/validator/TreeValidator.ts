import { Sink } from '../query/Sink'
import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'
import { UnidocValidation } from '../Validation/UnidocValidation'

import { UnidocValidator } from './UnidocValidator'
import { RulesetValidator } from './RulesetValidator'
import { AnythingValidator } from './AnythingValidator'

export class TreeValidator implements UnidocValidator {
  /**
  * A listener called when a value is published by this query.
  */
  public output : Sink<UnidocValidation>

  /**
  * Rules that apply only on the substream of events related to immediate children of the current node.
  */
  public readonly children : RulesetValidator

  /**
  * Rules that apply only on the all elements that is a children of the current node.
  */
  public readonly deep : RulesetValidator

  /**
  * Allowed types.
  */
  private readonly types : Map<string, TreeValidator.ValidatorFactory<any>>

  /**
  * Rules that apply only on the all elements that is a children of the current node.
  */
  private current : UnidocValidator

  private depth : number

  private running : number

  private subValidationHandler : Sink<UnidocValidation>

  public constructor () {
    this.children = new RulesetValidator()
    this.deep = new RulesetValidator()
    this.types = new Map()
    this.depth = 0
    this.running = 0

    this.subValidationHandler = {
      start: this.handleSubValidationStart.bind(this),
      next: this.handleSubValidation.bind(this),
      error: this.handleSubValidationError.bind(this),
      complete: this.handleSubValidationCompletion.bind(this)
    }

    this.children.output = this.subValidationHandler
    this.deep.output = this.subValidationHandler

    this.output = Sink.NONE
  }

  public setTypeValidator (type : string, validator : TreeValidator.ValidatorFactory<any>) : void {
    this.types.set(type, validator)
  }

  /**
  * @see UnidocValidator#reset
  */
  public reset () : void {
    this.children.reset()
    this.deep.reset()
    this.current = null
    this.depth = 0
    this.running = 0
  }

  /**
  * @see UnidocValidator#clear
  */
  public clear () : void {
    this.children.clear()
    this.deep.clear()

    this.children.output = this.subValidationHandler
    this.deep.output = this.subValidationHandler

    this.types.clear()
    this.current = null
    this.depth = 0
    this.running = 0
    this.output = Sink.NONE
  }

  /**
  * @see UnidocValidator#start
  */
  public start () : void {
    this.children.start()
    this.deep.start()
    this.depth = 0
    this.running = 0
    this.output.start()
  }

  private currentDepth (event : UnidocEvent) : number {
    switch (event.type) {
      case UnidocEventType.END_TAG:
        return this.depth - 1
      default:
        return this.depth
    }
  }

  private updateDepth (event : UnidocEvent) : void {
    switch (event.type) {
      case UnidocEventType.START_TAG:
        this.depth += 1
        break
      case UnidocEventType.END_TAG:
        this.depth -= 1
      default:
        break
    }
  }

  /**
  * @see UnidocValidator#next
  */
  public next (event : UnidocEvent) : void {
    const depth : number = this.currentDepth(event)

    if (depth == 0) {
      this.children.next(event)

      if (event.type === UnidocEventType.START_TAG) {
        if (this.types.has(event.tag)) {
          this.current = this.types.get(event.tag)()
        } else {
          this.current = new AnythingValidator()
        }

        this.current.output = this.subValidationHandler
        this.current.start()
      }
    }

    if (depth >= 0) {
      this.deep.next(event)
    }

    if (depth > 0) {
      this.current.next(event)
    }

    if (event.type === UnidocEventType.END_TAG && depth === 0) {
      this.children.next(event)
      this.current.complete()
      this.current = null
    }

    this.updateDepth(event)
  }

  /**
  * @see UnidocValidator#complete
  */
  public complete () : void {
    this.children.complete()
    this.deep.complete()

    if (this.current != null) {
      this.current.complete()
      this.current = null
    }
  }

  /**
  * @see UnidocValidator#error
  */
  public error (error : Error) : void {
    this.output.error(error)
  }

  private handleSubValidation (validation : UnidocValidation) : void {
    this.output.next(validation)
  }

  private handleSubValidationError (error : Error) : void {
    this.output.error(error)
  }

  private handleSubValidationCompletion () : void {
    this.running -= 1

    if (this.running === 0) {
      this.output.complete()
    }
  }

  private handleSubValidationStart () : void {
    this.running += 1
  }

  /**
  * @see UnidocValidator#clone
  */
  public clone () : TreeValidator {
    const result : TreeValidator = new TreeValidator()

    result.children.copy(this.children)
    result.deep.copy(this.deep)
    result.children.output = result.subValidationHandler
    result.deep.output = result.subValidationHandler

    result.types.clear()

    for (const key of this.types.keys()) {
      result.types.set(key, this.types.get(key))
    }

    result.depth = this.depth
    result.running = this.running
    result.current = this.current.clone()

    result.output = this.output

    return result
  }
}

export namespace TreeValidator {
  export type ValidatorFactory<Validator extends UnidocValidator> = () => Validator
}
