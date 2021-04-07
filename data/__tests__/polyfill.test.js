import polyfill from '../polyfill.json'
import coreJsCompat from 'core-js-compat'

const allCoreJsModules = new Set(coreJsCompat.modules)

describe('polyfill data', () => {
  Object.keys(polyfill).forEach(version => {
    describe(`version ${version}`, () => {
      test('all modules should exists', () => {
        const {coreJsModules} = polyfill[version]
        for (const module of coreJsModules) {
          expect(allCoreJsModules).toContain(module)
        }
      })
    })
  })
})
