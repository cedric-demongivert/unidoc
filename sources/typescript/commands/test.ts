import { map } from 'rxjs/operators'

import { fromString } from '../fromString'
import { tokenize } from '../tokenize'
import { parse } from '../parse'
import { validate } from '../validate'
import { Document } from '../standard/Document'

fromString(require('../../../local/test.unidoc').default)
  .pipe(tokenize())
  .pipe(parse())
  .pipe(validate(Document.validator()))
  .pipe(map(x => x.toString()))
  .forEach(console.log)
