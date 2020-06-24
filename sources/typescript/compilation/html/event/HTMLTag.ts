export type HTMLTag = string

export namespace HTMLTag {
  export const PARAGRAPH : HTMLTag = 'p'
  export const EMPHASIZE : HTMLTag = 'em'
  export const STRONG    : HTMLTag = 'strong'
  export const SPAN      : HTMLTag = 'span'
  export const HEADING_1 : HTMLTag = 'h1'
  export const HEADING_2 : HTMLTag = 'h2'
  export const HEADING_3 : HTMLTag = 'h3'
  export const HEADING_4 : HTMLTag = 'h4'
  export const HEADING_5 : HTMLTag = 'h5'
  export const HEADING_6 : HTMLTag = 'h6'

  export const ALL : HTMLTag[] = [
    PARAGRAPH,
    EMPHASIZE,
    STRONG,
    SPAN,
    HEADING_1,
    HEADING_2,
    HEADING_3,
    HEADING_4,
    HEADING_5,
    HEADING_6
  ]

  export function heading (index : number) : HTMLTag {
    switch (index) {
      case 1  : return HEADING_1
      case 2  : return HEADING_2
      case 3  : return HEADING_3
      case 4  : return HEADING_4
      case 5  : return HEADING_5
      case 6  : return HEADING_6
      case 7  : return STRONG
      case 8  : return EMPHASIZE
      default : return SPAN
    }
  }
}
