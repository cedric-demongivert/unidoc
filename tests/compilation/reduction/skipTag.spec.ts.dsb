import { UnidocRuntimeEventProducer } from '../../../sources/event/UnidocRuntimeEventProducer'
import { UnidocEvent } from '../../../sources/event/UnidocEvent'
import { UnidocBuffer } from '../../../sources/buffer/UnidocBuffer'
import { UnidocReductionInput } from '../../../sources/compilation/reduction/UnidocReductionInput'
import { reduce } from '../../../sources/compilation/reduction/common/reduce'
import { skipTag } from '../../../sources/compilation/reduction/common/skipTag'

describe('skipTag', function () {
  it('ignore a tag', function () {
    const eventStream: UnidocRuntimeEventProducer = new UnidocRuntimeEventProducer()
    const eventBuffer: UnidocBuffer<UnidocEvent> = UnidocBuffer.bufferize(eventStream, UnidocEvent.ALLOCATOR)

    eventStream.produceTagStart('strong')
    eventStream.produceText('Lorem.')
    eventStream.produceTagEnd('strong')
    eventStream.produceText('ipsum dolor sit amet consequetur.')

    function* content(): Generator<UnidocReductionInput> {
      yield UnidocReductionInput.START
      for (const event of eventBuffer) {
        yield UnidocReductionInput.event(event)
      }
      yield UnidocReductionInput.END
    }

    expect(reduce.iterator(content(), skipTag()).isWord('ipsum')).toBeTruthy()
  })

  it('does nothing if there is no tag to skip', function () {
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

    expect(reduce.iterator(content(), skipTag()).isWord('Lorem')).toBeTruthy()
  })

  it('skip spaces if there is not tag to skip', function () {
    const eventStream: UnidocRuntimeEventProducer = new UnidocRuntimeEventProducer()
    const eventBuffer: UnidocBuffer<UnidocEvent> = UnidocBuffer.bufferize(eventStream, UnidocEvent.ALLOCATOR)

    eventStream.produceText('    Lorem ipsum dolor sit amet consequetur.')

    function* content(): Generator<UnidocReductionInput> {
      yield UnidocReductionInput.START
      for (const event of eventBuffer) {
        yield UnidocReductionInput.event(event)
      }
      yield UnidocReductionInput.END
    }

    expect(reduce.iterator(content(), skipTag()).isWord('Lorem')).toBeTruthy()
  })

  it('skip start if there is not tag to skip', function () {
    function* content(): Generator<UnidocReductionInput> {
      yield UnidocReductionInput.START
      yield UnidocReductionInput.END
    }

    expect(reduce.iterator(content(), skipTag()).isEnd()).toBeTruthy()
  })
})
