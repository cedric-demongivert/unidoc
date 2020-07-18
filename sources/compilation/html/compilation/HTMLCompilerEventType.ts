export type HTMLCompilerEventType = string

export namespace HTMLCompilerEventType {
  export const CONTENT    : HTMLCompilerEventType = 'content'
  export const COMPLETION : HTMLCompilerEventType = 'completion'
  export const ERROR      : HTMLCompilerEventType = 'error'

  export const ALL        : HTMLCompilerEventType[] = [
    CONTENT, COMPLETION, ERROR
  ]
}
