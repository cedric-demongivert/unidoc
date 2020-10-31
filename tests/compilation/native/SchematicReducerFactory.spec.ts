import { toArray } from 'rxjs/operators'

import { stream } from '../../../sources/producer/stream'
import { reduce } from '../../../sources/compilation/native/reduce'

import { UnidocEventProducer } from '../../../sources/event/UnidocEventProducer'
import { Schema } from '../../../sources/compilation/native/schema/Schema'
import { SchematicReducerFactory } from '../../../sources/compilation/native/schema/SchematicReducerFactory'

describe('SchematicReducerFactory', function () {
  const factory : SchematicReducerFactory = new SchematicReducerFactory()

  it('it is able to build reducers for parsing text', function (done : Function) {
    const document : UnidocEventProducer = new UnidocEventProducer()

    stream(document)
      .pipe(reduce(factory.create(Schema.text())))
      .pipe(toArray())
      .subscribe(function (value : any[]) : void {
        expect(value.length).toBe(1)
        expect(value[0]).toBe('Lorem ipsum dolor sit amet, set amet temeter let memet ket semet.')
        done()
      })

    document.tag('document#first', function () {
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

  it('it is able to build reducers for parsing token', function (done : Function) {
    const document : UnidocEventProducer = new UnidocEventProducer()

    stream(document)
      .pipe(reduce(factory.create(Schema.token())))
      .pipe(toArray())
      .subscribe(function (value : any[]) : void {
        expect(value.length).toBe(1)
        expect(value[0]).toBe('3030.1569')
        done()
      })

    document.tag('document#first', function () {
      document.produceText(
                '',
                '',
                '3030.1569',
                ''
              )
    }).complete()
  })

  it('it is able to build reducers for parsing floats', function (done : Function) {
    const document : UnidocEventProducer = new UnidocEventProducer()

    stream(document)
      .pipe(reduce(factory.create(Schema.float())))
      .pipe(toArray())
      .subscribe(function (value : any[]) : void {
        expect(value.length).toBe(1)
        expect(value[0]).toBe(3030.1569)
        done()
      })

    document.tag('document#first', function () {
      document.produceText(
                '',
                '',
                '3030.1569',
                ''
              )
    }).complete()
  })

  it('it is able to build reducers for parsing integers', function (done : Function) {
    const document : UnidocEventProducer = new UnidocEventProducer()

    stream(document)
      .pipe(reduce(factory.create(Schema.integer())))
      .pipe(toArray())
      .subscribe(function (value : any[]) : void {
        expect(value.length).toBe(1)
        expect(value[0]).toBe(3030)
        done()
      })

    document.tag('document#first', function () {
      document.produceText(
                '',
                '',
                '3030',
                ''
              )
    }).complete()
  })

  it('it is able to build reducers for parsing streams', function (done : Function) {
    const document : UnidocEventProducer = new UnidocEventProducer()

    stream(document)
      .pipe(reduce(factory.create(
        Schema.stream(
          Schema.float()
        )
      )))
      .pipe(toArray())
      .subscribe(function (value : any[]) : void {
        expect(value.length).toBe(1)
        expect(value[0]).toEqual([5, 2, -3, -6])
        done()
      })

    document.tag('document#first', function () {
      document.produceString('\r\n\r\n')

      for (const value of ['5', '2', '-3', '-6']) {
        document.tag('element', function () {
          document.produceString('\r\n' + value + '\r\n')
        })
      }
    }).complete()
  })

  it('it is able to build reducers for parsing objects', function (done : Function) {
    const document : UnidocEventProducer = new UnidocEventProducer()

    stream(document)
      .pipe(reduce(factory.create(
        Schema.object({
          title: Schema.text(),
          identifier: Schema.integer(),
          tags: Schema.stream(Schema.token()),
          content: Schema.text()
        })
      )))
      .pipe(toArray())
      .subscribe(function (value : any[]) : void {
        expect(value.length).toBe(1)
        expect(value[0]).toEqual({
          title: 'lorem ipsum dolor sit amet',
          identifier: 15,
          tags: ['lorem', 'dolor', 'amet', 'lorem', 'dolor'],
          content: 'lorem ipsum dolor sit amet sit dolor est'
        })
        done()
      })

    document.tag('document#first', function () {
      document.produceString('\r\n\r\n')

      document.tag('title', function () {
        document.produceString(' lorem ipsum dolor sit amet ')
      })
      document.tag('identifier', function () {
        document.produceString(' 15 ')
      })
      document.tag('tags', function () {
        for (const tag of [' lorem ', ' dolor ', ' amet ']) {
          document.tag('tag', function () {
            document.produceString(tag)
          })
        }
      })
      document.tag('content', function () {
        document.produceString(' lorem ipsum dolor sit amet sit dolor est ')
      })
      document.tag('tags', function () {
        for (const tag of [' lorem ', ' dolor ']) {
          document.tag('tag', function () {
            document.produceString(tag)
          })
        }
      })
    }).complete()
  })

  it('it is able to build reducers for parsing multiple cases', function (done : Function) {
    const document : UnidocEventProducer = new UnidocEventProducer()

    stream(document)
      .pipe(reduce(factory.create(
        Schema.stream(Schema.any(
            Schema.object({
              name: Schema.text(),
              'family-name': Schema.text()
            }),
            Schema.object({
              name: Schema.text(),
              identifier: Schema.integer()
            }),
            Schema.text()
          ),
        )
      )))
      .pipe(toArray())
      .subscribe(function (value : any[]) : void {
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

    document.tag('document#first', function () {
      document.produceString('\r\n\r\n')

      document.tag('client', function () {
        document.tag('name', function () {
          document.produceString(' lorem ')
        })
        document.tag('family-name', function () {
          document.produceString(' ipsum ')
        })
      })
      document.tag('address', function () {
        document.produceString('206 lorem ipsum')
      })
      document.tag('item', function () {
        document.tag('name', function () {
          document.produceString(' lorem ipsum dolor ')
        })
        document.tag('identifier', function () {
          document.produceString(' 15 ')
        })
      })
    }).complete()
  })

  it('it is able to build reducers for parsing tags', function (done : Function) {
    const document : UnidocEventProducer = new UnidocEventProducer()

    stream(document)
      .pipe(reduce(factory.create(
        Schema.stream(Schema.tags({
          string: Schema.text(),
          float: Schema.float(),
          integer: Schema.integer()
        }))
      )))
      .pipe(toArray())
      .subscribe(function (value : any[]) : void {
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

    document.tag('document#first', function () {
      document.produceString('\r\n\r\n')

      document.tag('string', function () {
        document.produceString(' pwet sit dolor ')
      })
      document.tag('float', function () {
        document.produceString(' 125.69 ')
      })
      document.tag('integer', function () {
        document.produceString(' 35 ')
      })
      document.tag('string', function () {
        document.produceString(' amet ')
      })
      document.tag('integer', function () {
        document.produceString(' 18 ')
      })
    }).complete()
  })

  it('it is able to build reducers for circular objects', function (done : Function) {
    const document : UnidocEventProducer = new UnidocEventProducer()

    const peopleSchema : Schema<any> = Schema.object({
      name: Schema.text(),
      'family-name': Schema.text(),
      age: Schema.integer()
    })

    peopleSchema.description.brother = peopleSchema
    peopleSchema.description.sister = peopleSchema

    stream(document)
      .pipe(reduce(factory.create(peopleSchema)))
      .pipe(toArray())
      .subscribe(function (value : any[]) : void {
        expect(value.length).toBe(1)
        expect(value[0]).toEqual({
          name: 'lorem',
          'family-name': 'ipsum',
          age: 10,
          brother: {
            name: 'amet',
            'family-name': 'ipsum',
            age: 8,
            sister: {
              name: 'sit',
              'family-name': 'ipsum',
              age: 7
            }
          }
        })
        done()
      })

    document.tag('document#first', function () {
      document.produceString('\r\n\r\n')

      document.tag('name', function () {
        document.produceString(' lorem ')
      })
      document.tag('family-name', function () {
        document.produceString(' ipsum ')
      })
      document.tag('age', function () {
        document.produceString(' 10 ')
      })
      document.tag('brother', function () {
        document.tag('name', function () {
          document.produceString(' amet ')
        })
        document.tag('family-name', function () {
          document.produceString(' ipsum ')
        })
        document.tag('age', function () {
          document.produceString(' 8 ')
        })
        document.tag('sister', function () {
          document.tag('name', function () {
            document.produceString(' sit ')
          })
          document.tag('family-name', function () {
            document.produceString(' ipsum ')
          })
          document.tag('age', function () {
            document.produceString(' 7 ')
          })
        })
      })
    }).complete()
  })

  it('it is able to build reducers for circular streams', function (done : Function) {
    const document : UnidocEventProducer = new UnidocEventProducer()

    const elementSchema : Schema<any> = Schema.any(Schema.text())
    const listSchema : Schema<any> = Schema.stream(elementSchema)

    elementSchema.description.push(listSchema)

    stream(document)
      .pipe(reduce(factory.create(listSchema)))
      .pipe(toArray())
      .subscribe(function (value : any[]) : void {
        expect(value.length).toBe(1)
        expect(value[0]).toEqual([
          'dolor',
          'sit',
          'amet',
          [
            'sit',
            'dolor',
            [
              'amet',
              'dolor'
            ],
            'amet',
            [
              'sit',
              'dolor'
            ]
          ]
        ])
        done()
      })

    document.tag('document#first', function () {
      document.produceString('\r\n\r\n')

      for (const element of [' dolor ', ' sit ', ' amet ']) {
        document.tag('name', function () {
          document.produceString(element)
        })
      }

      document.tag('list', function () {
        for (const element of [' sit ', ' dolor ']) {
          document.tag('name', function () {
            document.produceString(element)
          })
        }
        document.tag('list', function () {
          for (const element of [' amet ', ' dolor ']) {
            document.tag('name', function () {
              document.produceString(element)
            })
          }
        })
        document.tag('name', function () {
          document.produceString(' amet ')
        })
        document.tag('list', function () {
          for (const element of [' sit ', ' dolor ']) {
            document.tag('name', function () {
              document.produceString(element)
            })
          }
        })
      })
    }).complete()
  })

  it('it is able to build reducers for circular switch', function (done : Function) {
    const document : UnidocEventProducer = new UnidocEventProducer()

    const elementSchema : Schema<any> = Schema.tags({
      string: Schema.text(),
      float: Schema.float(),
      integer: Schema.integer()
    })
    const listSchema : Schema<any> = Schema.stream(elementSchema)

    elementSchema.description.list = listSchema

    stream(document)
      .pipe(reduce(factory.create(listSchema)))
      .pipe(toArray())
      .subscribe(function (value : any[]) : void {
        expect(value.length).toBe(1)
        expect(value[0]).toEqual([
          'dolor',
          125.6,
          123.9,
          [
            'sit',
            'dolor',
            [
              15,
              'sit'
            ],
            32.6,
            [
              22,
              'amet'
            ]
          ]
        ])
        done()
      })

    document.tag('document#first', function () {
      document.produceString('\r\n\r\n')

      document.tag('string', function () {
        document.produceString(' dolor ')
      })
      document.tag('float', function () {
        document.produceString(' 125.6 ')
      })
      document.tag('float', function () {
        document.produceString(' 123.9 ')
      })

      document.tag('list', function () {
        document.tag('string', function () {
          document.produceString(' sit ')
        })
        document.tag('string', function () {
          document.produceString(' dolor ')
        })
        document.tag('list', function () {
          document.tag('integer', function () {
            document.produceString(' 15 ')
          })
          document.tag('string', function () {
            document.produceString(' sit ')
          })
        })
        document.tag('float', function () {
          document.produceString(' 32.6 ')
        })
        document.tag('list', function () {
          document.tag('integer', function () {
            document.produceString(' 22 ')
          })
          document.tag('string', function () {
            document.produceString(' amet ')
          })
        })
      })
    }).complete()
  })
})
