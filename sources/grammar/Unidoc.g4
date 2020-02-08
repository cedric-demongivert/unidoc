grammar Unidoc;

LINE_BREAK: '\r\n'|'\n'|'\r';
SPACE: [ \t];
IDENTIFIER: [a-zA-Z\-][a-zA-Z0-9\-]+;
IDENTIFIER_MARKER: '#';
CLASS_MARKER: '.';
ESCAPED_TYPE_PREFIX: '\\\\';
ESCAPED_BLOCK_OPENING: '\\}';
ESCAPED_BLOCK_ENDING: '\\{';
TYPE_PREFIX: '\\';
BLOCK_OPENING: '{';
BLOCK_CLOSING: '}';
CONTENT: .;

unidoc: content EOF;

content: (tag | block | whitespace | word)*;

block: (IDENTIFIER_MARKER identifier=IDENTIFIER)? whitespace? (CLASS_MARKER classes+=IDENTIFIER whitespace? )* BLOCK_OPENING content BLOCK_CLOSING;

word: ~(BLOCK_OPENING|BLOCK_CLOSING|SPACE|LINE_BREAK)+;

whitespace: (space|linebreak)+;

space: SPACE+;

linebreak: LINE_BREAK;

tag: TYPE_PREFIX type=IDENTIFIER whitespace? block?;
