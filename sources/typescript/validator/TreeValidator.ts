import { UnidocQuery } from '../query/UnidocQuery'
import { nothing } from '../query/nothing'
import { depth } from '../query/depth'
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
  public resultListener : UnidocQuery.ResultListener<UnidocValidation>

  /**
  * A listener called when the output stream of this query reach it's end.
  */
  public completionListener : UnidocQuery.CompletionListener

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

  private completed : number

  public constructor () {
    this.children = new RulesetValidator()
    this.deep = new RulesetValidator()
    this.types = new Map()
    this.depth = 0
    this.completed = 0

    this.handleValidation = this.handleValidation.bind(this)
    this.handleCompletion = this.handleCompletion.bind(this)

    this.children.resultListener = this.handleValidation
    this.children.completionListener = this.handleCompletion
    this.deep.resultListener = this.handleValidation
    this.deep.completionListener = this.handleCompletion

    this.resultListener = nothing
    this.completionListener = nothing
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
    this.completed = 0
  }

  /**
  * @see UnidocValidator#clear
  */
  public clear () : void {
    this.children.clear()
    this.deep.clear()
    this.types.clear()
    this.current = null
    this.depth = 0
    this.completed = 0
  }

  /**
  * @see UnidocValidator#start
  */
  public start () : void {
    this.children.start()
    this.deep.start()
    this.depth = 0
    this.completed = 0
  }

  /**
  * @see UnidocValidator#next
  */
  public next (event : UnidocEvent) : void {
    if (this.depth == 0) {
      this.children.next(event)

      if (event.type === UnidocEventType.START_TAG) {
        if (this.types.has(event.tag)) {
          this.current = this.types.get(event.tag)()
        } else {
          this.current = new AnythingValidator()
        }

        this.current.resultListener = this.handleValidation
        this.current.start()
      }
    }

    if (this.depth >= 0) {
      this.deep.next(event)
      this.current.next(event)
    }

    this.depth = depth(this.depth, event)

    if (event.type === UnidocEventType.END_TAG) {
      this.children.next(event)
      this.current.complete()
      this.current = null
    }
  }

  /**
  * @see UnidocValidator#complete
  */
  public complete () : void {
    this.children.complete()
    this.deep.complete()
  }

  private handleValidation (validation : UnidocValidation) : void {
    this.resultListener(validation)
  }

  private handleCompletion () : void {
    this.completed += 1

    if (this.completed === 2) {
      this.completionListener()
    }
  }

  /**
  * @see UnidocValidator#clone
  */
  public clone () : TreeValidator {
    const result : TreeValidator = new TreeValidator()

    result.children.copy(this.children)
    result.deep.copy(this.deep)
    result.children.resultListener = result.handleValidation
    result.children.completionListener = result.handleCompletion
    result.deep.resultListener = result.handleValidation
    result.deep.completionListener = result.handleCompletion

    result.types.clear()

    for (const key of this.types.keys()) {
      result.types.set(key, this.types.get(key))
    }

    result.depth = this.depth
    result.completed = this.completed
    result.current = this.current.clone()

    result.resultListener = this.resultListener
    result.completionListener = this.completionListener

    return result
  }
}

export namespace TreeValidator {
  export type ValidatorFactory<Validator extends UnidocValidator> = () => Validator
}
