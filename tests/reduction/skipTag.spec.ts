import { Empty, Factory } from '@cedric-demongivert/gl-tool-utils'

import { UnidocEventFlow } from '../../sources/event/UnidocEventFlow'
import { UnidocEvent } from '../../sources/event/UnidocEvent'
import { UnidocReduction } from '../../sources/reduction/UnidocReduction'
import { UnidocReducer } from '../../sources/reduction/UnidocReducer'
import { skipTag } from '../../sources/reduction/skipTag'

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
describe('skipTag', function () {
  /**
   * 
   */
  it('does nothing on start', function () {
    expect(
      stop(
        function* (flow: UnidocEventFlow) {

        },
        skipTag
      )
    ).toBeStart()
  })

  /**
   * 
   */
  it('skip a tag', function () {
    expect(
      stop(
        function* (flow: UnidocEventFlow) {
          yield flow.thenTagStart('tag', '\\tag {')
          yield flow.thenWhitespace(' ')
          yield flow.thenWord('ab')
          yield flow.thenWhitespace('  ')
          yield flow.thenTagStart('strong', '\\strong {')
          yield flow.thenWhitespace('\t')
          yield flow.thenWord('ef')
          yield flow.thenWhitespace('  ')
          yield flow.thenTagEnd()
          yield flow.thenWhitespace(' \r\n')
          yield flow.thenWord('gh')
          yield flow.thenTagEnd()
        },
        function* () {
          yield UnidocReduction.NEXT
          return yield* skipTag()
        }
      )
    ).toBeSuccess()
  })

  /**
   * 
   */
  it('stop itself at the next event', function () {
    const resultFlow: UnidocEventFlow = new UnidocEventFlow()
    resultFlow.skip('\\tag { ab  \\strong {\tef  } \t\ngh}')

    expect(
      stop(
        function* (flow: UnidocEventFlow) {
          yield flow.thenTagStart('tag', '\\tag {')
          yield flow.thenWhitespace(' ')
          yield flow.thenWord('ab')
          yield flow.thenWhitespace('  ')
          yield flow.thenTagStart('strong', '\\strong {')
          yield flow.thenWhitespace('\t')
          yield flow.thenWord('ef')
          yield flow.thenWhitespace('  ')
          yield flow.thenTagEnd()
          yield flow.thenWhitespace(' \r\n')
          yield flow.thenWord('gh')
          yield flow.thenTagEnd()
          yield flow.thenWhitespace(' ')
        },
        function* () {
          yield UnidocReduction.NEXT
          return yield* skipTag()
        }
      )
    ).toBeNext(resultFlow.thenWhitespace(' '))
  })
})
