import { map } from 'rxjs/operators'

import { Source } from '@library/Source'
import { UnidocEvent } from '@library/event/UnidocEvent'

const source : Source = new Source()

source.fromString(require('../../../local/test.unidoc').default)
source.parse().pipe(map(x => x.toString())).forEach(console.log)
