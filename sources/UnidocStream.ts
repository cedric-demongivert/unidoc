import {
  UnidocCoroutine,
  skipSuccess as streamSkipSuccess,
  feed as streamFeed,
  UnidocSink
} from './stream'

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
  export const feed = streamFeed

  /**
   * 
   */
  export const skipSuccess = streamSkipSuccess
}