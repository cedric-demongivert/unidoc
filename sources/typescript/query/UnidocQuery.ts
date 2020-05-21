import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../event/UnidocEvent'

import { MappingQuery } from './MappingQuery'
import { ReducingQuery } from './ReducingQuery'
import { MergedQuery } from './MergedQuery'
import { IndexQuery } from './IndexQuery'
import { ChainedQuery } from './ChainedQuery'
import { EachQuery } from './EachQuery'
import { SelectionQuery } from './SelectionQuery'

import { empty as emptyMapper } from './empty'
import { clone as cloneMapper } from './clone'
import { identity as identityMapper } from './identity'
import { conjunction as conjunctionMapper } from './conjunction'
import { disjunction as disjunctionMapper } from './disjunction'
import { negate as negationMapper } from './negate'
import { count as countReducer} from './count'
import { depth as depthReducer } from './depth'
import { isTag as isTagMapper} from './isTag'
import { isTagOfType as isTagOfTypeFactory } from './isTagOfType'
import { isTagWithClass as isTagWithClassFactory } from './isTagWithClass'
import { isTagWithIdentifier as isTagWithIdentifierFactory} from './isTagWithIdentifier'
import { isWhitespace as isWhitespaceMapper} from './isWhitespace'
import { isWord as isWordMapper } from './isWord'
import { wasFalsy as wasFalsyReducer } from './wasFalsy'
import { wasTruthy as wasTruthyReducer } from './wasTruthy'
import { truthy as truthyMapper} from './truthy'
import { falsy as falsyMapper } from './falsy'

/**
* A query over a stream of values that produce another stream of values.
*/
export interface UnidocQuery<Input, Output> {
  /**
  * A listener called when a value is published by this query.
  */
  resultListener : UnidocQuery.ResultListener<Output>

  /**
  * A listener called when the output stream of this query reach it's end.
  */
  completionListener : UnidocQuery.CompletionListener

  /**
  * Called at the begining of the parent stream.
  */
  start () : void

  /**
  * Handle the next available value of the parent stream.
  *
  * @param event - The next available event.
  */
  next (event : Input) : void

  /**
  * Called when the parent stream reach it's end.
  */
  complete () : void

  /**
  * Reset this query inner state in order to reuse it on another stream.
  */
  reset () : void

  /**
  * Reset this instance to its initial state in order to reuse it.
  */
  clear () : void

  /**
  * @return A deep copy of this query, including its current inner state.
  */
  clone () : UnidocQuery<Input, Output>

  /**
  * @see Object.toString
  */
  toString () : string
}

export namespace UnidocQuery {
  export type ResultListener<Output> = (next : Output) => void
  export type CompletionListener = () => void

  export function clone <Input, Output> (query : UnidocQuery<Input, Output>) : UnidocQuery<Input, Output> {
    return query == null ? query : query.clone()
  }

  export function all <Input, Output> (...queries : UnidocQuery<Input, Output>[]) : UnidocQuery<Input, Output> {
    return new MergedQuery(queries)
  }

  export function each <Input, Output> (...queries : UnidocQuery<Input, Output>[]) : UnidocQuery<Input, Pack<Output>> {
    return new EachQuery(queries)
  }

  export function select (selector : UnidocQuery<UnidocEvent, boolean>) : UnidocQuery<UnidocEvent, UnidocEvent> {
    return new SelectionQuery(selector)
  }

  export function identity <Input> () :  UnidocQuery<Input, Input> {
    return new MappingQuery(identityMapper)
  }

  export function copy <Input extends cloneMapper.Clonable<Input>> () :  UnidocQuery<Input, Input> {
    return new MappingQuery(cloneMapper)
  }

  export function empty <Input, Output> () :  UnidocQuery<Input, Output> {
    return new MappingQuery(emptyMapper)
  }

  export function and () :  UnidocQuery<Iterable<boolean>, boolean>
  export function and <Input> (...queries : UnidocQuery<Input, boolean>[]) : UnidocQuery<Input, boolean>
  export function and <Input> (...queries : UnidocQuery<Input, boolean>[]) : UnidocQuery<Input, boolean> | UnidocQuery<Iterable<boolean>, boolean> {
    if (queries.length === 0) {
      return new MappingQuery(conjunctionMapper)
    } else {
      return then(each(...queries), new MappingQuery(conjunctionMapper))
    }
  }

  export function or () :  UnidocQuery<Iterable<boolean>, boolean>
  export function or <Input> (...queries : UnidocQuery<Input, boolean>[]) : UnidocQuery<Input, boolean>
  export function or <Input> (...queries : UnidocQuery<Input, boolean>[]) : UnidocQuery<Input, boolean> | UnidocQuery<Iterable<boolean>, boolean> {
    if (queries.length === 0) {
      return new MappingQuery(disjunctionMapper)
    } else {
      return then(each(...queries), new MappingQuery(disjunctionMapper))
    }
  }

  export function not () : UnidocQuery<boolean, boolean>
  export function not <Input> (query : UnidocQuery<Input, boolean>) : UnidocQuery<Input, boolean>
  export function not <Input> (query? : UnidocQuery<Input, boolean>) : UnidocQuery<Input, boolean> | UnidocQuery<boolean, boolean> {
    if (query) {
      return then(query, new MappingQuery(negationMapper))
    } else {
      return new MappingQuery(negationMapper)
    }
  }

  export function count () : UnidocQuery<UnidocEvent, number>
  export function count <Input> (query : UnidocQuery<Input, UnidocEvent>) : UnidocQuery<Input, number>
  export function count <Input> (query? : UnidocQuery<Input, UnidocEvent>) : UnidocQuery<Input, number> | UnidocQuery<UnidocEvent, number> {
    if (query) {
      return then(query, new ReducingQuery(countReducer, 0))
    } else {
      return new ReducingQuery(countReducer, 0)
    }
  }

  export function depth () : UnidocQuery<UnidocEvent, number>
  export function depth <Input> (query : UnidocQuery<Input, UnidocEvent>) : UnidocQuery<Input, number>
  export function depth <Input> (query? : UnidocQuery<Input, UnidocEvent>) : UnidocQuery<Input, number> | UnidocQuery<UnidocEvent, number> {
    if (query) {
      return then(query, new ReducingQuery(depthReducer, 0))
    } else {
      return new ReducingQuery(depthReducer, 0)
    }
  }

  export function index () : UnidocQuery<UnidocEvent, number>
  export function index <Input> (query : UnidocQuery<Input, UnidocEvent>) : UnidocQuery<Input, number>
  export function index <Input> (query? : UnidocQuery<Input, UnidocEvent>) : UnidocQuery<Input, number> | UnidocQuery<UnidocEvent, number> {
    if (query) {
      return then(query, new IndexQuery())
    } else {
      return new IndexQuery()
    }
  }

  export function isTag () : UnidocQuery<UnidocEvent, boolean>
  export function isTag <Input> (query : UnidocQuery<Input, UnidocEvent>) : UnidocQuery<Input, boolean>
  export function isTag <Input> (query? : UnidocQuery<Input, UnidocEvent>) : UnidocQuery<Input, boolean> | UnidocQuery<UnidocEvent, boolean> {
    if (query) {
      return then(query, new MappingQuery(isTagMapper))
    } else {
      return new MappingQuery(isTagMapper)
    }
  }

  export function isWhitespace () : UnidocQuery<UnidocEvent, boolean>
  export function isWhitespace <Input> (query : UnidocQuery<Input, UnidocEvent>) : UnidocQuery<Input, boolean>
  export function isWhitespace <Input> (query? : UnidocQuery<Input, UnidocEvent>) : UnidocQuery<Input, boolean> | UnidocQuery<UnidocEvent, boolean> {
    if (query) {
      return then(query, new MappingQuery(isWhitespaceMapper))
    } else {
      return new MappingQuery(isWhitespaceMapper)
    }
  }

  export function isWord () : UnidocQuery<UnidocEvent, boolean>
  export function isWord <Input> (query : UnidocQuery<Input, UnidocEvent>) : UnidocQuery<Input, boolean>
  export function isWord <Input> (query? : UnidocQuery<Input, UnidocEvent>) : UnidocQuery<Input, boolean> | UnidocQuery<UnidocEvent, boolean> {
    if (query) {
      return then(query, new MappingQuery(isWordMapper))
    } else {
      return new MappingQuery(isWordMapper)
    }
  }

  export function isTagOfType (...types : string[]) : MappingQuery<UnidocEvent, boolean> {
    return new MappingQuery(isTagOfTypeFactory(types))
  }

  export function isTagWithClass (...classes : string[]) : MappingQuery<UnidocEvent, boolean> {
    return new MappingQuery(isTagWithClassFactory(classes))
  }

  export function isTagWithIdentifier (...identifiers : string[]) : MappingQuery<UnidocEvent, boolean> {
    return new MappingQuery(isTagWithIdentifierFactory(identifiers))
  }

  export function falsy <Input> () : UnidocQuery<Input, boolean>
  export function falsy <Input> (query : UnidocQuery<Input, boolean>) : UnidocQuery<Input, boolean>
  export function falsy <Input> (query? : UnidocQuery<Input, boolean>) : UnidocQuery<Input, boolean> | UnidocQuery<Input, boolean> {
    if (query) {
      return then(query, new MappingQuery(falsyMapper))
    } else {
      return new MappingQuery(falsyMapper)
    }
  }

  export function truthy <Input> () : UnidocQuery<Input, boolean>
  export function truthy <Input> (query : UnidocQuery<Input, boolean>) : UnidocQuery<Input, boolean>
  export function truthy <Input> (query? : UnidocQuery<Input, boolean>) : UnidocQuery<Input, boolean> | UnidocQuery<Input, boolean> {
    if (query) {
      return then(query, new MappingQuery(truthyMapper))
    } else {
      return new MappingQuery(truthyMapper)
    }
  }

  export function wasFalsy <Input> () : UnidocQuery<boolean, boolean>
  export function wasFalsy <Input> (query : UnidocQuery<Input, boolean>) : UnidocQuery<Input, boolean>
  export function wasFalsy <Input> (query? : UnidocQuery<Input, boolean>) : UnidocQuery<Input, boolean> | UnidocQuery<boolean, boolean> {
    if (query) {
      return then(query, new ReducingQuery(wasFalsyReducer, false))
    } else {
      return new ReducingQuery(wasFalsyReducer, false)
    }
  }

  export function wasTruthy <Input> () : UnidocQuery<boolean, boolean>
  export function wasTruthy <Input> (query : UnidocQuery<Input, boolean>) : UnidocQuery<Input, boolean>
  export function wasTruthy <Input> (query? : UnidocQuery<Input, boolean>) : UnidocQuery<Input, boolean> | UnidocQuery<boolean, boolean> {
    if (query) {
      return then(query, new ReducingQuery(wasTruthyReducer, false))
    } else {
      return new ReducingQuery(wasTruthyReducer, false)
    }
  }

  export function then <Input, Join, Output> (left : UnidocQuery<Input, Join>, right : UnidocQuery<Join, Output>) : UnidocQuery<Input, Output> {
    return new ChainedQuery(left, right)
  }
}
