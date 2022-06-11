import { Empty, Factory } from '@cedric-demongivert/gl-tool-utils'

import { UnidocEventFlow } from '../../sources/event/UnidocEventFlow'
import { UnidocEvent } from '../../sources/event/UnidocEvent'
import { UnidocReduction } from '../../sources/reduction/UnidocReduction'
import { UnidocReducer } from '../../sources/reduction/UnidocReducer'
import { skipWords } from '../../sources/reduction/skipWords'

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
describe('skipWords', function () {
  /**
   * 
   */
  it('does nothing on start', function () {
    expect(
      stop(
        function* (flow: UnidocEventFlow) {

        },
        skipWords
      )
    ).toBeStart()
  })

  /**
   * 
   */
  it('skip many words', function () {
    expect(
      stop(
        function* (flow: UnidocEventFlow) {
          yield flow.thenWord('ab')
          yield flow.thenWord('cd')
          yield flow.thenWord('ef')
        },
        function* () {
          yield UnidocReduction.NEXT
          return yield* skipWords()
        }
      )
    ).toBeSuccess()
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
          return yield* skipWords()
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
          return yield* skipWords()
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
          return yield* skipWords()
        }
      )
    ).toBeNext(resultFlow.thenTagEnd())
  })

})
