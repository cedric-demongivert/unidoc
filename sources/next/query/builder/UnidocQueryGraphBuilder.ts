import { Collection } from '@cedric-demongivert/gl-tool-collection'

import { UnidocQuery } from '../UnidocQueryState'
import { UnidocQueryState } from '../UnidocQueryState'

export interface UnidocQueryGraphBuilder {
  /**
  * The parent unidoc query instance of this builder.
  */
  readonly query    : UnidocQuery
  readonly input    : UnidocQueryState
  readonly outputs  : Collection<UnidocQueryState>
  readonly nexts    : Collection<UnidocQueryGraphBuilder>
  readonly previous : Collection<UnidocQueryGraphBuilder>
}
