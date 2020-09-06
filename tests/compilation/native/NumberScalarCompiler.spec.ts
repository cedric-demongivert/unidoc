import { filter, toArray } from 'rxjs/operators'

import { stream } from '../../../sources/stream'
import { tokenize } from '../../../sources/tokenize'
import { parse } from '../../../sources/parse'
import { compile } from '../../../sources/compilation/native/compile'
import { isContentEvent } from '../../../sources/isContentEvent'
import { NumberScalarCompiler } from '../../../sources/compilation/native/compilation/NumberScalarCompiler'

describe('NumberScalarCompiler', function () {
  it('compile unidoc tags into a number', function (done : Function) {
    stream.string(`
      \\document#first

      3030.1569
    `).pipe(tokenize())
      .pipe(parse())
      .pipe(filter(isContentEvent))
      .pipe(compile(new NumberScalarCompiler()))
      .pipe(toArray())
      .subscribe(function (value : number[]) : void {
        expect(value.length).toBe(1)
        expect(value[0]).toBe(3030.1569)
        done()
      })
  })
})
