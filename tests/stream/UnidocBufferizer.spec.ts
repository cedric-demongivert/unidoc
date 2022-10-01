import { UnidocSink } from '../../sources/stream/UnidocSink'
import { UnidocBufferizer } from '../../sources/stream/UnidocBufferizer'
import { UnidocElement } from '../../sources/stream/UnidocElement'

import '../matchers'

/**
 * 
 */
describe('UnidocBufferizer', function () {
  /**
   * 
   */
  it('bufferize a stream into an array', function () {
    const sink: UnidocSink<number> = UnidocSink.create()
    const output: Array<UnidocElement<number>> = UnidocBufferizer.bufferize(sink)

    expect(output.length).toBe(0)

    sink.start()

    expect(output.length).toBe(1)
    expect(output[0]).toBeStart()

    sink.next(0)
    sink.next(1)

    expect(output.length).toBe(3)
    expect(output[1]).toBeNext(0)
    expect(output[2]).toBeNext(1)

    sink.success()

    expect(output.length).toBe(4)
    expect(output[3]).toBeSuccess()
  })

  /**
   * 
   */
  it('bufferize failures', function () {
    const sink: UnidocSink<number> = UnidocSink.create()
    const output: Array<UnidocElement<number>> = UnidocBufferizer.bufferize(sink)

    expect(output.length).toBe(0)

    sink.start()
    sink.next(0)
    sink.next(1)

    const error: Error = new Error('failure')

    sink.failure(error)

    expect(output.length).toBe(4)
    expect(output[3]).toBeFailure(error)
  })
})