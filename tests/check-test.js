const should = require('should')
const check = require('../assets/check.js')
const sinon = require('sinon')

function makeMock(result){
  return class MockApi{
    getUpdates(){
      return {result}
    }
  }
}

describe('check', () => {
  const jsonConfigStub = sinon.stub().returns({source: {}, version: null})

  it('should return a rejected promise if the conf is missing or not valid', done => {
    const main = check(sinon.spy())

    main()
      .then(done, ()=>done())
  })

  it('should return an empty list in case of no message available', async () =>{
    const main = check(jsonConfigStub, makeMock([]))
    const res = await main()

    return should(res).be.eql([])
  })

  it('should return an upadte for each message available', async ()=>{
    const main = check(jsonConfigStub, makeMock([{
      message: {text: 'hi'}, update_id: 42
    }]))
    const res = await main()

    return should(res).be.eql([{update_id: '42'}])
  })
})
