/** eslint-env jest */

import { UnidocQueryFreeRelationshipVisitor } from '../../sources/typescript/query/executor/UnidocQueryFreeRelationshipVisitor'
import { UnidocQuery } from '../../sources/typescript/query/UnidocQuery'
import { UnidocQueryState } from '../../sources/typescript/query/UnidocQueryState'
import { UnidocQueryFreeRelationship } from '../../sources/typescript/query/UnidocQueryFreeRelationship'

function link (left : UnidocQueryState, right : UnidocQueryState) : void {
  const relationship : UnidocQueryFreeRelationship = new UnidocQueryFreeRelationship(left.query)

  relationship.from = left
  relationship.to = right
}

function * ids (states : Iterable<UnidocQueryState>) : Iterable<number> {
  for (const state of states) {
    yield state.identifier
  }
}

describe('UnidocQueryFreeRelationshipVisitor', function () {
  describe('#constructor', function () {
    it('instantiate a new free relationship visitor', function () {
      new UnidocQueryFreeRelationshipVisitor()
    })
  })

  describe('it is able to visit circular graph', function () {
    const query : UnidocQuery = new UnidocQuery()
    const a : UnidocQueryState = query.states.state()
    const b : UnidocQueryState = query.states.state()
    const c : UnidocQueryState = query.states.state()
    const d : UnidocQueryState = query.states.state()

    link(a, a)
    link(a, b)
    link(b, c)
    link(c, a)
    link(d, a)

    describe('it is able to visit circular graph', function () {
      describe('#visit', function () {
        it('yields each accessible state', function () {
          const visitor : UnidocQueryFreeRelationshipVisitor = new UnidocQueryFreeRelationshipVisitor()

          expect(new Set(ids(visitor.visit(d)))).toEqual(new Set(ids([
            a, b, c
          ])))
          expect(new Set(ids(visitor.visit(a)))).toEqual(new Set(ids([
            a, b, c
          ])))
          expect(new Set(ids(visitor.visit(b)))).toEqual(new Set(ids([
            a, b, c
          ])))
          expect(new Set(ids(visitor.visit(c)))).toEqual(new Set(ids([
            a, b, c
          ])))
        })

        it('yields each accessible state without duplicates', function () {
          const visitor : UnidocQueryFreeRelationshipVisitor = new UnidocQueryFreeRelationshipVisitor()
          expect(new Set(ids(visitor.visit(a))).size).toBe([...ids(visitor.visit(a))].length)
        })
      })

      describe('#visitWith', function () {
        it('yields each accessible state and the given states', function () {
          const visitor : UnidocQueryFreeRelationshipVisitor = new UnidocQueryFreeRelationshipVisitor()

          expect(new Set(ids(visitor.visitWith(d)))).toEqual(new Set(ids([
            a, b, c, d
          ])))
          expect(new Set(ids(visitor.visitWith(a)))).toEqual(new Set(ids([
            a, b, c
          ])))
        })

        it('yields each accessible state without duplicates', function () {
          const visitor : UnidocQueryFreeRelationshipVisitor = new UnidocQueryFreeRelationshipVisitor()
          expect(new Set(ids(visitor.visitWith(a))).size).toBe([...ids(visitor.visitWith(a))].length)
          expect(new Set(ids(visitor.visitWith(d))).size).toBe([...ids(visitor.visitWith(d))].length)
        })
      })

      describe('#visitWithout', function () {
        it('yields each accessible state and forgive the given states', function () {
          const visitor : UnidocQueryFreeRelationshipVisitor = new UnidocQueryFreeRelationshipVisitor()

          expect(new Set(ids(visitor.visitWithout(d)))).toEqual(new Set(ids([
            a, b, c
          ])))
          expect(new Set(ids(visitor.visitWithout(a)))).toEqual(new Set(ids([
            b, c
          ])))
        })

        it('yields each accessible state without duplicates', function () {
          const visitor : UnidocQueryFreeRelationshipVisitor = new UnidocQueryFreeRelationshipVisitor()
          expect(new Set(ids(visitor.visitWithout(a))).size).toBe([...ids(visitor.visitWithout(a))].length)
          expect(new Set(ids(visitor.visitWithout(d))).size).toBe([...ids(visitor.visitWithout(d))].length)
        })
      })
    })
  })
})
