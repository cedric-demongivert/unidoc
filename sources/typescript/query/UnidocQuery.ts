import { UnidocEvent } from '../event/UnidocEvent'

import { ConjunctionQuery } from './ConjunctionQuery'
import { CountQuery } from './CountQuery'
import { DepthQuery } from './DepthQuery'
import { DisjunctionQuery } from './DisjunctionQuery'
import { FilteringQuery } from './FilteringQuery'
import { HeadQuery } from './HeadQuery'
import { IndexQuery } from './IndexQuery'
import { IsAnyTagQuery } from './IsAnyTagQuery'
import { IsHeadingElementQuery } from './IsHeadingElementQuery'
import { IsTagOfTypeQuery } from './IsTagOfTypeQuery'
import { IsTagWithClassQuery } from './IsTagWithClassQuery'
import { IsTagWithIdentifierQuery } from './IsTagWithIdentifierQuery'
import { IsWhitespaceQuery } from './IsWhitespaceQuery'
import { IsWordQuery } from './IsWordQuery'
import { NegationQuery } from './NegationQuery'
import { WasFalsyQuery } from './WasFalsyQuery'
import { WasTruthyQuery } from './WasTruthyQuery'
import { TruthyQuery } from './TruthyQuery'
import { FalsyQuery } from './FalsyQuery'
import { WhenQuery } from './WhenQuery'

/**
* A query over a stream of unidoc event that produce a stream of arbitrary
* values.
*/
export interface UnidocQuery<Output> {
  /**
  * Called at the begining of the parent event stream.
  */
  start () : void

  /**
  * Handle the next available event of the parent event stream.
  *
  * @param event - The next available event.
  */
  next (event : UnidocEvent) : void

  /**
  * Called when the parent event stream reach it's end.
  */
  complete () : void

  /**
  * Add a new callback to call for each emission of a given event type.
  *
  * @param type - Type of event to listen.
  * @param listener - Callback to add.
  */
  addEventListener (type : 'next', listener : UnidocQuery.NextListener<Output>) : void
  addEventListener (type : 'complete', listener : UnidocQuery.CompletionListener) : void

  /**
  * Remove an existing callback attached to the given event type.
  *
  * @param type - Type of event to listen.
  * @param listener - Callback to remove.
  */
  removeEventListener (type : 'next', listener : UnidocQuery.NextListener<Output>) : void
  removeEventListener (type : 'complete', listener : UnidocQuery.CompletionListener) : void

  /**
  * Remove all existing callback of the given event type.
  *
  * @param type - Type of event to stop to listen.
  */
  removeAllEventListener (type : 'next') : void
  removeAllEventListener (type : 'complete') : void
  removeAllEventListener (type : '*') : void

  /**
  * Reset this query inner state in order to reuse it on another stream.
  */
  reset () : void

  /**
  * @return A deep copy of this query, including its current inner state.
  */
  clone () : UnidocQuery<Output>

  /**
  * @see Object.toString
  */
  toString () : string
}

export namespace UnidocQuery {
  export type NextListener<Output> = (next : Output) => void
  export type CompletionListener = () => void

  export function clone <Output> (query : UnidocQuery<Output>) : UnidocQuery<Output> {
    return query == null ? query : query.clone()
  }

  export function and (...queries : UnidocQuery<boolean>[]) : ConjunctionQuery {
    return new ConjunctionQuery(queries)
  }

  export function or (...queries : UnidocQuery<boolean>[]) : DisjunctionQuery {
    return new DisjunctionQuery(queries)
  }

  export function not (query : UnidocQuery<boolean>) : NegationQuery {
    return new NegationQuery(query)
  }

  export function count (operand : UnidocQuery<boolean>) : CountQuery {
    return new CountQuery(operand)
  }

  export function depth () : DepthQuery {
    return new DepthQuery()
  }

  export function filter (query : UnidocQuery<boolean>) : FilteringQuery {
    return new FilteringQuery(query)
  }

  export function head <Output> (query : UnidocQuery<Output>, count : number) : HeadQuery<Output> {
    return new HeadQuery(query, count)
  }

  export function index () : IndexQuery {
    return new IndexQuery()
  }

  export function isAnyTag () : IsAnyTagQuery {
    return new IsAnyTagQuery()
  }

  export function isHeadingElement (count : number) : IsHeadingElementQuery {
    return new IsHeadingElementQuery(count)
  }

  export function isTagOfType (...types : string[]) : IsTagOfTypeQuery {
    return new IsTagOfTypeQuery(types)
  }

  export function isTagWithClass (...classes : string[]) : IsTagWithClassQuery {
    return new IsTagWithClassQuery(classes)
  }

  export function isTagWithIdentifier (...identifiers : string[]) : IsTagWithIdentifierQuery {
    return new IsTagWithIdentifierQuery(identifiers)
  }

  export function isWhitespace () : IsWhitespaceQuery {
    return new IsWhitespaceQuery()
  }

  export function isWord () : IsWordQuery {
    return new IsWordQuery()
  }

  export function isNothing () : FalsyQuery {
    return new FalsyQuery()
  }

  export function isAnything () : TruthyQuery {
    return new TruthyQuery()
  }

  export function wasFalsy (query : UnidocQuery<boolean>) : WasFalsyQuery {
    return new WasFalsyQuery(query)
  }

  export function wasTruthy (query : UnidocQuery<boolean>) : WasTruthyQuery {
    return new WasTruthyQuery(query)
  }

  export function when <Output> (query : UnidocQuery<Output>, filter : UnidocQuery<boolean>) : WhenQuery<Output> {
    return new WhenQuery(filter, query)
  }
}
