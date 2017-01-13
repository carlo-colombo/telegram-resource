const should = require('should')
const check = require('../assets/check.js')

describe('check', () => {
  it('should return an empty list in case of missing configuration', async () => {
    const main = check(() => null)
    const res = await main()
    return should(res).be.eql([])
  })
})
