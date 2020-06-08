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
  * Add a new relationship to this disjunction. The relationship can be
  * traversed only if the given rule is valid at some point in the stream of
  * event of a given document.
  *
  * @param rule - A rule that describe the relationship.
  *
  * @return This builder for chaining purposes.
  */
  public rule (rule : UnidocQueryRuleFactory<any>) : UnidocQueryDisjunctionBuilder {
    const relationship : UnidocQueryRelationship = new UnidocQueryRelationship(this.from.query)

    relationship.from = this.from
    relationship.to = this.to
    relationship.rule = rule

    return this
  }

  /**
  * Add a new relationship to this disjunction that accept any kind of events.
  * This kind of relationship can't be traversed freely.
  *
  * @return This builder for chaining purposes.
  */
  public anything () : UnidocQueryDisjunctionBuilder {
    return this.rule(rules.Anything.factory)
  }

  /**
  * Add a new relationship to this disjunction that accept only whitespaces.
  * This kind of relationship can't be traversed freely.
  *
  * @return This builder for chaining purposes.
  */
  public whitespace () : UnidocQueryDisjunctionBuilder {
    return this.rule(rules.Whitespace.factory)
  }

  /**
  * Add a new relationship to this disjunction that accept only words.
  * This kind of relationship can't be traversed freely.
  *
  * @return This builder for chaining purposes.
  */
  public word () : UnidocQueryDisjunctionBuilder {
    return this.rule(rules.Word.factory)
  }

  /**
  * Add a new relationship to this disjunction that accept only the begining of
  * a tag of the given type. This kind of relationship can't be traversed
  * freely.
  *
  * @param tag - Expected tag type.
  *
  * @return This builder for chaining purposes.
  */
  public entering (tag : string) : UnidocQueryDisjunctionBuilder {
    return this.rule(rules.Entering.factory(tag))
  }

  /**
  * Add a new relationship to this disjunction that accept only the begining of
  * any type of tag. This kind of relationship can't be traversed freely.
  *
  * @return This builder for chaining purposes.
  */
  public enteringAnyTag () : UnidocQueryDisjunctionBuilder {
    return this.rule(rules.EnteringAnything.factory)
  }

  /**
  * Add a new relationship to this disjunction that accept only the termination
  * of a tag of the given type. This kind of relationship can't be traversed
  * freely.
  *
  * @param tag - Expected tag type.
  *
  * @return This builder for chaining purposes.
  */
  public exiting (tag : string) : UnidocQueryDisjunctionBuilder {
    return this.rule(rules.Exiting.factory(tag))
  }

  /**
  * Add a new relationship to this disjunction that accept only the termination
  * of any type of tag. This kind of relationship can't be traversed freely.
  *
  * @return This builder for chaining purposes.
  */
  public exitingAnyTag () : UnidocQueryDisjunctionBuilder {
    return this.rule(rules.ExitingAnything.factory)
  }
}

export namespace UnidocQueryDisjunctionBuilder {
  export type Configurator = (this : UnidocQueryDisjunctionBuilder) => void
}
