import { toArray } from 'rxjs/operators'

import { stream } from '../../../sources/stream'
import { tokenize } from '../../../sources/tokenize'
import { parse } from '../../../sources/parse'
import { reduce } from '../../../sources/compilation/native/reduce'

import { Schema } from '../../../sources/compilation/native/schema/Schema'
import { SchemaReducer } from '../../../sources/compilation/native/schema/SchemaReducer'

describe('SchemaReducer', function () {
  it('it is able to parse scalar schemas from unidoc', function (done : Function) {
    stream.string(`
      \\document#first

      \\scalar { text }
    `).pipe(tokenize())
      .pipe(parse())
      .pipe(reduce(SchemaReducer.document()))
      .pipe(toArray())
      .subscribe(function (value : any[]) : void {
        expect(value.length).toBe(1)
        expect(value[0]).toEqual(
          Schema.text()
        )
        done()
      })
  })

  it('it is able to parse object schemas from unidoc', function (done : Function) {
    stream.string(`
      \\document#first

      \\object {
        \\name {
          \\scalar { text }
        }

        \\family-name {
          \\scalar { text }
        }

        \\age {
          \\scalar { integer }
        }
      }
    `).pipe(tokenize())
      .pipe(parse())
      .pipe(reduce(SchemaReducer.document()))
      .pipe(toArray())
      .subscribe(function (value : any[]) : void {
        expect(value.length).toBe(1)
        expect(value[0]).toEqual(
          Schema.object({
            name: Schema.text(),
            'family-name': Schema.text(),
            age: Schema.integer()
          })
        )
        done()
      })
  })

  it('it is able to parse switch schemas from unidoc', function (done : Function) {
    stream.string(`
      \\document#first

      \\switch {
        \\string {
          \\scalar { text }
        }

        \\float {
          \\scalar { float }
        }

        \\integer {
          \\scalar { integer }
        }
      }
    `).pipe(tokenize())
      .pipe(parse())
      .pipe(reduce(SchemaReducer.document()))
      .pipe(toArray())
      .subscribe(function (value : any[]) : void {
        expect(value.length).toBe(1)
        expect(value[0]).toEqual(
          Schema.tags({
            string: Schema.text(),
            float: Schema.float(),
            integer: Schema.integer()
          })
        )
        done()
      })
  })

  it('it is able to parse stream schemas from unidoc', function (done : Function) {
    stream.string(`
      \\document#first

      \\stream {
        \\scalar { text }
      }
    `).pipe(tokenize())
      .pipe(parse())
      .pipe(reduce(SchemaReducer.document()))
      .pipe(toArray())
      .subscribe(function (value : any[]) : void {
        expect(value.length).toBe(1)
        expect(value[0]).toEqual(
          Schema.stream(Schema.text())
        )
        done()
      })
  })

  it('it is able to parse any schemas from unidoc', function (done : Function) {
    stream.string(`
      \\document#first

      \\any {
        \\scalar { text }

        \\object {
          \\name {
            \\scalar { text }
          }
          \\price {
            \\scalar { integer }
          }
        }

        \\stream {
          \\scalar { integer }
        }
      }
    `).pipe(tokenize())
      .pipe(parse())
      .pipe(reduce(SchemaReducer.document()))
      .pipe(toArray())
      .subscribe(function (value : any[]) : void {
        expect(value.length).toBe(1)
        expect(value[0]).toEqual(
          Schema.any(
            Schema.text(),
            Schema.object({
              name: Schema.text(),
              price: Schema.integer()
            }),
            Schema.stream(Schema.integer())
          )
        )
        done()
      })
  })

  it('it is able to parse schemas from unidoc', function (done : Function) {
    stream.string(`
      \\document#first

      \\stream {
        \\object {
          \\name {
            \\scalar { text }
          }

          \\family-name {
            \\scalar { text }
          }

          \\age {
            \\scalar { integer }
          }
        }
      }
    `).pipe(tokenize())
      .pipe(parse())
      .pipe(reduce(SchemaReducer.document()))
      .pipe(toArray())
      .subscribe(function (value : any[]) : void {
        expect(value.length).toBe(1)
        expect(value[0]).toEqual(
          Schema.stream(
            Schema.object({
              name: Schema.text(),
              'family-name': Schema.text(),
              age: Schema.integer()
            })
          )
        )
        done()
      })
  })
})
