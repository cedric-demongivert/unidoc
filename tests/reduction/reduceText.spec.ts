import { Empty, Factory } from '@cedric-demongivert/gl-tool-utils'

import { UnidocEventFlow } from '../../sources/event/UnidocEventFlow'
import { UnidocEvent } from '../../sources/event/UnidocEvent'
import { UnidocReduction } from '../../sources/reduction/UnidocReduction'
import { UnidocReducer } from '../../sources/reduction/UnidocReducer'
import { reduceText } from '../../sources/reduction/reduceText'

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
describe('reduceText', function () {
  /**
   * 
   */
  it('returns null on start', function () {
    expect(
      result(
        function* (flow: UnidocEventFlow) {

        },
        reduceText
      )
    ).toBeNull()
  })

  /**
   * 
   */
  it('returns the given text as as string', function () {
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
          return yield* reduceText()
        }
      )
    ).toBe('ab cdef gh')
  })

  /**
   * 
   */
  it('trim the text', function () {
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
          return yield* reduceText()
        }
      )
    ).toBe('ab cdef gh')
  })

  /**
   * 
   */
  it('stop itself at any tag start', function () {
    const resultFlow: UnidocEventFlow = new UnidocEventFlow()
    resultFlow.skip('  ab  cdef \r\n\tgh')

    expect(
      stop(
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
          yield flow.thenTagStart('tag')
        },
        function* () {
          yield UnidocReduction.NEXT
          return yield* reduceText()
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
    resultFlow.skip('  ab  cdef \r\n\tgh')

    expect(
      stop(
        function* (flow: UnidocEventFlow) {
          flow.thenTagStart('tag', Empty.STRING)
          yield flow.thenWhitespace(' ')
          yield flow.thenWhitespace(' ')
          yield flow.thenWord('ab')
          yield flow.thenWhitespace('  ')
          yield flow.thenWord('cd')
          yield flow.thenWord('ef')
          yield flow.thenWhitespace(' \r\n')
          yield flow.thenWhitespace('\t')
          yield flow.thenWord('gh')
          yield flow.thenTagEnd()
        },
        function* () {
          yield UnidocReduction.NEXT
          return yield* reduceText()
        }
      )
    ).toBeNext(resultFlow.thenTagEnd())
  })
})
