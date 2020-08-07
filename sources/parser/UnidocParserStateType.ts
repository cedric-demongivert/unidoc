export type UnidocParserStateType = number

export namespace UnidocParserStateType {
  /**
  * State of the parser after it's initialization. In other words, this is the
  * state of the parser before it discover the first token of the document.
  */
  export const START : UnidocParserStateType = 0

  /**
  * State of the parser after the discovering an arbitrary number of leading
  * spaces at the begining of the document. In this particular state the parser
  * await for more tokens for clarifing if theses spaces are inner document
  * content or if they just leading a stream tag declaration.
  */
  export const LEADING_WHITESPACE : UnidocParserStateType = 1

  /**
  * State of the parser when it has discovered a stream tag with an arbitrary
  * number of classes. In this state the parser expect to receive another stream
  * tag classes, a stream tag identifier, spaces, or any document content.
  */
  export const CLASS_OF_STREAM_WITHOUT_IDENTIFIER : UnidocParserStateType = 2

  /**
  * State of the parser when it has discovered an arbitrary number of
  * whitespaces after a stream tag followed by an arbitrary number of classes.
  * In this state the parser expect to receive another stream tag classes, a
  * stream tag identifier, more spaces, or any document content.
  */
  export const WHITESPACE_AFTER_CLASS_OF_STREAM_WITHOUT_IDENTIFIER : UnidocParserStateType = 3

  /**
  * State of the parser when it has discovered a stream tag followed by an
  * arbitrary number of classes, an identifier and another arbitrary number of
  * classes. In this state the parser expect to receive another stream
  * tag classes, spaces, or any document content.
  */
  export const CLASS_OF_STREAM_WITH_IDENTIFIER : UnidocParserStateType = 4

  /**
  * State of the parser when it has discovered an arbitrary number of
  * whitespaces after a stream tag followed by an arbitrary number of classes,
  * an identifier and another arbitrary number of classes. In this state the
  * parser expect to receive another stream tag classes, spaces, or any document
  * content.
  */
  export const WHITESPACE_AFTER_CLASS_OF_STREAM_WITH_IDENTIFIER : UnidocParserStateType = 5

  /**
  * State of the parser when it await any document stream content. More
  * precisely any new spaces, tag or word.
  */
  export const STREAM_CONTENT : UnidocParserStateType = 6

  /**
  * State of the parser when it await any tag content. More precisely any new
  * spaces, tag, word or tag block termination.
  */
  export const BLOCK_CONTENT : UnidocParserStateType = 7

  /**
  * State of the parser when it fail in an unrecoverable error.
  */
  export const ERROR : UnidocParserStateType = 8

  /**
  * State of the parser when it has discovered an arbitrary number of
  * whitespaces that are a content of a tag or a document. In this state the
  * parser await for more whitespaces or any new content.
  */
  export const WHITESPACE : UnidocParserStateType = 9

  /**
  * State of the parser when it has discovered an arbitrary number of words
  * that are a content of a tag or a document. In this state the parser await
  * for more words or any new content.
  */
  export const WORD : UnidocParserStateType = 10

  /**
  * State of the parser when it has discovered a tag with an arbitrary number of
  * classes. In this state the parser expect to receive another tag classes, a
  * tag identifier, spaces, at tag block begining or any following content.
  */
  export const CLASS_OF_TAG_WITHOUT_IDENTIFIER : UnidocParserStateType = 11

  /**
  * State of the parser when it has discovered an arbitrary number of
  * whitespaces after a tag followed by an arbitrary number of classes.
  * In this state the parser expect to receive another tag classes, a tag
  * identifier, more spaces, a tag block begining or any following content.
  */
  export const WHITESPACE_AFTER_CLASS_OF_TAG_WITHOUT_IDENTIFIER : UnidocParserStateType = 12

  /**
  * State of the parser when it has discovered a tag followed by an arbitrary
  * number of classes, an identifier and another arbitrary number of classes. In
  * this state the parser expect to receive another tag classes, spaces, a tag
  * block begining or any following content.
  */
  export const CLASS_OF_TAG_WITH_IDENTIFIER : UnidocParserStateType = 13

  /**
  * State of the parser when it has discovered an arbitrary number of
  * whitespaces after a tag followed by an arbitrary number of classes, an
  * identifier and another arbitrary number of classes. In this state the parser
  * expect to receive another tag classes, spaces, a tag block begining or any
  * following content.
  */
  export const WHITESPACE_AFTER_CLASS_OF_TAG_WITH_IDENTIFIER : UnidocParserStateType = 14

  /**
  * State of the parser at the end of the stream.
  */
  export const TERMINATION : UnidocParserStateType = 15

  /**
  * State of the parser by default.
  */
  export const DEFAULT : UnidocParserStateType = START

  /**
  * A list of all possible states of a parser.
  */
  export const ALL : UnidocParserStateType[] = [
    START,
    LEADING_WHITESPACE,
    CLASS_OF_STREAM_WITHOUT_IDENTIFIER,
    WHITESPACE_AFTER_CLASS_OF_STREAM_WITHOUT_IDENTIFIER,
    CLASS_OF_STREAM_WITH_IDENTIFIER,
    WHITESPACE_AFTER_CLASS_OF_STREAM_WITH_IDENTIFIER,
    STREAM_CONTENT,
    BLOCK_CONTENT,
    ERROR,
    WHITESPACE,
    WORD,
    CLASS_OF_TAG_WITHOUT_IDENTIFIER,
    WHITESPACE_AFTER_CLASS_OF_TAG_WITHOUT_IDENTIFIER,
    CLASS_OF_TAG_WITH_IDENTIFIER,
    WHITESPACE_AFTER_CLASS_OF_TAG_WITH_IDENTIFIER,
    TERMINATION
  ]

  /**
  * Stringify the given state.
  *
  * @param state - A state to stringify.
  *
  * @return A string representation of the given state.
  */
  export function toString (state : UnidocParserStateType) : string | undefined {
    switch (state) {
      case START                                               : return 'START'
      case LEADING_WHITESPACE                                  : return 'LEADING_WHITESPACE'
      case CLASS_OF_STREAM_WITHOUT_IDENTIFIER                  : return 'CLASS_OF_STREAM_WITHOUT_IDENTIFIER'
      case WHITESPACE_AFTER_CLASS_OF_STREAM_WITHOUT_IDENTIFIER : return 'WHITESPACE_AFTER_CLASS_OF_STREAM_WITHOUT_IDENTIFIER'
      case CLASS_OF_STREAM_WITH_IDENTIFIER                     : return 'CLASS_OF_STREAM_WITH_IDENTIFIER'
      case WHITESPACE_AFTER_CLASS_OF_STREAM_WITH_IDENTIFIER    : return 'WHITESPACE_AFTER_CLASS_OF_STREAM_WITH_IDENTIFIER'
      case STREAM_CONTENT                                      : return 'STREAM_CONTENT'
      case BLOCK_CONTENT                                       : return 'BLOCK_CONTENT'
      case ERROR                                               : return 'ERROR'
      case WHITESPACE                                          : return 'WHITESPACE'
      case WORD                                                : return 'WORD'
      case CLASS_OF_TAG_WITHOUT_IDENTIFIER                     : return 'CLASS_OF_TAG_WITHOUT_IDENTIFIER'
      case WHITESPACE_AFTER_CLASS_OF_TAG_WITHOUT_IDENTIFIER    : return 'WHITESPACE_AFTER_CLASS_OF_TAG_WITHOUT_IDENTIFIER'
      case CLASS_OF_TAG_WITH_IDENTIFIER                        : return 'CLASS_OF_TAG_WITH_IDENTIFIER'
      case WHITESPACE_AFTER_CLASS_OF_TAG_WITH_IDENTIFIER       : return 'WHITESPACE_AFTER_CLASS_OF_TAG_WITH_IDENTIFIER'
      case TERMINATION                                         : return 'TERMINATION'
      default                                                  : return undefined
    }
  }
}
