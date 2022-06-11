import { Empty, Factory } from '@cedric-demongivert/gl-tool-utils'

import { UnidocEventFlow } from '../../sources/event/UnidocEventFlow'
import { UnidocEvent } from '../../sources/event/UnidocEvent'
import { UnidocReduction } from '../../sources/reduction/UnidocReduction'
import { UnidocReducer } from '../../sources/reduction/UnidocReducer'
import { reduceWords } from '../../sources/reduction/reduceWords'

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
describe('reduceWords', function () {
  /**
   * 
   */
  it('returns null on start', function () {
    expect(
      result(
        function* (flow: UnidocEventFlow) {

        },
        reduceWords
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
          yield flow.thenWord('ab')
          yield flow.thenWord('cd')
          yield flow.thenWord('ef')
        },
        function* () {
          yield UnidocReduction.NEXT
          return yield* reduceWords()
        }
      )
    ).toBe('abcdef')
  })

  /**
   * 
   */
  it('stop itself at any whitespace', function () {
    const resultFlow: UnidocEventFlow = new UnidocEventFlow()
    resultFlow.skip('abcdef')

    expect(
      stop(
        function* (flow: UnidocEventFlow) {
          yield flow.thenWord('ab')
          yield flow.thenWord('cd')
          yield flow.thenWord('ef')
          yield flow.thenWhitespace('\r\n')
        },
        function* () {
          yield UnidocReduction.NEXT
          return yield* reduceWords()
        }
      )
    ).toBeNext(resultFlow.thenWhitespace('\r\n'))
  })

  /**
   * 
   */
  it('stop itself at any tag start', function () {
    const resultFlow: UnidocEventFlow = new UnidocEventFlow()
    resultFlow.skip('abcdef')

    expect(
      stop(
        function* (flow: UnidocEventFlow) {
          yield flow.thenWord('ab')
          yield flow.thenWord('cd')
          yield flow.thenWord('ef')
          yield flow.thenTagStart('tag')
        },
        function* () {
          yield UnidocReduction.NEXT
          return yield* reduceWords()
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
    resultFlow.skip('abcdef')

    expect(
      stop(
        function* (flow: UnidocEventFlow) {
          flow.thenTagStart('tag', Empty.STRING)
          yield flow.thenWord('ab')
          yield flow.thenWord('cd')
          yield flow.thenWord('ef')
          yield flow.thenTagEnd()
        },
        function* () {
          yield UnidocReduction.NEXT
          return yield* reduceWords()
        }
      )
    ).toBeNext(resultFlow.thenTagEnd())
  })

})
