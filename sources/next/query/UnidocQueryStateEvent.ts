import { Sequence } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../event/UnidocEvent'

export type UnidocQueryStateEvent<Output> = (path : Sequence<UnidocEvent>) => Output
