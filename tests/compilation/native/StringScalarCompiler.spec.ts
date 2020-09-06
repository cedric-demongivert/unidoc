import { filter, toArray } from 'rxjs/operators'

import { stream } from '../../../sources/stream'
import { tokenize } from '../../../sources/tokenize'
import { parse } from '../../../sources/parse'
import { compile } from '../../../sources/compilation/native/compile'
import { isContentEvent } from '../../../sources/isContentEvent'
import { StringScalarCompiler } from '../../../sources/compilation/native/compilation/StringScalarCompiler'


describe('StringScalarCompiler', function () {
  it('compile unidoc tags into a string', function (done : Function) {
    stream.string(`
      \\document#first

      Lorem ipsum  dolor\t  sit amet, set amet
      temeter let memet ket

      semet.
    `).pipe(tokenize())
      .pipe(parse())
      .pipe(filter(isContentEvent))
      .pipe(compile(new StringScalarCompiler()))
      .pipe(toArray())
      .subscribe(function (value : string[]) : void {
        expect(value.length).toBe(1)
        expect(value[0]).toBe('Lorem ipsum dolor sit amet, set amet temeter let memet ket semet.')
        done()
      })
  })
})
