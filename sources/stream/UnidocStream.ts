import { UnidocCoroutine } from './UnidocCoroutine'
import { UnidocSink } from './UnidocSink'
import { UnidocBufferizer } from './UnidocBufferizer'
import { UnidocDuplicator } from './UnidocDuplicator'
import { UnidocSuccessSkipper } from './UnidocSuccessSkipper'
import { UnidocConsumer } from './UnidocConsumer'
import { UnidocPipe } from './UnidocPipe'

/**
 * 
 */
export namespace UnidocStream {
  /**
   * 
   */
  export const coroutine = UnidocCoroutine.create

  /**
   * 
   */
  export const sink = UnidocSink.create

  /**
   * 
   */
  export const pipe = UnidocPipe.of

  /**
   * 
   */
  export const bufferize = UnidocBufferizer.bufferize

  /**
   * 
   */
  export const duplicate = UnidocDuplicator.duplicate

  /**
   * 
   */
  export const feed = UnidocConsumer.feed

  /**
   * 
   */
  export const skipSuccess = UnidocSuccessSkipper.skip
}