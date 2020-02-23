import { map } from 'rxjs/operators'

import { fromString } from '../fromString'
import { tokenize } from '../tokenize'
import { parse } from '../parse'

fromString(require('../../../local/test.unidoc').default)
  .pipe(tokenize())
  .pipe(parse())
  .pipe(map(x => x.toString()))
  .forEach(console.log)
