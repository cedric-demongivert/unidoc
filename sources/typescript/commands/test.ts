import { map } from 'rxjs/operators'

import { lexer } from '@library/lexer'
import { fromString } from '@library/fromString'
import { tokenize } from '@library/tokenize'

fromString(require('../../../local/test.unidoc').default)
  .pipe(tokenize(lexer()))
  .pipe(map(
    x => '#' + x.type + ' :: ' + x.text.replace(/\n/g, ':n').replace(/\r/g, ':r').replace(/\t/g, ':t')))
  .forEach(console.log)
