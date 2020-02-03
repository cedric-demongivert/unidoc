/** eslint-env jest */

import { UnidocPath } from '@library/path'
import { UnidocLocation } from '@library/UnidocLocation'

describe('UnidocPath', function () {
  describe('#constructor', function () {
    it('instantiate an empty path', function () {
      const path : UnidocPath = new UnidocPath()

      expect(path.size).toBe(0)
    })
  })

  describe('#get', function () {
    it('return the nth element', function () {
      const path : UnidocPath = new UnidocPath()
      const s1 : UnidocPath.Step = new UnidocPath.Step(new UnidocLocation())
      const s2 : UnidocPath.Step = new UnidocPath.Step(new UnidocLocation())
      const s3 : UnidocPath.Step = new UnidocPath.Step(new UnidocLocation())

      path.push(s1)
      path.push(s2)
      path.push(s3)

      expect(path.get(0)).toBe(s1)
      expect(path.get(1)).toBe(s2)
      expect(path.get(2)).toBe(s3)
    })
  })
})
