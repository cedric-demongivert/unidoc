import { UnidocQuery } from '../query/UnidocQuery'
import { UnidocEvent } from '../event/UnidocEvent'

import { ValidationFormatter } from './ValidationFormatter'
import { Rule } from './Rule'

export class RuleBuilder<Context> {
  public rule : UnidocQuery<UnidocEvent, boolean>
  public formatter : ValidationFormatter<Context>
  public context : UnidocQuery<UnidocEvent, Context>

  public constructor () {
    this.rule = UnidocQuery.truthy()
    this.context = UnidocQuery.empty()
    this.formatter = ValidationFormatter.empty()
  }

  public mustHave (quantity : number) : any {
    const composition : Map<string, TagMetadata.Composition> = this.composition

    return {
      tag (type : string) : void {
        composition.get(type)[0] = quantity
        composition.get(type)[1] = quantity
      }
    }
  }

  public whenTruthy (rule : UnidocQuery<UnidocEvent, boolean>) : RuleBuilder<Context> {
    this.rule = rule
    return this
  }

  public whenFalsy (rule : UnidocQuery<UnidocEvent, boolean>) : RuleBuilder<Context> {
    this.rule = UnidocQuery.not(rule)
    return this
  }

  public thenEmit (formatter : ValidationFormatter<Context>) : RuleBuilder<Context> {
    this.formatter = formatter
    return this
  }

  public withContext <Context> (context : UnidocQuery<UnidocEvent, Context>) : RuleBuilder<Context> {
    const builder : RuleBuilder<Context> = new RuleBuilder<Context>()
    builder.rule = this.rule
    builder.context = context

    return builder
  }

  public build () : Rule<Context> {
    return new Rule(this.rule.clone(), this.context.clone(), this.formatter)
  }
}
