import { Empty, Factory } from '@cedric-demongivert/gl-tool-utils'

import { UnidocEventFlow } from '../../sources/event/UnidocEventFlow'
import { UnidocEvent } from '../../sources/event/UnidocEvent'
import { UnidocReduction } from '../../sources/reduction/UnidocReduction'
import { UnidocReducer } from '../../sources/reduction/UnidocReducer'
import { reduceWhitespaces } from '../../sources/reduction/reduceWhitespaces'

import '../matchers'

/**
 * 
 */
function stop(input: Factory<IterableIterator<UnidocEvent>, [UnidocEventFlow]>, reducer: UnidocReducer<unknown>): UnidocReduction.Input {
  const eventFlow: UnidocEventFlow = new UnidocEventFlow()
  return UnidocReduction.stop(input(eventFlow), reducer())
}

/**
 * 
 */
function result<Product>(input: Factory<IterableIterator<UnidocEvent>, [UnidocEventFlow]>, reducer: UnidocReducer<Product>): Product {
  const eventFlow: UnidocEventFlow = new UnidocEventFlow()
  return UnidocReduction.feed(input(eventFlow), reducer())
}

/**
 * 
 */
describe('reduceWhitespaces', function () {
  /**
   * 
   */
  it('returns null on start', function () {
    expect(
      result(
        function* (flow: UnidocEventFlow) {

        },
        reduceWhitespaces
      )
    ).toBeNull()
  })

  /**
   * 
   */
  it('reduce many words', function () {
    expect(
      result(
        function* (flow: UnidocEventFlow) {
          yield flow.thenWhitespace('  ')
          yield flow.thenWhitespace('\t\r\n')
          yield flow.thenWhitespace(' ')
        },
        function* () {
          yield UnidocReduction.NEXT
          return yield* reduceWhitespaces()
        }
      )
    ).toBe('  \t\r\n ')
  })

  /**
   * 
   */
  it('stop itself at any word', function () {
    const resultFlow: UnidocEventFlow = new UnidocEventFlow()
    resultFlow.skip('  \t\r\n ')

    expect(
      stop(
        function* (flow: UnidocEventFlow) {
          yield flow.thenWhitespace('  ')
          yield flow.thenWhitespace('\t\r\n')
          yield flow.thenWhitespace(' ')
          yield flow.thenWord('token')
        },
        function* () {
          yield UnidocReduction.NEXT
          return yield* reduceWhitespaces()
        }
      )
    ).toBeNext(resultFlow.thenWord('token'))
  })

  /**
   * 
   */
  it('stop itself at any tag start', function () {
    const resultFlow: UnidocEventFlow = new UnidocEventFlow()
    resultFlow.skip('  \t\r\n ')

    expect(
      stop(
        function* (flow: UnidocEventFlow) {
          yield flow.thenWhitespace('  ')
          yield flow.thenWhitespace('\t\r\n')
          yield flow.thenWhitespace(' ')
          yield flow.thenTagStart('tag')
        },
        function* () {
          yield UnidocReduction.NEXT
          return yield* reduceWhitespaces()
        }
      )
    ).toBeNext(resultFlow.thenTagStart('tag'))
  })

  /**
   * 
   */
  it('stop itself at any tag end', function () {
    const resultFlow: UnidocEventFlow = new UnidocEventFlow()
    resultFlow.thenTagStart('tag', Empty.STRING)
    resultFlow.skip('  \t\r\n ')

    expect(
      stop(
        function* (flow: UnidocEventFlow) {
          flow.thenTagStart('tag', Empty.STRING)
          yield flow.thenWhitespace('  ')
          yield flow.thenWhitespace('\t\r\n')
          yield flow.thenWhitespace(' ')
          yield flow.thenTagEnd()
        },
        function* () {
          yield UnidocReduction.NEXT
          return yield* reduceWhitespaces()
        }
      )
    ).toBeNext(resultFlow.thenTagEnd())
  })

})
