import { Empty, Factory } from '@cedric-demongivert/gl-tool-utils'

import { UnidocEventFlow } from '../../sources/event/UnidocEventFlow'
import { UnidocEvent } from '../../sources/event/UnidocEvent'
import { UnidocReduction } from '../../sources/reduction/UnidocReduction'
import { UnidocReducer } from '../../sources/reduction/UnidocReducer'
import { skipText } from '../../sources/reduction/skipText'

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
describe('skipText', function () {
  /**
   * 
   */
  it('does nothing on start', function () {
    expect(
      stop(
        function* (flow: UnidocEventFlow) {

        },
        skipText
      )
    ).toBeStart()
  })

  /**
   * 
   */
  it('skip many words and whitespaces', function () {
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
        },
        function* () {
          yield UnidocReduction.NEXT
          return yield* skipText()
        }
      )
    ).toBeSuccess()
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
          return yield* skipText()
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
          return yield* skipText()
        }
      )
    ).toBeNext(resultFlow.thenTagEnd())
  })

})
