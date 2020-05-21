import { CircularBuffer } from '@cedric-demongivert/gl-tool-collection'
import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocQuery } from '../query/UnidocQuery'
import { nothing } from '../query/nothing'
import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocValidation } from '../validation/UnidocValidation'

import { ValidationFormatter } from './ValidationFormatter'
import { RuleBuilder } from './RuleBuilder'

export class Rule<Context> implements UnidocQuery<UnidocEvent, UnidocValidation>
{
  /**
  * A listener called when a value is published by this query.
  */
  public resultListener : UnidocQuery.ResultListener<UnidocValidation>

  /**
  * A listener called when the output stream of this query reach it's end.
  */
  public completionListener : UnidocQuery.CompletionListener

  /**
  * A query that return false when an event must be skipped and true if the
  * given event must trigger a validation message.
  */
  public readonly rule : UnidocQuery<UnidocEvent, boolean>

  /**
  * A query that compute a context associated to each event received.
  */
  public readonly context : UnidocQuery<UnidocEvent, Context>

  /**
  * A formatter that initialize each validation.
  */
  public readonly formatter : ValidationFormatter<Context>

  /**
  * A validation object to format.
  */
  private readonly validation : UnidocValidation

  /**
  * A query that return tuples of rule / context.
  */
  private readonly each : UnidocQuery<UnidocEvent, Pack<any>>

  private readonly buffer : CircularBuffer<UnidocEvent>

  public constructor (rule : UnidocQuery<UnidocEvent, boolean>, context : UnidocQuery<UnidocEvent, Context>, formatter : ValidationFormatter<Context>) {
    this.handleValidation           = this.handleValidation.bind(this)
    this.handleValidationCompletion = this.handleValidationCompletion.bind(this)

    this.rule = rule
    this.context = context
    this.formatter = formatter
    this.each = UnidocQuery.each<UnidocEvent, any>(this.rule, this.context)

    this.each.resultListener = this.handleValidation
    this.each.completionListener = this.handleValidationCompletion

    this.resultListener = nothing
    this.completionListener = nothing

    this.buffer = CircularBuffer.fromPack(Pack.instance(UnidocEvent.ALLOCATOR, 8))

    this.validation = new UnidocValidation()
  }

  /**
  * @see UnidocQuery.start
  */
  public start () : void {
    this.each.start()
  }

  /**
  * @see UnidocQuery.next
  */
  public next (value : UnidocEvent) : void {
    this.buffer.push(value)
    this.each.next(value)
  }

  /**
  * @see UnidocQuery.complete
  */
  public complete () : void {
    this.each.complete()
  }

  private handleValidation (value : Pack<any>) : void {
    const rule : boolean = value.get(0)
    const context : Context = value.get(1)

    if (rule) {
      this.resultListener(
        this.formatter(
          this.buffer.shift(),
          this.validation,
          context
        )
      )
    }
  }

  private handleValidationCompletion () : void {
    this.completionListener()
  }

  /**
  * @see UnidocQuery.reset
  */
  public reset () : void {
    this.each.reset()
    this.buffer.clear()

  }

  /**
  * @see UnidocQuery.clear
  */
  public clear () : void {
    this.each.clear()
    this.each.resultListener = this.handleValidation
    this.each.completionListener = this.handleValidationCompletion

    this.buffer.clear()

    this.resultListener = nothing
    this.completionListener = nothing
  }

  /**
  * @see UnidocQuery.clone
  */
  public clone () : Rule<Context> {
    const result : Rule<Context> = new Rule<Context>(this.rule.clone(), this.context.clone(), this.formatter)

    result.resultListener = this.resultListener
    result.completionListener = this.completionListener

    return result
  }

  /**
  * @see UnidocQuery.toString
  */
  public toString () : string {
    return 'rule (' + this.rule + ' with ' + this.context + ' emit ' + this.formatter + ')'
  }
}

export namespace Rule {
  export function builder <Context> () : RuleBuilder<Context> {
    return new RuleBuilder()
  }
}
