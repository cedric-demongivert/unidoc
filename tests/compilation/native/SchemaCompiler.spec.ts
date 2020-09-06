import { filter, toArray } from 'rxjs/operators'

import { stream } from '../../../sources/stream'
import { tokenize } from '../../../sources/tokenize'
import { parse } from '../../../sources/parse'
import { compile } from '../../../sources/compilation/native/compile'
import { Schema } from '../../../sources/compilation/native/Schema'
import { SchemaCompiler } from '../../../sources/compilation/native/compilation/SchemaCompiler'


describe('StringScalarCompiler', function () {
  it('compile unidoc tags into a number', function (done : Function) {
    stream.string(`
      \\document#first

      503.30
    `).pipe(tokenize())
      .pipe(parse())
      .pipe(compile(new SchemaCompiler(Schema.number())))
      .pipe(toArray())
      .subscribe(function (value : number[]) : void {
        expect(value.length).toBe(1)
        expect(value[0]).toBe(503.30)
        done()
      })
  })

  it('compile unidoc tags into an integer', function (done : Function) {
    stream.string(`
      \\document#first

      503
    `).pipe(tokenize())
      .pipe(parse())
      .pipe(compile(new SchemaCompiler(Schema.integer())))
      .pipe(toArray())
      .subscribe(function (value : number[]) : void {
        expect(value.length).toBe(1)
        expect(value[0]).toBe(503)
        done()
      })
  })

  it('compile unidoc tags into a string', function (done : Function) {
    stream.string(`
      \\document#first

      Lorem ipsum  dolor
      sit amet \t consequetur.
    `).pipe(tokenize())
      .pipe(parse())
      .pipe(compile(new SchemaCompiler(Schema.string())))
      .pipe(toArray())
      .subscribe(function (value : string[]) : void {
        expect(value.length).toBe(1)
        expect(value[0]).toBe('Lorem ipsum dolor sit amet consequetur.')
        done()
      })
  })

  it('compile unidoc tags into arrays of scalars', function (done : Function) {
    stream.string(`
      \\document#first

      \\element { 5 }
      \\element { 2 }
      \\element { -3 }
      \\element { -6 }
    `).pipe(tokenize())
      .pipe(parse())
      .pipe(compile(new SchemaCompiler(Schema.stream(Schema.integer()))))
      .pipe(toArray())
      .subscribe(function (value : number[][]) : void {
        expect(value.length).toBe(1)
        expect(value[0]).toEqual([5, 2, -3, -6])
        done()
      })
  })

  it('compile unidoc tags into empty arrays of scalars', function (done : Function) {
    stream.string(``).pipe(tokenize())
      .pipe(parse())
      .pipe(compile(new SchemaCompiler(Schema.stream(Schema.integer()))))
      .pipe(toArray())
      .subscribe(function (value : number[][]) : void {
        expect(value.length).toBe(1)
        expect(value[0]).toEqual([])
        done()
      })
  })

  it('compile unidoc tags into arrays of arrays of scalars', function (done : Function) {
    stream.string(`
      \\document#first

      \\vector {
        \\element { 5 }
        \\element { -1 }
        \\element { 3 }
      }
      \\vector {
      }
      \\vector {
        \\element { 2 }
        \\element { -3 }
      }
    `).pipe(tokenize())
      .pipe(parse())
      .pipe(compile(new SchemaCompiler(Schema.stream(Schema.stream(Schema.integer())))))
      .pipe(toArray())
      .subscribe(function (value : number[][][]) : void {
        expect(value.length).toBe(1)
        expect(value[0]).toEqual([
          [5, -1, 3],
          [],
          [2, -3]
        ])
        done()
      })
  })

  it('compile different tags into different scalars', function (done : Function) {
    stream.string(`
      \\document#first

      \\string { 5 }
      \\number { 5 }
      \\string { 3 }
      \\string { 2 }
      \\number { -5 }
    `).pipe(tokenize())
      .pipe(parse())
      .pipe(compile(
        new SchemaCompiler(
          Schema.stream(Schema.tags({
            string: Schema.string(),
            number: Schema.number()
          }))
        )
      ))
      .pipe(toArray())
      .subscribe(function (value : any[]) : void {
        expect(value.length).toBe(1)
        expect(value[0]).toEqual([
          '5', 5, '3', '2', -5
        ])
        done()
      })
  })

  it('compile tags into an object', function (done : Function) {
    stream.string(`
      \\document#first

      \\vector {
        \\x { 20 }
        \\y { 10 }
      }

      \\vector {
        \\x { 20 }
        \\z { 10 }
      }

      \\vector {
      }
    `).pipe(tokenize())
      .pipe(parse())
      .pipe(compile(
        new SchemaCompiler(
          Schema.stream(Schema.object({
            x: Schema.number(),
            y: Schema.number(),
            z: Schema.number()
          }))
        )
      ))
      .pipe(toArray())
      .subscribe(function (value : any[]) : void {
        expect(value.length).toBe(1)
        expect(value[0]).toEqual([
          { x: 20, y: 10 },
          { x: 20, z: 10 },
          {}
        ])
        done()
      })
  })
})
