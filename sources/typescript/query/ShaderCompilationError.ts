import { GLShader } from './GLShader'

export class ShaderCompilationError extends Error {
  public readonly shader : GLShader
  public readonly source : string

  /**
  * Instantiate a new shader compilation error.
  *
  * @param shader - Shader that failed to compile.
  */
  public constructor (shader : GLShader) {
    super(
      'Shader compilation failed. \r\n\r\n' +
      'Source code : \r\n' + (
        shader.source.split(/\r\n|\n|\r/).map(
          (line : string, index : number, lines : string[]) => (
            (index + 1).toString().padStart(`${lines.length}`.length, ' ') +
            ' : ' + line
          )
        ).join('\r\n')
      ) +
      '\r\n\r\n' +
      'Log :\r\n' +
      shader.logs
    )

    this.shader = shader
    this.source = shader.source
  }
}
