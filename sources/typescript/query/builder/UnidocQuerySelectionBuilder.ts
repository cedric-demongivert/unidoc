import { UnidocQuery } from '../UnidocQuery'
import { UnidocQueryState } from '../UnidocQueryState'
import { UnidocQueryRelationship } from '../UnidocQueryRelationship'
import { UnidocQueryRuleFactory } from '../UnidocQueryRuleFactory'
import * as rules from '../rule'

import { UnidocQueryDisjunctionBuilder } from './UnidocQueryDisjunctionBuilder'
import { UnidocQuerySelection } from './UnidocQuerySelection'
import { UnidocQueryPathBuilder } from './UnidocQueryPathBuilder'

/**
* Build a unidoc query from a selection of existings states.
*/
export class UnidocQuerySelectionBuilder {
  /**
  * Selected states.
  */
  public readonly states : UnidocQuerySelection

  /**
  * Instantiate a new selection query builder that operate from the initial
  * state of the given query.
  *
  * @param query - A query to build.
  */
  public constructor (query : UnidocQuery)

  /**
  * Instantiate a new selection query builder that operate from all of the given
  * states.
  *
  * @param origin - A selection of states to handle.
  */
  public constructor (origin : UnidocQuerySelection)

  /**
  *
  */
  public constructor (parameter : UnidocQuerySelection | UnidocQuery) {
    if (parameter instanceof UnidocQuery) {
      this.states = UnidocQuerySelection.select(parameter.input)
    } else {
      this.states = parameter
    }
  }

  /**
  * Instantiate a new relationship between each of the selected states and
  * the given states. Each relationship can be traversed only if the given
  * rule is valid at some point in the stream of event of a given document.
  *
  * @param rule - A rule that describe the relationship.
  * @param outputs - The resulting states.
  *
  * @return A new builder instance located on the resulting states.
  */
  public rule (rule : UnidocQueryRuleFactory<any>, outputs : UnidocQuerySelection) : UnidocQuerySelectionBuilder

  /**
  * Instantiate a new relationship between each of the selected states and
  * the given one. Each relationship can be traversed only if the given
  * rule is valid at some point in the stream of event of a given document.
  *
  * @param rule - A rule that describe the relationship.
  * @param [output] - The resulting state.
  *
  * @return A new builder instance located on the resulting state.
  */
  public rule (rule : UnidocQueryRuleFactory<any>, output? : UnidocQueryState) : UnidocQueryPathBuilder

  /**
  *
  */
  public rule (rule : UnidocQueryRuleFactory<any>, output? : UnidocQueryState | UnidocQuerySelection) : UnidocQuerySelectionBuilder | UnidocQueryPathBuilder {
    const query : UnidocQuery = this.states.query

    if (output == null) {
      output = new UnidocQueryState(query)
    }

    if (output instanceof UnidocQuerySelection) {
      for (const from of this.states) {
        for (const to of output) {
          const relationship : UnidocQueryRelationship = new UnidocQueryRelationship(query)

          relationship.from = from
          relationship.to = to
          relationship.rule = rule
        }
      }

      return new UnidocQuerySelectionBuilder(output)
    } else {
      for (const from of this.states) {
        const relationship : UnidocQueryRelationship = new UnidocQueryRelationship(query)

        relationship.from = from
        relationship.to = output
        relationship.rule = rule
      }

      return new UnidocQueryPathBuilder(output)
    }
  }

  /**
  * Create a looping relationship on each selected states that discard incoming
  * events until a rule is valid.
  *
  * @return A new selection build on the resulting states.
  */
  public until () : UnidocQuerySelectionBuilder {
    return this.rule(rules.Forget.factory, this.states)
  }

  /**
  * Create a relationship that can be always traversed between all handled
  * states and the given one.
  *
  * @param [output] - The state in wich "merging" all handled state.
  */
  public merge (output? : UnidocQueryState) : UnidocQueryPathBuilder {
    const query : UnidocQuery = this.states.query

    if (output == null) {
      if (this.states.size === 1) {
        return new UnidocQueryPathBuilder(this.states.first)
      }

      output = new UnidocQueryState(query)
    }

    return this.rule(rules.Continue.factory, output)
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
