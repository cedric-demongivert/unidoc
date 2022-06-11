import { Empty, Factory } from '@cedric-demongivert/gl-tool-utils'

import { UnidocEventFlow } from '../../sources/event/UnidocEventFlow'
import { UnidocEvent } from '../../sources/event/UnidocEvent'
import { UnidocReduction } from '../../sources/reduction/UnidocReduction'
import { UnidocReducer } from '../../sources/reduction/UnidocReducer'
import { skipWhitespaces } from '../../sources/reduction/skipWhitespaces'

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
describe('skipWhitespaces', function () {
  /**
   * 
   */
  it('does nothing on start', function () {
    expect(
      stop(
        function* (flow: UnidocEventFlow) {

        },
        skipWhitespaces
      )
    ).toBeStart()
  })

  /**
   * 
   */
  it('skip many whitespaces', function () {
    expect(
      stop(
        function* (flow: UnidocEventFlow) {
          yield flow.thenWhitespace('  ')
          yield flow.thenWhitespace('\t ')
          yield flow.thenWhitespace('\r\n')
        },
        function* () {
          yield UnidocReduction.NEXT
          return yield* skipWhitespaces()
        }
      )
    ).toBeSuccess()
  })

  /**
   * 
   */
  it('stop itself at any word', function () {
    const resultFlow: UnidocEventFlow = new UnidocEventFlow()
    resultFlow.skip('  \t \r\n')

    expect(
      stop(
        function* (flow: UnidocEventFlow) {
          yield flow.thenWhitespace('  ')
          yield flow.thenWhitespace('\t ')
          yield flow.thenWhitespace('\r\n')
          yield flow.thenWord('token')
        },
        function* () {
          yield UnidocReduction.NEXT
          return yield* skipWhitespaces()
        }
      )
    ).toBeNext(resultFlow.thenWord('token'))
  })

  /**
   * 
   */
  it('stop itself at any tag start', function () {
    const resultFlow: UnidocEventFlow = new UnidocEventFlow()
    resultFlow.skip('  \t \r\n')

    expect(
      stop(
        function* (flow: UnidocEventFlow) {
          yield flow.thenWhitespace('  ')
          yield flow.thenWhitespace('\t ')
          yield flow.thenWhitespace('\r\n')
          yield flow.thenTagStart('tag')
        },
        function* () {
          yield UnidocReduction.NEXT
          return yield* skipWhitespaces()
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
    resultFlow.skip('  \t \r\n')

    expect(
      stop(
        function* (flow: UnidocEventFlow) {
          flow.thenTagStart('tag', Empty.STRING)
          yield flow.thenWhitespace('  ')
          yield flow.thenWhitespace('\t ')
          yield flow.thenWhitespace('\r\n')
          yield flow.thenTagEnd()
        },
        function* () {
          yield UnidocReduction.NEXT
          return yield* skipWhitespaces()
        }
      )
    ).toBeNext(resultFlow.thenTagEnd())
  })

})
