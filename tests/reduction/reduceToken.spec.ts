import { Empty, Factory } from '@cedric-demongivert/gl-tool-utils'

import { UnidocEventFlow } from '../../sources/event/UnidocEventFlow'
import { UnidocEvent } from '../../sources/event/UnidocEvent'
import { UnidocReduction } from '../../sources/reduction/UnidocReduction'
import { UnidocReducer } from '../../sources/reduction/UnidocReducer'
import { reduceToken } from '../../sources/reduction/reduceToken'

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
describe('reduceToken', function () {
  /**
   * 
   */
  it('returns null on start', function () {
    expect(
      result(
        function* (flow: UnidocEventFlow) {

        },
        reduceToken
      )
    ).toBeNull()
  })

  /**
   * 
   */
  it('returns the first token of a text', function () {
    expect(
      result(
        function* (flow: UnidocEventFlow) {
          yield flow.thenWord('ab')
          yield flow.thenWhitespace('  ')
          yield flow.thenWord('cd')
          yield flow.thenWord('ef')
          yield flow.thenWhitespace(' \r\n')
          yield flow.thenWhitespace('\t')
          yield flow.thenWord('gh')
        },
        function* () {
          yield UnidocReduction.NEXT
          return yield* reduceToken()
        }
      )
    ).toBe('ab')
  })

  /**
   * 
   */
  it('trim the token', function () {
    expect(
      result(
        function* (flow: UnidocEventFlow) {
          yield flow.thenWhitespace(' ')
          yield flow.thenWhitespace(' ')
          yield flow.thenWord('ab')
          yield flow.thenWhitespace('  ')
          yield flow.thenWord('cd')
          yield flow.thenWord('ef')
          yield flow.thenWhitespace(' \r\n')
          yield flow.thenWhitespace('\t')
          yield flow.thenWord('gh')
          yield flow.thenWhitespace('\t')
          yield flow.thenWhitespace('  ')
        },
        function* () {
          yield UnidocReduction.NEXT
          return yield* reduceToken()
        }
      )
    ).toBe('ab')
  })

  /**
   * 
   */
  it('stop itself at any tag start', function () {
    const resultFlow: UnidocEventFlow = new UnidocEventFlow()
    resultFlow.skip('  ab')

    expect(
      stop(
        function* (flow: UnidocEventFlow) {
          yield flow.thenWhitespace(' ')
          yield flow.thenWhitespace(' ')
          yield flow.thenWord('ab')
          yield flow.thenTagStart('tag')
        },
        function* () {
          yield UnidocReduction.NEXT
          return yield* reduceToken()
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
    resultFlow.skip('  ab')

    expect(
      stop(
        function* (flow: UnidocEventFlow) {
          flow.thenTagStart('tag', Empty.STRING)
          yield flow.thenWhitespace(' ')
          yield flow.thenWhitespace(' ')
          yield flow.thenWord('ab')
          yield flow.thenTagEnd()
        },
        function* () {
          yield UnidocReduction.NEXT
          return yield* reduceToken()
        }
      )
    ).toBeNext(resultFlow.thenTagEnd())
  })

  /**
   * 
   */
  it('stop itself after the token', function () {
    const resultFlow: UnidocEventFlow = new UnidocEventFlow()
    resultFlow.thenTagStart('tag', Empty.STRING)
    resultFlow.skip('  ab')

    expect(
      stop(
        function* (flow: UnidocEventFlow) {
          flow.thenTagStart('tag', Empty.STRING)
          yield flow.thenWhitespace(' ')
          yield flow.thenWhitespace(' ')
          yield flow.thenWord('ab')
          yield flow.thenWhitespace(' ')
        },
        function* () {
          yield UnidocReduction.NEXT
          return yield* reduceToken()
        }
      )
    ).toBeNext(resultFlow.thenWhitespace(' '))
  })
})
