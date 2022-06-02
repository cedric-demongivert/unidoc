import { UnidocUTF32TextBuilder } from "../../sources/automaton/UnidocUTF32TextBuilder"
import { UnidocAutomatonGenerator } from "../../sources/automaton/UnidocAutomatonGenerator"

/**
 * 
 */
describe('UnidocAutomatonGenerator', function () {
  it('nothing', function () {
    console.log(UnidocAutomatonGenerator.generate(UnidocUTF32TextBuilder).code)
    expect(0).toBe(1)
  })
})