const should = require('should')
const check = require('../assets/check.js')
const sinon = require('sinon')

describe('check', () => {
  describe('with no message available', ()=>{
    it('returns an empty list', async () =>{
      const res = check({
        getUpdates: () => ({result: []})
      })()

      return should(await res).be.eql([])
    })
  })

  describe('with messages available', ()=>{
    const mockApi = {
      getUpdates: () => ({
        result: [{message: {text: 'hi'}, update_id: 42}]
      })
    }
    it('returns an update for each message available', async ()=>{
      const res = check(mockApi)()

      should(await res).be.eql([{update_id: '42'}])
    })

    describe('with a filter defined', ()=>{
      const filter = /not_hi/

      it('filters out messages not matching the regex',  async ()=>{
        const res = await check({
          getUpdates: () => ({
            result: [
              {message: {text: 'hi'}, update_id: 42},
              {message: {text: 'not_hi'}, update_id: 43},
            ]
          })
        }, {}, filter)()

        should(await res).be.eql([{update_id: '43'}])
      })

      it('filters out messages not matching the regex, even all of them',  async ()=>{
        const res = check(mockApi, {}, filter)()

        should(await res).be.eql([])
      })
    })
  })

})
