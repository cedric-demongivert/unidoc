import { UnidocQueryState } from '../UnidocQueryState'
import { UnidocQueryRelationship } from '../UnidocQueryRelationship'
import { UnidocQueryRuleFactory } from '../UnidocQueryRuleFactory'
import * as rules from '../rule'

export class UnidocQueryDisjunctionBuilder {
  /**
  * State where this builder operate.
  */
  public readonly from : UnidocQueryState

  /**
  * State where this builder operate.
  */
  public readonly to : UnidocQueryState

  /**
  * Instantiate a new query disjunction builder between the two given states.
  *
  * @param from
  * @param to
  */
  public constructor (from : UnidocQueryState, to : UnidocQueryState) {
    this.from = from
    this.to = to
  }

  /**
  * Add a the given rule as a clause to the disjunction.
  *
  * @param rule - A rule to add as a clause of the disjunction.
  *
  * @return This builder instance for chaining purposes.
  */
  public rule (rule : UnidocQueryRuleFactory<any>) : UnidocQueryDisjunctionBuilder {
    const relationship : UnidocQueryRelationship = new UnidocQueryRelationship(this.from.query)

    relationship.from = this.from
    relationship.to = this.to
    relationship.rule = rule

    return this
  }

  public anything () : UnidocQueryDisjunctionBuilder {
    return this.rule(rules.Anything.factory)
  }

  public whitespace () : UnidocQueryDisjunctionBuilder {
    return this.rule(rules.Whitespace.factory)
  }

  public word () : UnidocQueryDisjunctionBuilder {
    return this.rule(rules.Word.factory)
  }

  public entering (tag? : string) : UnidocQueryDisjunctionBuilder {
    if (tag == null) {
      return this.rule(rules.EnteringAnything.factory)
    } else {
      return this.rule(rules.Entering.factory(tag))
    }
  }

  public exiting (tag? : string) : UnidocQueryDisjunctionBuilder {
    if (tag == null) {
      return this.rule(rules.ExitingAnything.factory)
    } else {
      return this.rule(rules.Exiting.factory(tag))
    }
  }
}

export namespace UnidocQueryDisjunctionBuilder {
  export type Configurator = (this : UnidocQueryDisjunctionBuilder) => void
}
