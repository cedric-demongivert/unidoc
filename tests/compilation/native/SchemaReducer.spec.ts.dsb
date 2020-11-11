import { toArray } from 'rxjs/operators'

import { stream } from '../../../sources/stream'
import { reduce } from '../../../sources/compilation/native/reduce'

import { TrackedUnidocEventProducer } from '../../../sources/event/TrackedUnidocEventProducer'
import { Schema } from '../../../sources/compilation/native/schema/Schema'
import { SchemaReducer } from '../../../sources/compilation/native/schema/SchemaReducer'

describe('SchemaReducer', function() {
  it('it is able to parse scalar schemas from unidoc', function(done: Function) {
    const document: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()

    stream(document)
      .pipe(reduce(SchemaReducer.document()))
      .pipe(toArray())
      .subscribe(function(value: any[]): void {
        expect(value.length).toBe(1)
        expect(value[0]).toEqual(
          Schema.text()
        )
        done()
      })

    document.tag('document#first', function() {
      document.produceString('\r\n\r\n')
      document.tag('scalar', function() {
        document.produceString(' text ')
      })
    }).complete()
  })

  it('it is able to parse object schemas from unidoc', function(done: Function) {
    const document: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()

    stream(document)
      .pipe(reduce(SchemaReducer.document()))
      .pipe(toArray())
      .subscribe(function(value: any[]): void {
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

    document.tag('document#first', function() {
      document.produceString('\r\n\r\n')
      document.tag('object', function() {
        document.tag('name', function() {
          document.tag('scalar', function() {
            document.produceString(' text ')
          })
        })

        document.tag('family-name', function() {
          document.tag('scalar', function() {
            document.produceString(' text ')
          })
        })

        document.tag('age', function() {
          document.tag('scalar', function() {
            document.produceString(' integer ')
          })
        })
      })
    }).complete()
  })

  it('it is able to parse switch schemas from unidoc', function(done: Function) {
    const document: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()

    stream(document)
      .pipe(reduce(SchemaReducer.document()))
      .pipe(toArray())
      .subscribe(function(value: any[]): void {
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

    document.tag('document#first', function() {
      document.produceString('\r\n\r\n')
      document.tag('switch', function() {
        document.tag('string', function() {
          document.tag('scalar', function() {
            document.produceString(' text ')
          })
        })

        document.tag('float', function() {
          document.tag('scalar', function() {
            document.produceString(' float ')
          })
        })

        document.tag('integer', function() {
          document.tag('scalar', function() {
            document.produceString(' integer ')
          })
        })
      })
    }).complete()
  })

  it('it is able to parse stream schemas from unidoc', function(done: Function) {
    const document: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()

    stream(document)
      .pipe(reduce(SchemaReducer.document()))
      .pipe(toArray())
      .subscribe(function(value: any[]): void {
        expect(value.length).toBe(1)
        expect(value[0]).toEqual(
          Schema.stream(Schema.text())
        )
        done()
      })

    document.tag('document#first', function() {
      document.produceString('\r\n\r\n')
      document.tag('stream', function() {
        document.tag('scalar', function() {
          document.produceString(' text ')
        })
      })
    }).complete()
  })

  it('it is able to parse any schemas from unidoc', function(done: Function) {
    const document: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()

    stream(document)
      .pipe(reduce(SchemaReducer.document()))
      .pipe(toArray())
      .subscribe(function(value: any[]): void {
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

    document.tag('document#first', function() {
      document.produceString('\r\n\r\n')
      document.tag('any', function() {
        document.tag('scalar', function() {
          document.produceString(' text ')
        })

        document.tag('object', function() {
          document.tag('name', function() {
            document.tag('scalar', function() {
              document.produceString(' text ')
            })
          })

          document.tag('price', function() {
            document.tag('scalar', function() {
              document.produceString(' integer ')
            })
          })
        })

        document.tag('stream', function() {
          document.tag('scalar', function() {
            document.produceString(' integer ')
          })
        })
      })
    }).complete()
  })

  it('it is able to parse schemas from unidoc', function(done: Function) {
    const document: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()

    stream(document)
      .pipe(reduce(SchemaReducer.document()))
      .pipe(toArray())
      .subscribe(function(value: any[]): void {
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

    document.tag('document#first', function() {
      document.produceString('\r\n\r\n')
      document.tag('stream', function() {
        document.tag('object', function() {
          document.tag('name', function() {
            document.tag('scalar', function() {
              document.produceString(' text ')
            })
          })

          document.tag('family-name', function() {
            document.tag('scalar', function() {
              document.produceString(' text ')
            })
          })

          document.tag('age', function() {
            document.tag('scalar', function() {
              document.produceString(' integer ')
            })
          })
        })
      })
    }).complete()
  })
})
