import { map } from 'rxjs/operators'

import { fromString } from '@library/fromString'
import { tokenize } from '@library/tokenize'

fromString(require('../../../local/test.unidoc').default)
  .pipe(tokenize())
  .pipe(map(x => x.toString()))
  .forEach(console.log)
