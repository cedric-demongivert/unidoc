export { Tag } from './Tag'

import { Set as TagSet } from './Set'
import { Standard as StandardTag } from './Standard'

export namespace Tag {
  export import Set = TagSet
  export import Standard = StandardTag
}
