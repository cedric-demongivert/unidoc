import { UnidocQuery } from '../UnidocQuery'
import { UnidocQueryState } from '../UnidocQueryState'
import { UnidocQueryRelationship } from '../UnidocQueryRelationship'
import { UnidocQueryRuleFactory } from '../UnidocQueryRuleFactory'
import * as rules from '../rule'

export class UnidocQueryForkBuilder {
  /**
  * First state of the path.
  */
  public readonly origin : UnidocQueryState

  /**
  * Current state of the path, it's here that this builder operate.
  */
  private _current : UnidocQueryState

  /**
  * Instantiate a new query path builder that starts at the initial state of the
  * given query.
  *
  * @param query
  */
  public constructor (query : UnidocQuery)

  /**
  * Instantiate a new query path builder that starts at the given state.
  *
  * @param origin
  */
  public constructor (origin : UnidocQueryState)

  /**
  *
  */
  public constructor (parameter : UnidocQueryState | UnidocQuery) {
    if (parameter instanceof UnidocQuery) {
      this.origin = parameter.input
    } else {
      this.origin = parameter
    }

    this._current = this.origin
  }

  /**
  * @return The current state of the path, it's here that this builder operate.
  */
  public get current () : UnidocQueryState {
    return this._current
  }

  /**
  * Instantiate a new relationship between the current state in the path and the
  * given state. The relationship can be traversed only if the given rule is
  * valid at some point in the stream of event of a given document.
  *
  * Move the current state of this builder to the given output state.
  *
  * @param rule - A rule that describe the relationship.
  * @param [output] - The resulting state.
  *
  * @return This builder for chaining purposes.
  */
  public rule (rule : UnidocQueryRuleFactory<any>, output? : UnidocQueryState) : UnidocQueryForkBuilder {
    const query : UnidocQuery = this.origin.query

    if (output == null) {
      output = new UnidocQueryState(query)
    }

    const relationship : UnidocQueryRelationship = new UnidocQueryRelationship(query)

    relationship.from = this._current
    relationship.to = output
    relationship.rule = rule

    this._current = output

    return this
  }

  /**
  * Create a looping relationship on the current state that await that a valid
  * sequence of events begins.
  *
  * @return This builder for chaining purposes.
  */
  public until () : UnidocQueryForkBuilder {
    return this.rule(rules.Forget.factory, this.origin)
  }

  /**
  * Instantiate a new relationship between the current state in the path and the
  * given state that accept any kind of events. This kind of relationship can't
  * be traversed freely.
  *
  * Move the current state of this builder to the given output state.
  *
  * @param [output] - The resulting state.
  *
  * @return This builder for chaining purposes.
  */
  public anything (output? : UnidocQueryState) : UnidocQueryForkBuilder {
    return this.rule(rules.Anything.factory, output)
  }

  /**
  * Instantiate a new relationship between the current state in the path and the
  * given state that accept only whitespaces. This kind of relationship can't
  * be traversed freely.
  *
  * Move the current state of this builder to the given output state.
  *
  * @param [output] - The resulting state.
  *
  * @return This builder for chaining purposes.
  */
  public whitespace (output? : UnidocQueryState) : UnidocQueryForkBuilder {
    return this.rule(rules.Whitespace.factory, output)
  }

  /**
  * Instantiate a new relationship between the current state in the path and the
  * given state that accept only words. This kind of relationship can't be
  * traversed freely.
  *
  * Move the current state of this builder to the given output state.
  *
  * @param [output] - The resulting state.
  *
  * @return This builder for chaining purposes.
  */
  public word (output? : UnidocQueryState) : UnidocQueryForkBuilder {
    return this.rule(rules.Word.factory, output)
  }

  /**
  * Instantiate a new relationship between the current state in the path and the
  * given state that accept only the begining of a tag of the given type. This
  * kind of relationship can't be traversed freely.
  *
  * Move the current state of this builder to the given output state.
  *
  * @param tag - Expected tag type.
  * @param [output] - The resulting state.
  *
  * @return This builder for chaining purposes.
  */
  public entering (tag : string, output? : UnidocQueryState) : UnidocQueryForkBuilder {
    return this.rule(rules.Entering.factory(tag), output)
  }

  /**
  * Instantiate a new relationship between the current state in the path and the
  * given state that accept only the begining of any type of tag. This kind of
  * relationship can't be traversed freely.
  *
  * Move the current state of this builder to the given output state.
  *
  * @param [output] - The resulting state.
  *
  * @return This builder for chaining purposes.
  */
  public enteringAnyTag (output? : UnidocQueryState) : UnidocQueryForkBuilder {
    return this.rule(rules.EnteringAnything.factory, output)
  }

  /**
  * Instantiate a new relationship between the current state in the path and the
  * given state that accept only the termination of a tag of the given type.
  * This kind of relationship can't be traversed freely.
  *
  * Move the current state of this builder to the given output state.
  *
  * @param tag - Expected tag type.
  * @param [output] - The resulting state.
  *
  * @return This builder for chaining purposes.
  */
  public exiting (tag : string, output? : UnidocQueryState) : UnidocQueryForkBuilder {
    return this.rule(rules.Exiting.factory(tag), output)
  }

  /**
  * Instantiate a new relationship between the current state in the path and the
  * given state that accept only the termination of any type of tag. This kind
  * of relationship can't be traversed freely.
  *
  * Move the current state of this builder to the given output state.
  *
  * @param [output] - The resulting state.
  *
  * @return This builder for chaining purposes.
  */
  public exitingAnyTag (output? : UnidocQueryState) : UnidocQueryForkBuilder {
    return this.rule(rules.ExitingAnything.factory, output)
  }
}

export namespace UnidocQueryForkBuilder {
  export type Configurator = (this : UnidocQueryForkBuilder) => void
}
