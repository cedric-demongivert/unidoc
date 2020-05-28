import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../event/UnidocEvent'

import { Sink } from './Sink'

import { UnidocMapper } from './UnidocMapper'
import { UnidocReducer } from './UnidocReducer'

import { MappingQuery } from './MappingQuery'
import { ReducingQuery } from './ReducingQuery'
import { MergedQuery } from './MergedQuery'
import { IndexQuery } from './IndexQuery'
import { ChildIndexQuery } from './ChildIndexQuery'
import { DepthQuery } from './DepthQuery'
import { ChainedQuery } from './ChainedQuery'
import { EachQuery } from './EachQuery'
import { SelectionQuery } from './SelectionQuery'

import { isCountableEvent } from './isCountableEvent'
import { empty as emptyMapper } from './empty'
import { clone as cloneMapper } from './clone'
import { identity as identityMapper } from './identity'
import { conjunction as conjunctionMapper } from './conjunction'
import { disjunction as disjunctionMapper } from './disjunction'
import { negate as negationMapper } from './negate'
import { count as countReducer} from './count'
import { isTag as isTagMapper} from './isTag'
import { isTagOfType as isTagOfTypeFactory } from './isTagOfType'
import { isTagStartOfType as isTagStartOfTypeFactory } from './isTagStartOfType'
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
export interface UnidocQuery<Input, Output> extends Sink<Input> {
  /**
  * A listener called when a value is published by this query.
  */
  output : Sink<Output>

  /**
  * @see Output.start
  */
  start () : void

  /**
  * @see Output.next
  */
  next (event : Input) : void

  /**
  * @see Output.error
  */
  error (error : Error) : void

  /**
  * @see Output.complete
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

  export function map <Input, Output> (mapper : UnidocMapper<Input, Output>) :  UnidocQuery<Input, Output>
  export function map <Input, Join, Output> (query : UnidocQuery<Input, Join>, mapper : UnidocMapper<Join, Output>) : UnidocQuery<Input, Output>
  export function map <Input, Join, Output> (...parameters : any[]) : UnidocQuery<Input, Output> {
    if (parameters.length === 1) {
      return new MappingQuery(parameters[0] as UnidocMapper<Input, Output>)
    } else {
      return then(
        parameters[0] as UnidocQuery<Input, Join>,
        new MappingQuery(parameters[1] as UnidocMapper<Join, Output>)
      )
    }
  }

  export function reduce <Input, Output> (reducer : UnidocReducer<Input, Output>, state : Output) :  UnidocQuery<Input, Output>
  export function reduce <Input, Join, Output> (query : UnidocQuery<Input, Join>, reducer : UnidocReducer<Join, Output>, state : Output) : UnidocQuery<Input, Output>
  export function reduce <Input, Join, Output> (...parameters : any[]) : UnidocQuery<Input, Output> {
    if (parameters.length === 2) {
      return new ReducingQuery(parameters[0] as UnidocReducer<Input, Output>, parameters[1] as Output)
    } else {
      return then(
        parameters[0] as UnidocQuery<Input, Join>,
        new ReducingQuery(
          parameters[1] as UnidocReducer<Join, Output>,
          parameters[2] as Output
        )
      )
    }
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


  export function count () : UnidocQuery<boolean, number>
  export function count <Input> (query : UnidocQuery<Input, boolean>) : UnidocQuery<Input, number>
  export function count <Input> (query? : UnidocQuery<Input, boolean>) : UnidocQuery<Input, number> | UnidocQuery<boolean, number> {
    if (query) {
      return then(query, new ReducingQuery(countReducer, 0))
    } else {
      return new ReducingQuery(countReducer, 0)
    }
  }

  export function countElements () : UnidocQuery<UnidocEvent, number>
  export function countElements <Input> (query : UnidocQuery<Input, UnidocEvent>) : UnidocQuery<Input, number>
  export function countElements <Input> (query? : UnidocQuery<Input, UnidocEvent>) : UnidocQuery<Input, number> | UnidocQuery<UnidocEvent, number> {
    if (query) {
      return then(query, count(map(isCountableEvent)))
    } else {
      return count(map(isCountableEvent))
    }
  }

  export function depth () : UnidocQuery<UnidocEvent, number>
  export function depth <Input> (query : UnidocQuery<Input, UnidocEvent>) : UnidocQuery<Input, number>
  export function depth <Input> (query? : UnidocQuery<Input, UnidocEvent>) : UnidocQuery<Input, number> | UnidocQuery<UnidocEvent, number> {
    if (query) {
      return then(query, new DepthQuery())
    } else {
      return new DepthQuery()
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

  export function isTagOfType<Input> (...types : string[]) : UnidocQuery<UnidocEvent, boolean>
  export function isTagOfType<Input> (query : UnidocQuery<Input, UnidocEvent>, ...types : string[]) : UnidocQuery<Input, boolean>
  export function isTagOfType<Input> (...parameters : any[]) : UnidocQuery<Input, boolean> | UnidocQuery<UnidocEvent, boolean> {
    if (typeof parameters[0] === 'string') {
      return new MappingQuery(isTagOfTypeFactory(parameters))
    } else {
      return then(
        parameters[0] as UnidocQuery<Input, UnidocEvent>,
        new MappingQuery(isTagOfTypeFactory(parameters.slice(1)))
      )
    }
  }

  export function isTagStartOfType<Input> (...types : string[]) : UnidocQuery<UnidocEvent, boolean>
  export function isTagStartOfType<Input> (query : UnidocQuery<Input, UnidocEvent>, ...types : string[]) : UnidocQuery<Input, boolean>
  export function isTagStartOfType<Input> (...parameters : any[]) : UnidocQuery<Input, boolean> | UnidocQuery<UnidocEvent, boolean> {
    if (typeof parameters[0] === 'string') {
      return new MappingQuery(isTagStartOfTypeFactory(parameters))
    } else {
      return then(
        parameters[0] as UnidocQuery<Input, UnidocEvent>,
        new MappingQuery(isTagStartOfTypeFactory(parameters.slice(1)))
      )
    }
  }

  export function isTagWithClass<Input> (...classes : string[]) : UnidocQuery<UnidocEvent, boolean>
  export function isTagWithClass<Input> (query : UnidocQuery<Input, UnidocEvent>, ...types : string[]) : UnidocQuery<Input, boolean>
  export function isTagWithClass<Input> (...parameters : any[]) : UnidocQuery<Input, boolean> | UnidocQuery<UnidocEvent, boolean> {
    if (typeof parameters[0] === 'string') {
      return new MappingQuery(isTagWithClassFactory(parameters))
    } else {
      return then(
        parameters[0] as UnidocQuery<Input, UnidocEvent>,
        new MappingQuery(isTagWithClassFactory(parameters.slice(1)))
      )
    }
  }

  export function isTagWithIdentifier<Input> (...identifiers : string[]) : UnidocQuery<UnidocEvent, boolean>
  export function isTagWithIdentifier<Input> (query : UnidocQuery<Input, UnidocEvent>, ...types : string[]) : UnidocQuery<Input, boolean>
  export function isTagWithIdentifier<Input> (...parameters : any[]) : UnidocQuery<Input, boolean> | UnidocQuery<UnidocEvent, boolean> {
    if (typeof parameters[0] === 'string') {
      return new MappingQuery(isTagWithIdentifierFactory(parameters))
    } else {
      return then(
        parameters[0] as UnidocQuery<Input, UnidocEvent>,
        new MappingQuery(isTagWithIdentifierFactory(parameters.slice(1)))
      )
    }
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

  export function childIndex <Input> () : UnidocQuery<UnidocEvent, number>
  export function childIndex <Input> (query : UnidocQuery<Input, UnidocEvent>) : UnidocQuery<Input, number>
  export function childIndex <Input> (query? : UnidocQuery<Input, UnidocEvent>) : UnidocQuery<Input, number> | UnidocQuery<UnidocEvent, number> {
    if (query) {
      return then(query, new ChildIndexQuery())
    } else {
      return new ChildIndexQuery()
    }
  }

  export function then <Input, Join, Output> (left : UnidocQuery<Input, Join>, right : UnidocQuery<Join, Output>) : UnidocQuery<Input, Output> {
    return new ChainedQuery(left, right)
  }
}
