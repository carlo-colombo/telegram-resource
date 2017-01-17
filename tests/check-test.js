const should = require('should')
const check = require('../assets/check.js')
const sinon = require('sinon')

describe('check', () => {
  // it('should return a rejected promise if the conf is missing or not valid', done => {
  //   const main = check(sinon.spy())

  //   main().then(done, ()=>done())
  // })

  describe('with a valid configuration', ()=>{
    it('returns an empty list in case of no message available', async () =>{
      const res = check({
        getUpdates: sinon.mock().returns({result: []})
      })()

      return should(await res).be.eql([])
    })

    it('returns an update for each message available', async ()=>{
      const res = check({
        getUpdates: sinon.mock().returns({
          result: [{message: {text: 'hi'}, update_id: 42}]
        })
      })()

      should(await res).be.eql([{update_id: '42'}])
    })

  })

  describe('with a filter defined', ()=>{
    const filter = /not_hi/
    it('filters out messages not matching the regex',  async ()=>{
      const res = await check({
        getUpdates: sinon.mock().returns({
          result: [
            {message: {text: 'hi'}, update_id: 42},
            {message: {text: 'not_hi'}, update_id: 43},
          ]
        })
      }, {}, filter)()

      should(await res).be.eql([{update_id: '43'}])
    })

    it('filters out messages not matching the regex, even all of them',  async ()=>{
      const res = check({
        getUpdates: sinon.mock().returns({
          result: [
            {message: {text: 'hi'}, update_id: 42},
          ]
        })
      }, {}, filter)()

      should(await res).be.eql([])
    })
  })
})
