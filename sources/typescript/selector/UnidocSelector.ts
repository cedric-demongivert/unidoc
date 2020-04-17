import { UnidocEvent } from '../event/UnidocEvent'

import { ChildrenSelector } from './ChildrenSelector'
import { ComplementationSelector } from './ComplementationSelector'
import { HeadSelector } from './HeadSelector'
import { ImmediateChildrenSelector } from './ImmediateChildrenSelector'
import { IntersectionSelector } from './IntersectionSelector'
import { TagOfTypeSelector } from './TagOfTypeSelector'
import { TagSelector } from './TagSelector'
import { TagWithClassesSelector } from './TagWithClassesSelector'
import { TagWithIdentifierSelector } from './TagWithIdentifierSelector'
import { UnionSelector } from './UnionSelector'
import { WhitespaceSelector } from './WhitespaceSelector'
import { WordSelector } from './WordSelector'

/**
* An object that act as a filter over a valid stream of unidoc event in order to
* select only a given sub-stream of event.
*/
export interface UnidocSelector {
  /**
  * Filter the next available event.
  *
  * @param event - The next available event to filter.
  *
  * @return True if the given event is selected, false otherwise.
  */
  next (event : UnidocEvent) : boolean

  /**
  * Reset this selector inner state in order to reuse it on another stream.
  */
  reset () : void

  /**
  * @return A deep copy of this selector, including its current inner state.
  */
  clone () : UnidocSelector

  /**
  * @see Object.toString
  */
  toString () : string
}

export namespace UnidocSelector {
  export function clone (selector : UnidocSelector) : UnidocSelector {
    return selector == null ? selector : selector.clone()
  }

  export function and (...selectors : UnidocSelector[]) : IntersectionSelector {
    return new IntersectionSelector(selectors)
  }

  export function or (...selectors : UnidocSelector[]) : UnionSelector {
    return new UnionSelector(selectors)
  }

  export function not (selector : UnidocSelector) : ComplementationSelector {
    return new ComplementationSelector(selector)
  }

  export function isTag () : TagSelector {
    return TagSelector.INSTANCE
  }

  export function isWord () : WordSelector {
    return WordSelector.INSTANCE
  }

  export function isWhitespace () : WhitespaceSelector {
    return WhitespaceSelector.INSTANCE
  }

  export function isChildren () : ChildrenSelector {
    return new ChildrenSelector()
  }

  export function isImmediateChildren () : ImmediateChildrenSelector {
    return new ImmediateChildrenSelector()
  }

  export function isTagOfType (...types : string[]) : TagOfTypeSelector {
    return new TagOfTypeSelector(types)
  }

  export function isTagWithClasses (...classes : string[]) : TagWithClassesSelector {
    return new TagWithClassesSelector(classes)
  }

  export function isTagWithIdentifier (...identifiers : string[]) : TagWithIdentifierSelector {
    return new TagWithIdentifierSelector(identifiers)
  }

  export function isFirst (count : number) : HeadSelector {
    return new HeadSelector(count)
  }
}
