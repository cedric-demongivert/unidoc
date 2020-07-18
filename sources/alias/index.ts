export { Alias } from './Alias'

import { Mapping as AliasMapping } from './Mapping'
import { Standard as StandardAlias } from './Standard'

export namespace Alias {
  export import Mapping = AliasMapping
  export import Standard = StandardAlias
}
