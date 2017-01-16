const should = require('should')
const check = require('../assets/check.js')
const sinon = require('sinon')

describe('check', () => {
  it('should return a rejected promise if the conf is missing or not valid', done => {
    const main = check(sinon.spy())

    main()
      .then(done, ()=>done())
  })

  it('should return an empty list in case of no message available', async () =>{
    const jsonConfigStub = sinon.stub().returns({source: {}, version: null})

    class MockApi {
      getUpdates(){
        return {result: []}
      }
    }

    const main = check(jsonConfigStub, MockApi)
    const res = await main()

    return should(res).be.eql([])
  })
})
