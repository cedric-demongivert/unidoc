import { UnidocRuntimeEventProducer } from '../../../sources/event/UnidocRuntimeEventProducer'
import { UnidocEvent } from '../../../sources/event/UnidocEvent'
import { UnidocBuffer } from '../../../sources/buffer/UnidocBuffer'
import { UnidocReductionInput } from '../../../sources/compilation/reduction/UnidocReductionInput'
import { reduce } from '../../../sources/compilation/reduction/common/reduce'
import { reduceToken } from '../../../sources/compilation/reduction/common/reduceToken'
import { reduceMany } from '../../../sources/compilation/reduction/common/reduceMany'

describe('reduceMany', function () {
  it('reduce by using a nested reducer as many times as possible', function () {
    const eventStream: UnidocRuntimeEventProducer = new UnidocRuntimeEventProducer()
    const eventBuffer: UnidocBuffer<UnidocEvent> = UnidocBuffer.bufferize(eventStream, UnidocEvent.ALLOCATOR)

    eventStream.produceText('Lorem ipsum dolor sit amet consequetur.')

    function* content(): Generator<UnidocReductionInput> {
      yield UnidocReductionInput.START
      for (const event of eventBuffer) {
        yield UnidocReductionInput.event(event)
      }
      yield UnidocReductionInput.END
    }

    expect(
      reduce.iterator(content(), reduceMany(reduceToken))
    ).toEqual(['Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consequetur.'])
  })
})
