import { UnidocProducer } from './stream/UnidocProducer'
import { UnidocToken } from './token/UnidocToken'
import { UnidocEvent } from './event/UnidocEvent'
import { UnidocParser } from './parser/UnidocParser'

/**
* Transform a producer of tokens into a producer of document events.
*
* @param input - A producer of tokens.
*
* @return A producer of document events.
*/
export function parse(input: UnidocProducer<UnidocToken>): UnidocProducer<UnidocEvent> {
  const parser: UnidocParser = new UnidocParser()

  parser.subscribe(input)

  return parser
}
