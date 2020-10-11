import { toArray } from 'rxjs/operators'

import { stream } from '../../../sources/stream'
import { tokenize } from '../../../sources/tokenize'
import { parse } from '../../../sources/parse'
import { reduce } from '../../../sources/compilation/native/reduce'

import { Schema } from '../../../sources/compilation/native/schema/Schema'
import { SchematicReducerFactory } from '../../../sources/compilation/native/schema/SchematicReducerFactory'

describe('SchematicReducerFactory', function () {
  const factory : SchematicReducerFactory = new SchematicReducerFactory()

  it('it is able to build reducers for parsing text', function (done : Function) {
    stream.string(`
      \\document#first

      Lorem ipsum  dolor\t  sit amet, set amet
      temeter let memet ket

      semet.
    `).pipe(tokenize())
      .pipe(parse())
      .pipe(reduce(factory.create(Schema.text())))
      .pipe(toArray())
      .subscribe(function (value : any[]) : void {
        expect(value.length).toBe(1)
        expect(value[0]).toBe('Lorem ipsum dolor sit amet, set amet temeter let memet ket semet.')
        done()
      })
  })

  it('it is able to build reducers for parsing token', function (done : Function) {
    stream.string(`
      \\document#first

      3030.1569
    `).pipe(tokenize())
      .pipe(parse())
      .pipe(reduce(factory.create(Schema.token())))
      .pipe(toArray())
      .subscribe(function (value : any[]) : void {
        expect(value.length).toBe(1)
        expect(value[0]).toBe('3030.1569')
        done()
      })
  })

  it('it is able to build reducers for parsing floats', function (done : Function) {
    stream.string(`
      \\document#first

      3030.1569
    `).pipe(tokenize())
      .pipe(parse())
      .pipe(reduce(factory.create(Schema.float())))
      .pipe(toArray())
      .subscribe(function (value : any[]) : void {
        expect(value.length).toBe(1)
        expect(value[0]).toBe(3030.1569)
        done()
      })
  })

  it('it is able to build reducers for parsing integers', function (done : Function) {
    stream.string(`
      \\document#first

      3030
    `).pipe(tokenize())
      .pipe(parse())
      .pipe(reduce(factory.create(Schema.integer())))
      .pipe(toArray())
      .subscribe(function (value : any[]) : void {
        expect(value.length).toBe(1)
        expect(value[0]).toBe(3030)
        done()
      })
  })

  it('it is able to build reducers for parsing streams', function (done : Function) {
    stream.string(`
      \\document#first

      \\element { 5 }
      \\element { 2 }
      \\element { -3 }
      \\element { -6 }
    `).pipe(tokenize())
      .pipe(parse())
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
  })

  it('it is able to build reducers for parsing objects', function (done : Function) {
    stream.string(`
      \\document#first

      \\title { lorem ipsum dolor sit amet }
      \\identifier { 15 }
      \\tags {
        \\tag { lorem }
        \\tag { dolor }
        \\tag { amet }
      }
      \\content {
        lorem ipsum dolor sit amet sit dolor est
      }
      \\tags {
        \\tag { lorem }
        \\tag { dolor }
      }
    `).pipe(tokenize())
      .pipe(parse())
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
  })

  it('it is able to build reducers for parsing multiple cases', function (done : Function) {
    stream.string(`
      \\document#first

      \\client {
        \\name { lorem }
        \\family-name { ipsum }
      }

      \\address {
        206 lorem ipsum
      }

      \\item {
        \\name { lorem ipsum dolor }
        \\identifier { 15 }
      }
    `).pipe(tokenize())
      .pipe(parse())
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
  })

  it('it is able to build reducers for parsing tags', function (done : Function) {
    stream.string(`
      \\document#first

      \\string { pwet sit dolor }
      \\float { 125.69 }
      \\integer { 35 }
      \\string { amet }
      \\integer { 18 }
    `).pipe(tokenize())
      .pipe(parse())
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
  })

  it('it is able to build reducers for circular objects', function (done : Function) {
    const peopleSchema : Schema<any> = Schema.object({
      name: Schema.text(),
      'family-name': Schema.text(),
      age: Schema.integer()
    })

    peopleSchema.description.brother = peopleSchema
    peopleSchema.description.sister = peopleSchema

    stream.string(`
      \\document#first

      \\name { lorem }
      \\family-name { ipsum }
      \\age { 10 }
      \\brother {
        \\name { amet }
        \\family-name { ipsum }
        \\age { 8 }

        \\sister {
          \\name { sit }
          \\family-name { ipsum }
          \\age { 7 }
        }
      }
    `).pipe(tokenize())
      .pipe(parse())
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
  })

  it('it is able to build reducers for circular streams', function (done : Function) {
    const elementSchema : Schema<any> = Schema.any(Schema.text())
    const listSchema : Schema<any> = Schema.stream(elementSchema)

    elementSchema.description.push(listSchema)

    stream.string(`
      \\document#first

      \\name { dolor }
      \\name { sit }
      \\name { amet }
      \\list {
        \\name { sit }
        \\name { dolor }
        \\list {
          \\name { amet }
          \\name { dolor }
        }
        \\name { amet }
        \\list {
          \\name { sit }
          \\name { dolor }
        }
      }
    `).pipe(tokenize())
      .pipe(parse())
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
  })

  it('it is able to build reducers for circular switch', function (done : Function) {
    const elementSchema : Schema<any> = Schema.tags({
      string: Schema.text(),
      float: Schema.float(),
      integer: Schema.integer()
    })
    const listSchema : Schema<any> = Schema.stream(elementSchema)

    elementSchema.description.list = listSchema

    stream.string(`
      \\document#first

      \\string { dolor }
      \\float { 125.6 }
      \\float { 123.9 }
      \\list {
        \\string { sit }
        \\string { dolor }
        \\list {
          \\integer { 15 }
          \\string { sit }
        }
        \\float { 32.6 }
        \\list {
          \\integer { 22 }
          \\string { amet }
        }
      }
    `).pipe(tokenize())
      .pipe(parse())
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
  })
})
