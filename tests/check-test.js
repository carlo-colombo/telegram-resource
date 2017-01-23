const should = require('should')
const {factory: check} = require('../assets/check.js')
const sinon = require('sinon')
const {map} = require('lodash')

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
        result: [
          {message: {text: 'hi'}, update_id: 42},
          {message: {text: 'not_hi'}, update_id: 43},
        ]
      })
    }
    it('returns an update for each message available', async ()=>{
      const res = check(mockApi)()

      should(map(await res, 'update_id')).be.eql([42, 43])
    })

    describe('with a filter defined', ()=>{
      const filter = /not_hi/

      it('filters out messages not matching the regex',  async ()=>{
        const res = await check(mockApi, {}, filter)()

        should(map(await res, 'update_id')).be.eql([43])
      })

      it('filters out messages not matching the regex, even all of them',  async ()=>{
        const res = check(mockApi, {}, /asd/)()

        should(await res).be.eql([])
      })
    })
  })

  describe('when version is defined', ()=>{
    it('should use it to call getUpdates', ()=>{
      const mockApi = {
        getUpdates: sinon.stub().returns({result: []})
      }

      check(mockApi, {update_id: '42'})()

      sinon.assert.calledWith(mockApi.getUpdates, '42')
    })
  })
})
