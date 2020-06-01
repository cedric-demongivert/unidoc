import { UnidocQuery } from '../UnidocQuery'
import { UnidocQueryState } from '../UnidocQueryState'
import { UnidocQueryRelationship } from '../UnidocQueryRelationship'
import { UnidocQueryRuleFactory } from '../UnidocQueryRuleFactory'
import * as rules from '../rule'

export class UnidocQueryBuilder {
  /**
  * State where this builder operate.
  */
  public readonly state : UnidocQueryState

  /**
  * Instantiate a new query builder located at a given state of a query.
  *
  * @param state - A unidoc query state where this builder must operate.
  */
  public constructor (state : UnidocQueryState) {
    this.state = state
  }

  /**
  * Instantiate a new relationship between the state handled by this builder and
  * the given one that can only be traversed if the given rule is truthy.
  *
  * @param rule - A rule that describe the relationship.
  * @param [output] - The relationship resulting state.
  *
  * @return A new builder instance located on the relationship resulting state.
  */
  public when (rule : UnidocQueryRuleFactory<any>, output? : UnidocQueryState) : UnidocQueryBuilder {
    const query : UnidocQuery = this.state.query

    if (output == null) {
      output = new UnidocQueryState(query)
    }

    const relationship : UnidocQueryRelationship = new UnidocQueryRelationship(query)

    relationship.from = this.state
    relationship.to = output
    relationship.rule = rule

    if (output === this.state) {
      return this
    } else {
      return new UnidocQueryBuilder(output)
    }
  }

  public until () : UnidocQueryBuilder {
    return this.when(rules.Forget.factory, this.state)
  }

  public anything (output? : UnidocQueryState) : UnidocQueryBuilder {
    return this.when(rules.Anything.factory, output)
  }

  public whitespace (output? : UnidocQueryState) : UnidocQueryBuilder {
    return this.when(rules.Whitespace.factory, output)
  }

  public word (output? : UnidocQueryState) : UnidocQueryBuilder {
    return this.when(rules.Word.factory, output)
  }

  public entering (tag? : string, output? : UnidocQueryState) : UnidocQueryBuilder {
    if (tag == null) {
      return this.when(rules.EnteringAnything.factory, output)
    } else {
      return this.when(rules.Entering.factory(tag), output)
    }
  }

  public exiting (tag? : string, output? : UnidocQueryState) : UnidocQueryBuilder {
    if (tag == null) {
      return this.when(rules.ExitingAnything.factory, output)
    } else {
      return this.when(rules.Exiting.factory(tag), output)
    }
  }
}
