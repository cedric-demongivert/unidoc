import { UnidocEvent } from '../event/UnidocEvent'

/**
* A low-level unidoc event listener.
*/
export interface UnidocListener {
  /**
  * Called when the parser enter into the root tag.
  *
  * @param event - Related event.
  */
  onEnteringRoot (event : UnidocEvent) : void

  /**
  * Called when the parser enter a tag.
  *
  * @param event - Related event.
  */
  onEnteringTag (event : UnidocEvent) : void

  /**
  * Called when the parser exit a tag.
  *
  * @param event - Related event.
  */
  onExitingTag (event : UnidocEvent) : void

  /**
  * Called when the parser enter a tag that is a direct child of the root tag.
  *
  * @param event - Related event.
  */
  onEnteringShallowTag (event : UnidocEvent) : void

  /**
  * Called when the parser exit a tag that is a direct child of the root tag.
  *
  * @param event - Related event.
  */
  onExitingShallowTag (event : UnidocEvent) : void

  /**
  * Called when the parser enter a tag that is a child of a child of the root tag.
  *
  * @param event - Related event.
  */
  onEnteringDeepTag (event : UnidocEvent) : void

  /**
  * Called when the parser exit a tag that is a child of a child of the root tag.
  *
  * @param event - Related event.
  */
  onExitingDeepTag (event : UnidocEvent) : void

  /**
  * Called when the parser discorver a word.
  *
  * @param event - Related event.
  */
  onWord (event : UnidocEvent) : void

  /**
  * Called when the parser discorver a whitespace.
  *
  * @param event - Related event.
  */
  onWhitespace (event : UnidocEvent) : void

  /**
  * Called when the parser exit the root tag.
  *
  * @param event - Related event.
  */
  onExitingRoot (event : UnidocEvent) : void
}
