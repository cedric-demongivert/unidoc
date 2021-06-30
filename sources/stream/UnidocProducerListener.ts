/**
 * 
 */
export type UnidocProducerListener<Output> = (
  UnidocProducerListener.Next<Output> |
  UnidocProducerListener.Start |
  UnidocProducerListener.Success |
  UnidocProducerListener.Failure
)

/**
 * 
 */
export namespace UnidocProducerListener {
  /**
   * 
   */
  export type Next<Output> = (value: Readonly<Output>) => void

  /**
   * 
   */
  export type Start = () => void

  /**
   * 
   */
  export type Success = () => void

  /**
   * 
   */
  export type Failure = (error: Error) => void
}