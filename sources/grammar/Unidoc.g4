grammar Unidoc;

IDENTIFIER: '#' [a-zA-Z][a-zA-Z0-9\-]+;
CLASS: '.' [a-zA-Z][a-zA-Z0-9\-]+;
ESCAPED_BACKSLASH: '\\\\';
ESCAPED_BLOCK_OPENING: '\\}';
ESCAPED_BLOCK_ENDING: '\\{';
TYPE: '\\' [a-zA-Z][a-zA-Z0-9\-]+;
BLOCK_OPENING: '{';
BLOCK_CLOSING: '}';
LINE_BREAK: '\r\n'|'\n'|'\r';
SPACE: [ \t]+;
CONTENT: (~([\\ \t\n\r]|'{'|'}'))+;

unidoc: content EOF;

content: (tag | block | whitespace | word)*;

block: (identifier=IDENTIFIER)? whitespace? (classes+=CLASS whitespace? )* BLOCK_OPENING content BLOCK_CLOSING;

word: ~(BLOCK_OPENING|BLOCK_CLOSING|SPACE|LINE_BREAK)+;

whitespace: (space|linebreak)+;

space: SPACE;

linebreak: LINE_BREAK;

tag: type=TYPE whitespace? block?;
