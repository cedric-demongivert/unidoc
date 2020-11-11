import { toArray } from 'rxjs/operators'

import { stream } from '../../../sources/stream'
import { reduce } from '../../../sources/compilation/native/reduce'

import { TrackedUnidocEventProducer } from '../../../sources/event/TrackedUnidocEventProducer'
import { EventStreamReducer } from '../../../sources/compilation/native/reducer/EventStreamReducer'

describe('EventStreamReducer', function() {
  describe('#text', function() {
    it('compile unidoc tags into a text', function(done: Function) {
      const document: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()

      stream(document)
        .pipe(reduce(EventStreamReducer.text()))
        .pipe(toArray())
        .subscribe(function(value: string[]): void {
          expect(value.length).toBe(1)
          expect(value[0]).toBe('Lorem ipsum dolor sit amet, set amet temeter let memet ket semet.')
          done()
        })

      document.tag('document#first', function() {
        document.produceText(
          '',
          '',
          'Lorem ipsum  dolor\t  sit amet, set amet',
          'temeter let memet ket',
          '',
          'semet.'
        )
      }).complete()
    })
  })

  describe('#token', function() {
    it('compile unidoc tags into a token', function(done: Function) {
      const document: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()

      stream(document)
        .pipe(reduce(EventStreamReducer.token()))
        .pipe(toArray())
        .subscribe(function(value: string[]): void {
          expect(value.length).toBe(1)
          expect(value[0]).toBe('3030.1569')
          done()
        })

      document.tag('document#first', function() {
        document.produceText(
          '',
          '',
          '3030.1569',
          ''
        )
      }).complete()
    })
  })

  describe('#stream', function() {
    it('compile unidoc tags into a list', function(done: Function) {
      const document: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()

      stream(document)
        .pipe(reduce(EventStreamReducer.stream(EventStreamReducer.token().map(parseInt))))
        .pipe(toArray())
        .subscribe(function(value: number[][]): void {
          expect(value.length).toBe(1)
          expect(value[0]).toEqual([5, 2, -3, -6])
          done()
        })

      document.tag('document#first', function() {
        document.produceString('\r\n\r\n')

        for (const value of ['5', '2', '-3', '-6']) {
          document.tag('element', function() {
            document.produceString('\r\n' + value + '\r\n')
          })
        }
      }).complete()
    })
  })

  describe('#object', function() {
    it('compile unidoc tags into an object', function(done: Function) {
      const document: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()

      stream(document)
        .pipe(
          reduce(
            EventStreamReducer.object({
              title: EventStreamReducer.text(),
              identifier: EventStreamReducer.integer(),
              tags: EventStreamReducer.stream(EventStreamReducer.token()),
              content: EventStreamReducer.text(),
            })
          )
        )
        .pipe(toArray())
        .subscribe(function(value: any[]): void {
          expect(value.length).toBe(1)
          expect(value[0]).toEqual({
            title: 'lorem ipsum dolor sit amet',
            identifier: 15,
            tags: ['lorem', 'dolor', 'amet', 'lorem', 'dolor'],
            content: 'lorem ipsum dolor sit amet sit dolor est'
          })
          done()
        })

      document.tag('document#first', function() {
        document.produceString('\r\n\r\n')

        document.tag('title', function() {
          document.produceString(' lorem ipsum dolor sit amet ')
        })
        document.tag('identifier', function() {
          document.produceString(' 15 ')
        })
        document.tag('tags', function() {
          for (const tag of [' lorem ', ' dolor ', ' amet ']) {
            document.tag('tag', function() {
              document.produceString(tag)
            })
          }
        })
        document.tag('content', function() {
          document.produceString(' lorem ipsum dolor sit amet sit dolor est ')
        })
        document.tag('tags', function() {
          for (const tag of [' lorem ', ' dolor ']) {
            document.tag('tag', function() {
              document.produceString(tag)
            })
          }
        })
      }).complete()
    })
  })

  describe('#any', function() {
    it('compile unidoc tags into the first valid result of the specified reducers', function(done: Function) {
      const document: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()

      stream(document)
        .pipe(
          reduce(EventStreamReducer.stream(EventStreamReducer.any(
            EventStreamReducer.object({
              name: EventStreamReducer.text(),
              'family-name': EventStreamReducer.text()
            }),
            EventStreamReducer.object({
              name: EventStreamReducer.text(),
              identifier: EventStreamReducer.integer()
            }),
            EventStreamReducer.text()
          ),
          ))
        )
        .pipe(toArray())
        .subscribe(function(value: any[]): void {
          expect(value.length).toBe(1)
          expect(value[0]).toEqual([{
            name: 'lorem',
            'family-name': 'ipsum'
          },
            '206 lorem ipsum',
          {
            name: 'lorem ipsum dolor',
            identifier: 15
          }])
          done()
        })

      document.tag('document#first', function() {
        document.produceString('\r\n\r\n')

        document.tag('client', function() {
          document.tag('name', function() {
            document.produceString(' lorem ')
          })
          document.tag('family-name', function() {
            document.produceString(' ipsum ')
          })
        })
        document.tag('address', function() {
          document.produceString('206 lorem ipsum')
        })
        document.tag('item', function() {
          document.tag('name', function() {
            document.produceString(' lorem ipsum dolor ')
          })
          document.tag('identifier', function() {
            document.produceString(' 15 ')
          })
        })
      }).complete()
    })
  })

  describe('#tags', function() {
    it('compile unidoc tags by using different reducers for different tags', function(done: Function) {
      const document: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()

      stream(document)
        .pipe(
          reduce(EventStreamReducer.stream(EventStreamReducer.tags({
            string: EventStreamReducer.text(),
            float: EventStreamReducer.float(),
            integer: EventStreamReducer.integer()
          })))
        )
        .pipe(toArray())
        .subscribe(function(value: any[]): void {
          expect(value.length).toBe(1)
          expect(value[0]).toEqual([
            'pwet sit dolor',
            125.69,
            35,
            'amet',
            18
          ])
          done()
        })

      document.tag('document#first', function() {
        document.produceString('\r\n\r\n')

        document.tag('string', function() {
          document.produceString(' pwet sit dolor ')
        })
        document.tag('float', function() {
          document.produceString(' 125.69 ')
        })
        document.tag('integer', function() {
          document.produceString(' 35 ')
        })
        document.tag('string', function() {
          document.produceString(' amet ')
        })
        document.tag('integer', function() {
          document.produceString(' 18 ')
        })
      }).complete()
    })
  })
})
