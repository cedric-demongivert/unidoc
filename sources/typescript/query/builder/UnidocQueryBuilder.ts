import { UnidocQuery } from '../UnidocQuery'
import { UnidocQueryState } from '../UnidocQueryState'
import { UnidocQueryRelationship } from '../UnidocQueryRelationship'
import { UnidocQueryRuleFactory } from '../UnidocQueryRuleFactory'
import * as rules from '../rule'

import { UnidocQueryDisjunctionBuilder } from './UnidocQueryDisjunctionBuilder'
import { UnidocQuerySelection } from './UnidocQuerySelection'

export class UnidocQueryBuilder {
  /**
  * State where this builder operate.
  */
  public readonly origin : UnidocQuerySelection

  /**
  * Instantiate a new query builder that handle the initial state of the given
  * query.
  *
  * @param query - A query to build.
  */
  public constructor (query : UnidocQuery)

  /**
  * Instantiate a new query builder that handle all of the given states.
  *
  * @param origin - A selection of states to handle.
  */
  public constructor (origin : UnidocQuerySelection)

  /**
  *
  */
  public constructor (parameter : UnidocQuerySelection | UnidocQuery) {
    if (parameter instanceof UnidocQuery) {
      this.origin = UnidocQuerySelection.select(parameter.input)
    } else {
      this.origin = parameter
    }
  }

  /**
  * Instantiate a new relationship between the states handled by this builder
  * and the given states. The relationship can be traversed only if the given
  * rule is valid.
  *
  * @param rule - A rule that describe the relationship.
  * @param [outputs] - The resulting states.
  *
  * @return A new builder instance located on the resulting states.
  */
  public rule (rule : UnidocQueryRuleFactory<any>, outputs? : UnidocQuerySelection) : UnidocQueryBuilder {
    const query : UnidocQuery = this.origin.query

    if (outputs == null) {
      outputs = UnidocQuerySelection.select(new UnidocQueryState(query))
    }

    for (const from of this.origin) {
      for (const to of outputs) {
        const relationship : UnidocQueryRelationship = new UnidocQueryRelationship(query)

        relationship.from = from
        relationship.to = to
        relationship.rule = rule
      }
    }

    if (outputs.equals(this.origin)) {
      return this
    } else {
      return new UnidocQueryBuilder(output)
    }
  }

  /**
  * Create a looping relationship on the handled states that discard incoming
  * events.
  */
  public until () : UnidocQueryBuilder {
    return this.rule(rules.Forget.factory, this.origin)
  }

  /**
  * Create a relationship that can be always traversed between all handled
  * states and the given one.
  *
  * @param [output] - The state in wich "merging" all handled state.
  */
  public merge (output? : UnidocQueryState) : UnidocQueryBuilder {
    const query : UnidocQuery = this.origin.query

    if (output == null) {
      output = new UnidocQueryState(query)
    }

    return this.rule(
      rules.Continue.factory,
      UnidocQuerySelection.select(output)
    )
  }

  public anything (output? : UnidocQuerySelection) : UnidocQueryBuilder {
    return this.rule(rules.Anything.factory, output)
  }

  public whitespace (output? : UnidocQuerySelection) : UnidocQueryBuilder {
    return this.rule(rules.Whitespace.factory, output)
  }

  public word (output? : UnidocQuerySelection) : UnidocQueryBuilder {
    return this.rule(rules.Word.factory, output)
  }

  public entering (tag? : string, output? : UnidocQuerySelection) : UnidocQueryBuilder {
    if (tag == null) {
      return this.rule(rules.EnteringAnything.factory, output)
    } else {
      return this.rule(rules.Entering.factory(tag), output)
    }
  }

  public exiting (tag? : string, output? : UnidocQuerySelection) : UnidocQueryBuilder {
    if (tag == null) {
      return this.rule(rules.ExitingAnything.factory, output)
    } else {
      return this.rule(rules.Exiting.factory(tag), output)
    }
  }

  public loop (configurator : UnidocQueryDisjunctionBuilder.Configurator) : UnidocQueryBuilder {
    return this.any(configurator, this.state)
  }

  public fork (configurator : UnidocQueryBuilder.Configurator) : void {
    configurator.apply(this)
  }

  public any (configurator : UnidocQueryDisjunctionBuilder.Configurator, output? : UnidocQueryState) : UnidocQueryBuilder {
    const query : UnidocQuery = this.state.query

    if (output == null) {
      output = new UnidocQueryState(query)
    }

    configurator.apply(new UnidocQueryDisjunctionBuilder(this.state, output))

    if (output === this.state) {
      return this
    } else {
      return new UnidocQueryBuilder(output)
    }
  }
}

export namespace UnidocQueryBuilder {
  export type Configurator = (this : UnidocQueryBuilder) => void
}
