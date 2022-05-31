import { UnidocDisjunctionBlueprint } from '../../sources/blueprint/UnidocDisjunctionBlueprint'

describe('UnidocDisjunctionBlueprint', function() {
  describe('#toString', function() {
    it('successfully stringify recursive disjunctions', function() {
      const blueprint: UnidocDisjunctionBlueprint = new UnidocDisjunctionBlueprint()
      blueprint.or(blueprint)

      expect(blueprint.toString()).toBe(
        '+ 0: ' + UnidocDisjunctionBlueprint.name + '\r\n' +
        '\t> @0\r\n' +
        '- 0: ' + UnidocDisjunctionBlueprint.name
      )
    })

    it('successfully handle maximum recursion depth', function() {
      const blueprint: UnidocDisjunctionBlueprint = new UnidocDisjunctionBlueprint()
      blueprint.or(new UnidocDisjunctionBlueprint())
      blueprint.or(new UnidocDisjunctionBlueprint())
      blueprint.or(new UnidocDisjunctionBlueprint())

      expect(blueprint.toString(0)).toBe(
        '+ 0: ' + UnidocDisjunctionBlueprint.name + '\r\n' +
        '\t...\r\n' +
        '- 0: ' + UnidocDisjunctionBlueprint.name
      )
    })

    it('successfully pass maximum recursion depth', function() {
      const blueprint: UnidocDisjunctionBlueprint = new UnidocDisjunctionBlueprint()
      blueprint.or(
        new UnidocDisjunctionBlueprint().or(new UnidocDisjunctionBlueprint())
      )
      blueprint.or(
        new UnidocDisjunctionBlueprint().or(new UnidocDisjunctionBlueprint())
      )
      blueprint.or(
        new UnidocDisjunctionBlueprint().or(new UnidocDisjunctionBlueprint())
      )

      expect(blueprint.toString(1)).toBe(
        '+ 0: ' + UnidocDisjunctionBlueprint.name + '\r\n' +
        '\t+ 1: ' + UnidocDisjunctionBlueprint.name + '\r\n' +
        '\t\t...\r\n' +
        '\t- 1: ' + UnidocDisjunctionBlueprint.name + '\r\n' +
        '\t+ 2: ' + UnidocDisjunctionBlueprint.name + '\r\n' +
        '\t\t...\r\n' +
        '\t- 2: ' + UnidocDisjunctionBlueprint.name + '\r\n' +
        '\t+ 3: ' + UnidocDisjunctionBlueprint.name + '\r\n' +
        '\t\t...\r\n' +
        '\t- 3: ' + UnidocDisjunctionBlueprint.name + '\r\n' +
        '- 0: ' + UnidocDisjunctionBlueprint.name
      )
    })
  })
})
