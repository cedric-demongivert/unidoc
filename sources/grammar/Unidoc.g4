grammar Unidoc;

WHITESPACE: [ \n\r\t];
IDENTIFIER: [a-zA-Z\-][a-zA-Z0-9\-]+;
IDENTIFIER_MARKER: '#';
CLASS_MARKER: '.';
ESCAPED_BACKSLASH: '\\\\';
ESCAPED_BLOCK_OPENING: '\\}';
ESCAPED_BLOCK_ENDING: '\\{';
BLOCK_OPENING: '{';
BLOCK_CLOSING: '}';

unidoc: content EOF;

content: (element | block | word | whitespace)*;

block: (IDENTIFIER_MARKER identifier=IDENTIFIER)? whitespace? (CLASS_MARKER classes+=IDENTIFIER whitespace? )* BLOCK_OPENING content? BLOCK_CLOSING;

word: ~(BLOCK_OPENING|BLOCK_CLOSING|WHITESPACE)+;

whitespace: WHITESPACE+;

element: '\\' type=IDENTIFIER whitespace? block?;
