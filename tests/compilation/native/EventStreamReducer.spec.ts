import { toArray } from 'rxjs/operators'

import { stream } from '../../../sources/stream'
import { tokenize } from '../../../sources/tokenize'
import { parse } from '../../../sources/parse'
import { reduce } from '../../../sources/compilation/native/reduce'

import { EventStreamReducer } from '../../../sources/compilation/native/reducer/EventStreamReducer'

describe('EventStreamReducer', function () {
  describe('#text', function () {
    it('compile unidoc tags into a text', function (done : Function) {
      stream.string(`
        \\document#first

        Lorem ipsum  dolor\t  sit amet, set amet
        temeter let memet ket

        semet.
      `).pipe(tokenize())
        .pipe(parse())
        .pipe(reduce(EventStreamReducer.text()))
        .pipe(toArray())
        .subscribe(function (value : string[]) : void {
          expect(value.length).toBe(1)
          expect(value[0]).toBe('Lorem ipsum dolor sit amet, set amet temeter let memet ket semet.')
          done()
        })
    })
  })

  describe('#token', function () {
    it('compile unidoc tags into a token', function (done : Function) {
      stream.string(`
        \\document#first

        3030.1569
      `).pipe(tokenize())
        .pipe(parse())
        .pipe(reduce(EventStreamReducer.token()))
        .pipe(toArray())
        .subscribe(function (value : string[]) : void {
          expect(value.length).toBe(1)
          expect(value[0]).toBe('3030.1569')
          done()
        })
    })
  })

  describe('#stream', function () {
    it('compile unidoc tags into a list', function (done : Function) {
      stream.string(`
        \\document#first

        \\element { 5 }
        \\element { 2 }
        \\element { -3 }
        \\element { -6 }
      `).pipe(tokenize())
        .pipe(parse())
        .pipe(reduce(EventStreamReducer.stream(EventStreamReducer.token().map(parseInt))))
        .pipe(toArray())
        .subscribe(function (value : number[][]) : void {
          expect(value.length).toBe(1)
          expect(value[0]).toEqual([5, 2, -3, -6])
          done()
        })
    })
  })

  describe('#object', function () {
    it('compile unidoc tags into an object', function (done : Function) {
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
  })

  describe('#any', function () {
    it('compile unidoc tags into the first valid result of the specified reducers', function (done : Function) {
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
  })

  describe('#tags', function () {
    it('compile unidoc tags by using different reducers for different tags', function (done : Function) {
      stream.string(`
        \\document#first

        \\string { pwet sit dolor }
        \\float { 125.69 }
        \\integer { 35 }
        \\string { amet }
        \\integer { 18 }
      `).pipe(tokenize())
        .pipe(parse())
        .pipe(
          reduce(EventStreamReducer.stream(EventStreamReducer.tags({
            string: EventStreamReducer.text(),
            float: EventStreamReducer.float(),
            integer: EventStreamReducer.integer()
          })))
        )
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
  })
})
