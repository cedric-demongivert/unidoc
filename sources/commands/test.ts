import { map, reduce } from 'rxjs/operators'

import { stream } from '../stream'
import { tokenize } from '../tokenize'
import { parse } from '../parse'
import { validate } from '../validate'
import { compile } from '../compilation/html'
import { format } from '../compilation/html'
import { DocumentHTMLCompiler } from '../compilation/html'
import { StandardHTMLFormatter } from '../compilation/html'
import { Document } from '../standard/Document'

stream.string(require('../../local/test.unidoc').default, 'test.unidoc')
  .pipe(tokenize())
  //.pipe(parse())
  //.pipe(validate(Document.validator()))
  //.pipe(compile(new DocumentHTMLCompiler()))
  .pipe(map(x => x.toString()))
  //.subscribe(console.log)
  //.pipe(format(new StandardHTMLFormatter()))
  //.pipe(reduce((a : string, b : string) : string => a + b, ''))
  .subscribe(console.log)
